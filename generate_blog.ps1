# Ensure blog directory exists in workspace root
$blogDir = Join-Path $PSScriptRoot "blog"
if (-not (Test-Path $blogDir)) {
    New-Item -ItemType Directory -Path $blogDir -Force | Out-Null
}

# 1. Dynamically parse the blogs database from generate_blog.js
$dbPath = Join-Path $PSScriptRoot "generate_blog.js"
if (-not (Test-Path $dbPath)) {
    Write-Error "generate_blog.js not found at $dbPath!"
    exit 1
}

Write-Host "Parsing blog database from generate_blog.js..."
$lines = [System.IO.File]::ReadAllLines($dbPath, [System.Text.Encoding]::UTF8)

$blogs = @()
$currentBlog = $null
$state = 'none' # 'none', 'aiSnippet', 'contentHtml', 'faqs'
$tempContentHtml = @()
$tempFaqs = @()
$currentFaq = $null

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $trimmed = $line.Trim()

    if ($trimmed -eq '];' -and $state -eq 'none') {
        break
    }

    if ($state -eq 'contentHtml') {
        if ($trimmed -eq '`,' -or $trimmed -eq '`') {
            $currentBlog.ContentHtml = $tempContentHtml -join "`r`n"
            $state = 'none'
        } else {
            $tempContentHtml += $line
        }
        continue
    }

    if ($state -eq 'aiSnippet') {
        if ($trimmed -eq '],' -or $trimmed -eq ']') {
            $state = 'none'
        } else {
            if ($line -match '"([^"]+)"') {
                $currentBlog.AiSnippet += $Matches[1]
            }
        }
        continue
    }

    if ($state -eq 'faqs') {
        if ($trimmed -eq ']' -or $trimmed -eq '],') {
            $currentBlog.Faqs = $tempFaqs
            $state = 'none'
        } elseif ($trimmed -eq '{' -or $trimmed -eq '{,') {
            $currentFaq = [PSCustomObject]@{
                Question = ''
                Answer = ''
            }
        } elseif ($trimmed -eq '}' -or $trimmed -eq '},') {
            $tempFaqs += $currentFaq
        } else {
            if ($line -match 'question:\s*"([^"]+)"') {
                $currentFaq.Question = $Matches[1]
            } elseif ($line -match 'answer:\s*"([^"]+)"') {
                $currentFaq.Answer = $Matches[1]
            }
        }
        continue
    }

    # Detect blog start
    if ($trimmed -eq '{' -and $state -eq 'none') {
        $currentBlog = [PSCustomObject]@{
            Slug = ''
            Title = ''
            Keyword = ''
            Category = ''
            Date = ''
            ReadTime = ''
            Excerpt = ''
            HeroImage = ''
            AiSnippet = @()
            Introduction = ''
            ContentHtml = ''
            Faqs = @()
        }
        continue
    }

    # Detect blog end
    if ($trimmed -eq '},' -and $state -eq 'none' -and $currentBlog -ne $null) {
        $blogs += $currentBlog
        $currentBlog = $null
        continue
    }
    if ($trimmed -eq '}' -and $state -eq 'none' -and $currentBlog -ne $null) {
        $blogs += $currentBlog
        $currentBlog = $null
        continue
    }

    # Match fields using single quotes
    if ($line -match 'slug:\s*"([^"]+)"') {
        $currentBlog.Slug = $Matches[1]
    } elseif ($line -match 'title:\s*"([^"]+)"') {
        $currentBlog.Title = $Matches[1]
    } elseif ($line -match 'keyword:\s*"([^"]+)"') {
        $currentBlog.Keyword = $Matches[1]
    } elseif ($line -match 'category:\s*"([^"]+)"') {
        $currentBlog.Category = $Matches[1]
    } elseif ($line -match 'date:\s*"([^"]+)"') {
        $currentBlog.Date = $Matches[1]
    } elseif ($line -match 'readTime:\s*"([^"]+)"') {
        $currentBlog.ReadTime = $Matches[1]
    } elseif ($line -match 'excerpt:\s*"([^"]+)"') {
        $currentBlog.Excerpt = $Matches[1]
    } elseif ($line -match 'heroImage:\s*"([^"]+)"') {
        $currentBlog.HeroImage = $Matches[1]
    } elseif ($line -match 'introduction:\s*"([^"]+)"') {
        $currentBlog.Introduction = $Matches[1]
    } elseif ($line -match 'aiSnippet:\s*\[') {
        $state = 'aiSnippet'
    } elseif ($line -match 'contentHtml:\s*`') {
        $state = 'contentHtml'
        $tempContentHtml = @()
    } elseif ($line -match 'faqs:\s*\[') {
        $state = 'faqs'
        $tempFaqs = @()
    }
}

Write-Host "Successfully parsed $($blogs.Count) blogs from database."

# 2. Consolidated Blog Hub Template Function
function Get-HubHtml {
    param($blogsList)
    
    $cardsHtml = ""
    foreach ($blog in $blogsList) {
        $card = @'
                <div class="blog-card bg-white rounded-xl shadow-md overflow-hidden border border-border-color hover:shadow-lg transition flex flex-col" data-category="##CATEGORY##">
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xs font-semibold px-3 py-1 bg-teal-50 text-secondary border border-teal-200 rounded-full">##CATEGORY##</span>
                            <span class="text-xs text-text-muted">##READ_TIME##</span>
                        </div>
                        <h2 class="text-xl font-serif font-bold text-primary mb-3 hover:text-secondary">
                            <a href="/blog/##SLUG##.html">##TITLE##</a>
                        </h2>
                        <p class="text-sm text-text-muted mb-6 flex-grow">##EXCERPT##</p>
                        <div class="flex items-center justify-between border-t border-border-color pt-4 mt-auto">
                            <span class="text-xs text-text-muted">Updated: ##DATE##</span>
                            <a href="/blog/##SLUG##.html" class="text-sm font-semibold text-secondary hover:text-secondary-light flex items-center gap-1">Read Guide &rarr;</a>
                        </div>
                    </div>
                </div>
'@
        $card = $card -replace '##CATEGORY##', $blog.Category
        $card = $card -replace '##READ_TIME##', $blog.ReadTime
        $card = $card -replace '##SLUG##', $blog.Slug
        $card = $card -replace '##TITLE##', $blog.Title
        $card = $card -replace '##EXCERPT##', $blog.Excerpt
        $card = $card -replace '##DATE##', $blog.Date
        $cardsHtml += $card
    }

    $html = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Explore local travel guides, packing checklists, itineraries, and expert logistics advice for Shimla and Manali from SMILE HOLIDAY MAKERS.">
    <title>Himachal Travel Guides & Blog Hub | SMILE HOLIDAY MAKERS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '#1E3547',
                            light: '#2C485E',
                        },
                        secondary: {
                            DEFAULT: '#2C7A7B',
                            light: '#319795',
                        },
                        accent: {
                            DEFAULT: '#E28743',
                            hover: '#D07633',
                        },
                        'bg-light': '#F7FAFC',
                        'text-dark': '#2D3748',
                        'text-muted': '#718096',
                        'border-color': '#E2E8F0',
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        serif: ['Montserrat', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="../css/styles.css">
    <style>
        .header-nav { background: #ffffff !important; }
        .logo-text { color: #1E3547 !important; }
    </style>
</head>
<body class="bg-bg-light text-text-dark font-sans leading-relaxed">

    <!-- GLOBAL HEADER & NAVIGATION -->
    <header class="header-nav" id="headerNav">
        <div class="container nav-container">
            <a href="../index.html" class="logo-link" id="logoLink">
                <img src="../images/logo.png" alt="SMILE HOLIDAY MAKERS Logo" class="logo-img">
                <span class="logo-text">SMILE<span> HOLIDAY MAKERS</span></span>
            </a>
            
            <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav class="nav-menu" id="navMenu">
                <a href="../index.html" class="nav-link">Home</a>
                <a href="../manali.html" class="nav-link">Manali Packages</a>
                <a href="../shimla.html" class="nav-link">Shimla Packages</a>
                <a href="../combined.html" class="nav-link">Combined Tours</a>
                <a href="index.html" class="nav-link">Guides</a>
                <a href="../about.html" class="nav-link">About Us</a>
                <a href="../contact.html" class="btn btn-primary btn-sm">Get a Free Quote</a>
            </nav>
        </div>
    </header>

    <!-- HERO BANNER -->
    <section class="bg-primary text-white pt-28 pb-16 text-center px-4">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">Himachal Travel Guides & Insights</h1>
            <p class="text-lg text-slate-300">Expert trip planning advice, custom itineraries, packing lists, and secret mountain excursions. Curated by our local specialists to help you <strong>Stress Less, Travel More</strong>.</p>
        </div>
    </section>

    <!-- CONTENT WRAPPER -->
    <main class="container mx-auto px-4 py-12">
        <div class="flex flex-wrap items-center justify-center gap-4 mb-10 border-b border-border-color pb-6">
            <button onclick="filterCategory('All')" class="category-tab active px-5 py-2 rounded-full font-semibold border border-primary bg-primary text-white transition">All Guides</button>
            <button onclick="filterCategory('Itineraries')" class="category-tab px-5 py-2 rounded-full font-semibold border border-border-color bg-white hover:border-primary transition">Itineraries</button>
            <button onclick="filterCategory('Adventure & Culture')" class="category-tab px-5 py-2 rounded-full font-semibold border border-border-color bg-white hover:border-primary transition">Adventure & Culture</button>
            <button onclick="filterCategory('Travel Logistics')" class="category-tab px-5 py-2 rounded-full font-semibold border border-border-color bg-white hover:border-primary transition">Travel Logistics</button>
        </div>

        <div id="blogGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ##CARDS##
        </div>
    </main>

    <!-- TRUST BADGES -->
    <section class="bg-white py-12 border-t border-border-color">
        <div class="container mx-auto px-4 max-w-5xl">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div class="p-4 rounded-lg bg-bg-light border border-border-color shadow-sm">
                    <span class="text-2xl mb-2 block">&#x1F476;</span>
                    <h4 class="font-serif font-semibold text-primary text-sm mb-1">Under 5 Free</h4>
                    <p class="text-xs text-text-muted">No charge for young kids</p>
                </div>
                <div class="p-4 rounded-lg bg-bg-light border border-border-color shadow-sm">
                    <span class="text-2xl mb-2 block">&#x1F3F7;&#xFE0F;</span>
                    <h4 class="font-serif font-semibold text-primary text-sm mb-1">No Hidden GST</h4>
                    <p class="text-xs text-text-muted">100% transparent pricing</p>
                </div>
                <div class="p-4 rounded-lg bg-bg-light border border-border-color shadow-sm">
                    <span class="text-2xl mb-2 block">&#x1F3D4;&#xFE0F;</span>
                    <h4 class="font-serif font-semibold text-primary text-sm mb-1">Customizable</h4>
                    <p class="text-xs text-text-muted">Adjust any tour itinerary</p>
                </div>
                <div class="p-4 rounded-lg bg-bg-light border border-border-color shadow-sm">
                    <span class="text-2xl mb-2 block">&#x1F697;</span>
                    <h4 class="font-serif font-semibold text-primary text-sm mb-1">Private Cars</h4>
                    <p class="text-xs text-text-muted">Inclusive tolls & allowance</p>
                </div>
            </div>
        </div>
    </section>

    <!-- GLOBAL FOOTER -->
    <footer class="footer py-12 bg-primary text-white border-t border-slate-800">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">SMILE HOLIDAY MAKERS</h4>
                <p class="text-sm text-slate-300">"Stress Less, Travel More."<br><br>Local Himachal experts designing customized family and adventure packages with transparent policies.</p>
            </div>
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Quick Links</h4>
                <ul class="space-y-2 text-sm text-slate-300">
                    <li><a href="../index.html" class="hover:text-white">Home</a></li>
                    <li><a href="../manali.html" class="hover:text-white">Manali Packages</a></li>
                    <li><a href="../shimla.html" class="hover:text-white">Shimla Packages</a></li>
                    <li><a href="../combined.html" class="hover:text-white">Combined Tours</a></li>
                    <li><a href="../about.html" class="hover:text-white">About Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Contact Info</h4>
                <ul class="space-y-2 text-sm text-slate-300">
                    <li>&#x1F4DE; +91 96545 02501</li>
                    <li>&#x2709;&#xFE0F; smileholidaymakers@gmail.com</li>
                    <li>&#x1F4CD; Delhi, India</li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Our Promise</h4>
                <p class="text-xs text-slate-400">All local drives use private cars with parking and tolls covered. Intercity travel uses comfortable overnight AC Volvos.</p>
            </div>
        </div>
        <div class="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-400">
            &copy; 2026 SMILE HOLIDAY MAKERS. All rights reserved.
        </div>
    </footer>

    <!-- Filter JS -->
    <script>
        function filterCategory(category) {
            const tabs = document.querySelectorAll('.category-tab');
            tabs.forEach(tab => {
                if (tab.textContent.includes(category) || (category === 'All' && tab.textContent.includes('All'))) {
                    tab.classList.add('active', 'bg-primary', 'text-white');
                    tab.classList.remove('bg-white', 'text-text-dark');
                } else {
                    tab.classList.remove('active', 'bg-primary', 'text-white');
                    tab.classList.add('bg-white', 'text-text-dark');
                }
            });

            const cards = document.querySelectorAll('.blog-card');
            cards.forEach(card => {
                if (category === 'All' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>
    <script src="../js/main.js"></script>
</body>
</html>
'@
    $html = $html -replace '##CARDS##', $cardsHtml
    return $html
}

# 3. Individual Article Template Function
function Get-ArticleHtml {
    param($blog)
    
    $aiBulletsHtml = ""
    foreach ($bullet in $blog.AiSnippet) {
        $aiBulletsHtml += @"
                        <li class='text-sm text-text-dark flex items-start gap-2'>
                            <span class='text-secondary text-base'>&#x2713;</span>
                            <span>$bullet</span>
                        </li>
"@
    }

    $faqsHtml = ""
    foreach ($faq in $blog.Faqs) {
        $faqsHtml += @"
                        <div>
                            <h3 class='text-lg font-bold text-primary mb-2'>$($faq.Question)</h3>
                            <p class='text-sm text-text-dark'>$($faq.Answer)</p>
                        </div>
"@
    }

    $faqItems = @()
    foreach ($faq in $blog.Faqs) {
        $q = $faq.Question -replace '"', '\"'
        $a = $faq.Answer -replace '"', '\"'
        $faqItems += @"
            {
                "@type": "Question",
                "name": "$q",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "$a"
                }
            }
"@
    }
    $faqsJsonLd = $faqItems -join ","

    # Parse dynamic H2s for TOC
    $headings = @()
    $matches = [regex]::Matches($blog.ContentHtml, '<h2 class="[^"]+">([^<]+)</h2>')
    foreach ($match in $matches) {
        $headings += $match.Groups[1].Value
    }
    $headings += "Frequently Asked Questions"

    $tocHtml = "<ul class='space-y-1 list-none pl-0'>"
    $hIdx = 0
    foreach ($heading in $headings) {
        $tocHtml += "<li><a href='#section-$hIdx' class='text-secondary hover:underline'>$heading</a></li>"
        $hIdx++
    }
    $tocHtml += "</ul>"

    # Inject Section IDs into H2 elements using script scope for counter
    $script:hIdx = 0
    $contentInjected = [regex]::Replace($blog.ContentHtml, '<h2 class="([^"]+)">([^<]+)</h2>', {
        param($m)
        $classes = $m.Groups[1].Value
        $text = $m.Groups[2].Value
        $replacement = "<h2 id='section-$script:hIdx' class='$classes scroll-mt-24'>$text</h2>"
        $script:hIdx++
        return $replacement
    })

    $html = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="##EXCERPT##">
    <title>##TITLE## | SMILE HOLIDAY MAKERS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '#1E3547',
                            light: '#2C485E',
                        },
                        secondary: {
                            DEFAULT: '#2C7A7B',
                            light: '#319795',
                        },
                        accent: {
                            DEFAULT: '#E28743',
                            hover: '#D07633',
                        },
                        'bg-light': '#F7FAFC',
                        'text-dark': '#2D3748',
                        'text-muted': '#718096',
                        'border-color': '#E2E8F0',
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        serif: ['Montserrat', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="../css/styles.css">
    <style>
        .header-nav { background: #ffffff !important; }
        .logo-text { color: #1E3547 !important; }
        .toc-list a:hover { color: #2C7A7B; text-decoration: underline; }
    </style>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "##TITLE##",
        "description": "##EXCERPT##",
        "datePublished": "2026-06-01",
        "dateModified": "2026-06-04",
        "author": {
            "@type": "Organization",
            "name": "Smile Holiday Makers"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Smile Holiday Makers",
            "logo": {
                "@type": "ImageObject",
                "url": "https://smileholidaymakers.vercel.app/images/logo.png"
            }
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            ##FAQS_JSONLD##
        ]
    }
    </script>
</head>
<body class="bg-bg-light text-text-dark font-sans leading-relaxed">

    <!-- GLOBAL HEADER -->
    <header class="header-nav" id="headerNav">
        <div class="container nav-container">
            <a href="../index.html" class="logo-link" id="logoLink">
                <img src="../images/logo.png" alt="SMILE HOLIDAY MAKERS Logo" class="logo-img">
                <span class="logo-text">SMILE<span> HOLIDAY MAKERS</span></span>
            </a>
            
            <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav class="nav-menu" id="navMenu">
                <a href="../index.html" class="nav-link">Home</a>
                <a href="../manali.html" class="nav-link">Manali Packages</a>
                <a href="../shimla.html" class="nav-link">Shimla Packages</a>
                <a href="../combined.html" class="nav-link">Combined Tours</a>
                <a href="index.html" class="nav-link">Guides</a>
                <a href="../about.html" class="nav-link">About Us</a>
                <a href="../contact.html" class="btn btn-primary btn-sm">Get a Free Quote</a>
            </nav>
        </div>
    </header>

    <!-- WRAPPER GRID Layout -->
    <div class="max-w-6xl mx-auto px-4 pt-28 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- LEFT COLUMN: Main Blog Post Content -->
        <article class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border-color p-6 md:p-8">
            <div class="mb-4">
                <span class="text-xs font-bold text-secondary bg-teal-50 px-3 py-1 border border-teal-200 rounded-full">##CATEGORY##</span>
                <span class="text-xs text-text-muted ml-3">##READ_TIME##</span>
            </div>
            
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 leading-tight">##TITLE##</h1>
            <p class="text-xs text-text-muted mb-6">By Local Himachal Expert | Updated: ##DATE##</p>

            <div class="bg-slate-50 border border-dashed border-border-color rounded-xl p-4 mb-8 text-center text-sm italic text-text-muted">
                [Image Suggestion: ##HERO_IMAGE##]
            </div>

            <div class="bg-teal-50/50 border border-teal-200 rounded-xl p-6 mb-8">
                <h3 class="font-serif font-bold text-secondary text-lg mb-3">&#x1F3D4;&#xFE0F; Quick Trip Summary (AI Snippet)</h3>
                <ul class="space-y-3">
                    ##AI_BULLETS##
                </ul>
            </div>

            <div class="border border-border-color rounded-xl p-4 mb-8 bg-slate-50/50">
                <h4 class="font-serif font-bold text-primary text-sm mb-2">&#x1F4CC; Table of Contents</h4>
                <div class="toc-list text-sm text-text-muted space-y-1">
                    ##TOC##
                </div>
            </div>

            <div class="blog-body-text">
                <p class="text-lg text-text-dark font-medium mb-6 leading-relaxed">##INTRO##</p>
                <div class="prose max-w-none text-text-dark leading-relaxed space-y-6">
                    ##CONTENT##
                </div>
            </div>

            <div class="mt-8 p-6 bg-slate-50 border border-border-color rounded-xl">
                <h3 class="font-serif font-bold text-primary text-lg mb-3">&#x1F3D4;&#xFE0F; The Smile Holiday Makers Standard</h3>
                <p class="text-sm text-text-dark mb-4">We design our custom packages to be transparent and family friendly. Here are the core rules that apply to every booking:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-teal-600">&#x2713;</span>
                        <span>No charge for children under 5 years old</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-teal-600">&#x2713;</span>
                        <span>No hidden GST charged extra</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-teal-600">&#x2713;</span>
                        <span>No Covid test required for travel</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-teal-600">&#x2713;</span>
                        <span>100% Customizable upon request</span>
                    </div>
                </div>
            </div>

            <div class="my-8 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl p-6 shadow-md">
                <h3 class="font-serif font-bold text-xl mb-2 text-white">&#x1F3D4;&#xFE0F; Plan Your Stress-Free Escape</h3>
                <p class="text-sm text-slate-200 mb-4">Let our local coordinators plan the perfect itinerary. Customize your hotels, local cabs, and activities with zero hidden fees.</p>
                <div class="flex flex-wrap items-center gap-4">
                    <a href="tel:+919654502501" class="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg font-semibold text-sm transition">Call Now</a>
                    <a href="https://api.whatsapp.com/send?phone=919654502501&text=Hi%20Smile%20Holiday%20Makers,%20I%20am%20interested%20in%20booking%20a%20customized%20package." class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition">
                        <span>Message on WhatsApp</span>
                    </a>
                </div>
            </div>

            <div class="mt-10 border-t border-border-color pt-8">
                <h2 id="section-##FAQ_ID##" class="text-2xl font-serif font-bold text-primary mb-6 scroll-mt-24">Frequently Asked Questions</h2>
                <div class="space-y-6">
                    ##FAQS##
                </div>
            </div>

        </article>

        <!-- RIGHT SIDEBAR: Sticky Lead Form -->
        <aside class="lg:col-span-1">
            <div class="sticky top-24 bg-white rounded-2xl shadow-md border border-border-color p-6">
                <h3 class="font-serif font-bold text-xl text-primary mb-2">Get a Free Quote</h3>
                <p class="text-xs text-text-muted mb-6">Send details to customize your Himachal holiday with local experts. No hidden charges.</p>
                
                <form id="sidebarQuoteForm" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-primary mb-1">Full Name *</label>
                        <input type="text" id="quoteName" class="w-full text-sm border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:border-secondary" required placeholder="Your Name">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-primary mb-1">Phone Number (WhatsApp) *</label>
                        <input type="tel" id="quotePhone" pattern="[6789][0-9]{9}" class="w-full text-sm border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:border-secondary" required placeholder="10-digit number">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-primary mb-1">Select Destination *</label>
                        <select id="quoteDest" class="w-full text-sm border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:border-secondary">
                            <option value="Combined (5N/6D)">Combined Shimla-Manali (5N/6D)</option>
                            <option value="Shimla Weekend (2N/3D)">Shimla Weekend (2N/3D)</option>
                            <option value="Manali Budget (4N/5D)">Manali Budget (4N/5D)</option>
                            <option value="Manali Special (5N/6D)">Manali Special (5N/6D)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-primary mb-1">Estimated Travel Date *</label>
                        <input type="date" id="quoteDate" class="w-full text-sm border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:border-secondary" required>
                    </div>
                    
                    <button type="submit" class="w-full bg-secondary hover:bg-secondary-light text-white py-3 rounded-lg font-bold text-sm transition shadow-md">
                        Get Custom Quote
                    </button>
                </form>

                <div class="mt-6 border-t border-border-color pt-4 text-center">
                    <p class="text-xs text-text-muted mb-2">Or connect with us directly:</p>
                    <a href="tel:+919654502501" class="text-sm font-semibold text-primary hover:text-secondary block">&#x1F4DE; +91 96545 02501</a>
                    <a href="mailto:smileholidaymakers@gmail.com" class="text-sm font-semibold text-primary hover:text-secondary block">&#x2709;&#xFE0F; smileholidaymakers@gmail.com</a>
                </div>
            </div>
        </aside>

    </div>

    <!-- GLOBAL FOOTER -->
    <footer class="footer py-12 bg-primary text-white border-t border-slate-800">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">SMILE HOLIDAY MAKERS</h4>
                <p class="text-sm text-slate-300">"Stress Less, Travel More."<br><br>Local Himachal experts designing customized family and adventure packages with transparent policies.</p>
            </div>
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Quick Links</h4>
                <ul class="space-y-2 text-sm text-slate-300">
                    <li><a href="../index.html" class="hover:text-white">Home</a></li>
                    <li><a href="../manali.html" class="hover:text-white">Manali Packages</a></li>
                    <li><a href="../shimla.html" class="hover:text-white">Shimla Packages</a></li>
                    <li><a href="../combined.html" class="hover:text-white">Combined Tours</a></li>
                    <li><a href="../about.html" class="hover:text-white">About Us</a></li>
                    <li><a href="index.html" class="hover:text-white">All Guides</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Contact Info</h4>
                <ul class="space-y-2 text-sm text-slate-300">
                    <li>&#x1F4DE; +91 96545 02501</li>
                    <li>&#x2709;&#xFE0F; smileholidaymakers@gmail.com</li>
                    <li>&#x1F4CD; Delhi, India</li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="font-serif font-bold text-lg mb-4 text-white">Our Promise</h4>
                <p class="text-xs text-slate-400">All local drives use private cars with parking and tolls covered. Intercity travel uses comfortable overnight AC Volvos.</p>
            </div>
        </div>
        <div class="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-400">
            &copy; 2026 SMILE HOLIDAY MAKERS. All rights reserved.
        </div>
    </footer>

    <script>
        document.getElementById('sidebarQuoteForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('quoteName').value;
            const phone = document.getElementById('quotePhone').value;
            const dest = document.getElementById('quoteDest').value;
            const date = document.getElementById('quoteDate').value;
            
            const message = "\uD83C\uDFD4\uFE0F *SMILE HOLIDAY MAKERS* \uD83C\uDFD4\uFE0F\n*Stress Less, Travel More.*\n------------------------------------\n*New Blog Quote Inquiry:*\n*Name:* " + name + "\n*Phone:* " + phone + "\n*Destination:* " + dest + "\n*Travel Date:* " + date + "\n*Origin:* Blog Sidebar";
            
            const encoded = encodeURIComponent(message);
            window.open(`https://api.whatsapp.com/send?phone=919654502501&text=` + encoded, '_blank');
        });
    </script>
    <script src="../js/main.js"></script>
</body>
</html>
'@

    $html = $html -replace '##TITLE##', $blog.Title
    $html = $html -replace '##EXCERPT##', $blog.Excerpt
    $html = $html -replace '##DATE##', $blog.Date
    $html = $html -replace '##CATEGORY##', $blog.Category
    $html = $html -replace '##READ_TIME##', $blog.ReadTime
    $html = $html -replace '##HERO_IMAGE##', $blog.HeroImage
    $html = $html -replace '##AI_BULLETS##', $aiBulletsHtml
    $html = $html -replace '##TOC##', $tocHtml
    $html = $html -replace '##INTRO##', $blog.Introduction
    $html = $html -replace '##CONTENT##', $contentInjected
    $html = $html -replace '##FAQS##', $faqsHtml
    $html = $html -replace '##FAQS_JSONLD##', $faqsJsonLd
    $html = $html -replace '##FAQ_ID##', $script:hIdx
    
    return $html
}

# 4. Generate all files using UTF-8 Encoding
$hubContent = Get-HubHtml -blogsList $blogs
$hubPath = Join-Path $blogDir "index.html"
[System.IO.File]::WriteAllText($hubPath, $hubContent, [System.Text.Encoding]::UTF8)
Write-Host "Successfully generated blog/index.html (UTF-8)"

foreach ($blog in $blogs) {
    $articleContent = Get-ArticleHtml -blog $blog
    $articlePath = Join-Path $blogDir "$($blog.Slug).html"
    [System.IO.File]::WriteAllText($articlePath, $articleContent, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully generated blog/$($blog.Slug).html (UTF-8)"
}

Write-Host "All blog routes successfully compiled from JavaScript DB!"