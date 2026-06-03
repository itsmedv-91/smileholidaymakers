document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ACTIVE NAVIGATION & SCROLL HANDLER
    // ==========================================
    const navHeader = document.getElementById('headerNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // Active Link Highlighting
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (pageName === linkPath || (pageName === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Scroll Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navHeader.classList.add('scrolled');
        } else {
            navHeader.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 3. PRE-FILL DESTINATION FROM URL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const destParam = urlParams.get('destination');
    const destinationSelect = document.getElementById('interest');
    if (destParam && destinationSelect) {
        for (let option of destinationSelect.options) {
            if (option.value.toLowerCase() === destParam.toLowerCase()) {
                option.selected = true;
                break;
            }
        }
    }

    // ==========================================
    // 4. TESTIMONIAL CAROUSEL
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slideInterval;

        // Create navigation dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(document.querySelectorAll('.carousel-dot'));

        const updateCarouselState = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarouselState();
            resetInterval();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarouselState();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarouselState();
        };

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000); // Shift every 5s
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }

    // ==========================================
    // 5. PACKAGE MODAL & DETAILED DATA
    // ==========================================
    const packagesData = {
        'honeymoon-manali': {
            title: 'Manali Honeymoon Special',
            duration: '4 Nights / 5 Days',
            price: '₹14,999 / Person',
            image: 'images/hero-manali.jpg',
            inclusions: ['Luxury Honeymoon Suite with Mountain Views', 'Daily Buffet Breakfast & Dinner', 'Private Cab for Rohtang & Solang Valley excursions', 'Candlelight Dinner with Complimentary Honeymoon Cake & Wine', 'Kesar Milk & Floral Bed Decoration', 'All local driver allowances, toll, & parking fees'],
            itinerary: [
                'Day 1: Delhi/Chandigarh to Manali drive. Welcome drink & check-in to your honeymoon suite. Candlelight dinner.',
                'Day 2: Full day excursion to Solang Valley for stunning views. Enjoy optional paragliding and zorbing.',
                'Day 3: Scenic trip to Snow Point / Rohtang Pass. Evening stroll on Manali Mall Road.',
                'Day 4: Guided local sightseeing visiting Hadimba Temple, Vashisht Hot Springs, and Club House.',
                'Day 5: Check-out and scenic departure drop back to Delhi or Chandigarh.'
            ]
        },
        'adventure-manali': {
            title: 'Manali Adventure & Trekking',
            duration: '5 Nights / 6 Days',
            price: '₹12,500 / Person',
            image: 'images/hero-manali.jpg',
            inclusions: ['Campsite & Alpine Tent stay with campfires', 'All adventure equipment & professional trekking guides', 'All meals during trekking (Freshly prepared high-energy food)', 'Paragliding in Solang Valley & Beas River rafting experience', 'Jeep transfer support', 'First-aid kit & emergency oxygen backup'],
            itinerary: [
                'Day 1: Arrival in Manali. Check-in to base camp. Gear check and briefing session.',
                'Day 2: Thrilling river rafting in Beas River. Afternoon trek initialization up to Jogini Waterfalls.',
                'Day 3: Full day Solang Valley adventure: Paragliding flight and trek to Anjani Mahadev.',
                'Day 4: Moderate trek to Lamadugh Meadows for stunning panoramic views of Pir Panjal range.',
                'Day 5: Campfire night with local music, star gazing, and group outdoor dinner.',
                'Day 6: Final check-out and drop off to the Volvo bus stand.'
            ]
        },
        'family-manali': {
            title: 'Manali Family Holiday',
            duration: '4 Nights / 5 Days',
            price: '₹11,999 / Person',
            image: 'images/hero-manali.jpg',
            inclusions: ['Interconnected Family Rooms at 3-Star Deluxe Hotel', 'Breakfast and Dinner buffet catering to all ages', 'Comfortable Toyota Innova for all family excursions', 'All entry tickets to parks, museum, and snow point passes', 'Local shopping guide assistance', 'Child safety seats available on request'],
            itinerary: [
                'Day 1: Pick up from Chandigarh airport/station. Drive to Manali. Check-in and evening rest.',
                'Day 2: Visit Hadimba temple, Manu temple, and Tibetan Monastery. Handloom shopping on Mall Road.',
                'Day 3: Exciting family excursion to Solang Valley. Ropeway ride and snow activities.',
                'Day 4: Excursion to Rohtang Pass (subject to permit). Evening cultural dance showcase at the hotel.',
                'Day 5: Depart Manali via Kullu Shawl factories. Drop to Chandigarh.'
            ]
        },
        'weekend-shimla': {
            title: 'Classic Shimla Weekend',
            duration: '2 Nights / 3 Days',
            price: '₹7,999 / Person',
            image: 'images/hero-shimla.jpg',
            inclusions: ['Premium Ridge-view Room Stay', 'Daily Breakfast & Dinner', 'Private Cab for Kufri excursion & Local Sightseeing', 'Guided heritage walk along the historic Mall Road', 'Complimentary heater in room', 'All tolls, driver charges & taxes included'],
            itinerary: [
                'Day 1: Arrive in Shimla. Evening at leisure. Walk along Mall Road, Ridge, and visit Scandal Point.',
                'Day 2: Day excursion to Kufri - visit Himalayan Nature Park, enjoy yak rides and adventure park activities.',
                'Day 3: Morning trek to Jakhoo Hill Temple (Hanuman Statue). Check-out and departure drop.'
            ]
        },
        'heritage-shimla': {
            title: 'Heritage & Toy Train Tour',
            duration: '3 Nights / 4 Days',
            price: '₹10,500 / Person',
            image: 'images/hero-shimla.jpg',
            inclusions: ['Kalka to Shimla heritage Toy Train ticket (VistaDome if available)', 'Stay at a colonial-era Heritage Hotel', 'Private cab for historical landmarks tours', 'Guided tours of Viceregal Lodge (Indian Institute of Advanced Study)', 'Passes to Shimla State Museum', 'Daily classic multi-cuisine breakfasts & dinners'],
            itinerary: [
                'Day 1: Board the scenic Toy Train from Kalka. Arrive in Shimla, transfer to colonial hotel.',
                'Day 2: Historical tour: Viceregal Lodge, Annandale Army Heritage Museum, State Museum.',
                'Day 3: Trek up to Jakhoo Temple and explore the wooden handicraft shops at Lakkar Bazaar.',
                'Day 4: Check-out and private cab transfer back to Kalka/Chandigarh station.'
            ]
        },
        'luxury-shimla': {
            title: 'Luxury Shimla Retreat',
            duration: '4 Nights / 5 Days',
            price: '₹22,999 / Person',
            image: 'images/hero-shimla.jpg',
            inclusions: ['5-Star Luxury Resort Stay (e.g., Wildflower Hall style)', 'Welcome champagne and organic fruit platter', 'All meals included (A-la-carte menu options)', 'Private luxury SUV (Innova Crysta) for all transfers', '60-Minute spa & wellness therapy package per adult', 'Private bonfire night with customized barbecue'],
            itinerary: [
                'Day 1: VIP transfer to luxury resort. Check-in, welcome drinks, and evening private wellness session.',
                'Day 2: Private chauffeured tour of Naldehra Golf course and scenic Mashobra pine forests.',
                'Day 3: Premium Kufri valley excursion with private horseback safari. Gourmet picnic lunch.',
                'Day 4: Leisure day at the resort. Enjoy the heated indoor-outdoor pool, spa treatments, and private bonfire.',
                'Day 5: Luxurious breakfast, private SUV transfer drop-off to Chandigarh airport.'
            ]
        },
        'combined-loop': {
            title: 'The Ultimate Himachal Loop (Shimla & Manali)',
            duration: '6 Nights / 7 Days',
            price: '₹19,999 / Person',
            image: 'images/hero-combined.jpg',
            inclusions: ['3 Nights stay in Shimla & 3 Nights stay in Manali', 'Premium hotels with breakfast & dinner daily', 'All intercity transfers & local sightseeing in private AC Cab', 'Toy train experience pass & Kullu Valley adventure pass', 'All permits for Rohtang Pass / Solang Valley included', '24/7 Dedicated Himachali tour manager support'],
            itinerary: [
                'Day 1: Chandigarh pickup, scenic drive to Shimla. Evening Mall Road walk.',
                'Day 2: Excursion to Kufri & Green Valley. Visit Jakhoo temple.',
                'Day 3: Drive from Shimla to Manali. En-route Kullu Valley sightseeing and river rafting.',
                'Day 4: Manali local tour: Hadimba Temple, Vashisht hot springs, Clubhouse.',
                'Day 5: Solang Valley & Rohtang Pass snow point excursion.',
                'Day 6: Excursion to Manikaran hot springs and Parvati Valley borders.',
                'Day 7: Drive from Manali back to Chandigarh for departure drop.'
            ]
        }
    };

    const modalOverlay = document.getElementById('detailsModal');
    const modalClose = document.getElementById('modalClose');

    if (modalOverlay && modalClose) {
        const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
        
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const pkgId = btn.getAttribute('data-package');
                const pkg = packagesData[pkgId];
                
                if (pkg) {
                    // Populate modal elements
                    document.getElementById('modalTitle').textContent = pkg.title;
                    document.getElementById('modalDuration').textContent = pkg.duration;
                    document.getElementById('modalPrice').textContent = pkg.price;
                    document.getElementById('modalImg').src = pkg.image;
                    
                    // Pre-fill "Book Now" dynamic query link on the modal CTA button
                    const modalBookBtn = document.getElementById('modalBookBtn');
                    if (modalBookBtn) {
                        modalBookBtn.href = `contact.html?destination=${pkgId.includes('manali') ? 'manali' : (pkgId.includes('shimla') ? 'shimla' : 'combined')}`;
                    }

                    // Inclusions List
                    const inclusionsContainer = document.getElementById('modalInclusions');
                    inclusionsContainer.innerHTML = '';
                    pkg.inclusions.forEach(inc => {
                        const li = document.createElement('li');
                        li.textContent = inc;
                        inclusionsContainer.appendChild(li);
                    });

                    // Itinerary List
                    const itineraryContainer = document.getElementById('modalItinerary');
                    itineraryContainer.innerHTML = '';
                    pkg.itinerary.forEach(day => {
                        const li = document.createElement('li');
                        li.textContent = day;
                        itineraryContainer.appendChild(li);
                    });

                    // Show Modal
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Lock scrolling background
                }
            });
        });

        // Close Modal Handlers
        const closeModalFunc = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        modalClose.addEventListener('click', closeModalFunc);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModalFunc();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModalFunc();
        });
    }

    // ==========================================
    // 6. MULTI-STEP LEAD GENERATION FORM
    // ==========================================
    const leadForm = document.getElementById('leadGenForm');
    const formSteps = document.querySelectorAll('.form-step-panel');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressHeader = document.querySelector('.form-steps-header');

    if (leadForm && formSteps.length > 0) {
        let currentStep = 0;

        const updateFormProgress = () => {
            formSteps.forEach((step, idx) => {
                step.classList.toggle('active', idx === currentStep);
            });

            stepIndicators.forEach((indicator, idx) => {
                indicator.classList.toggle('active', idx === currentStep);
                indicator.classList.toggle('completed', idx < currentStep);
            });
        };

        const validateStep = (stepIdx) => {
            const activePanel = formSteps[stepIdx];
            const inputs = activePanel.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            // Simple clear error reset
            activePanel.querySelectorAll('.form-error-msg').forEach(el => el.remove());

            inputs.forEach(input => {
                // Clear any inline styling error highlights
                input.style.borderColor = '';
                
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#E53E3E'; // Red color
                    
                    const error = document.createElement('span');
                    error.className = 'form-error-msg';
                    error.style.color = '#E53E3E';
                    error.style.fontSize = '0.75rem';
                    error.style.marginTop = '4px';
                    error.textContent = 'This field is required.';
                    input.parentNode.appendChild(error);
                } else if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.style.borderColor = '#E53E3E';
                        
                        const error = document.createElement('span');
                        error.className = 'form-error-msg';
                        error.style.color = '#E53E3E';
                        error.style.fontSize = '0.75rem';
                        error.style.marginTop = '4px';
                        error.textContent = 'Please enter a valid email address.';
                        input.parentNode.appendChild(error);
                    }
                } else if (input.type === 'tel') {
                    const telRegex = /^[6-9]\d{9}$/; // Indian mobile numbers check
                    if (!telRegex.test(input.value.replace(/\s+/g, ''))) {
                        isValid = false;
                        input.style.borderColor = '#E53E3E';
                        
                        const error = document.createElement('span');
                        error.className = 'form-error-msg';
                        error.style.color = '#E53E3E';
                        error.style.fontSize = '0.75rem';
                        error.style.marginTop = '4px';
                        error.textContent = 'Please enter a valid 10-digit mobile number.';
                        input.parentNode.appendChild(error);
                    }
                }
            });

            return isValid;
        };

        // Next button click
        nextButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    if (currentStep < formSteps.length - 1) {
                        currentStep++;
                        updateFormProgress();
                    }
                }
            });
        });

        // Prev button click
        prevButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentStep > 0) {
                    currentStep--;
                    updateFormProgress();
                }
            });
        });

        // Form submission handling
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                // Collect form data
                const formData = new FormData(leadForm);
                const dataObject = {};
                formData.forEach((value, key) => {
                    dataObject[key] = value;
                });
                
                console.log('Lead Captured Successfully:', dataObject);
                
                // Hide steps & indicators, display Success layout
                leadForm.innerHTML = `
                    <div class="form-success-message">
                        <div class="success-icon-wrap">
                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>Thank You, ${dataObject.fullname.split(' ')[0]}!</h3>
                        <p>Your custom tour inquiry has been received. Our local travel expert will contact you within the next 2-4 business hours with custom quote options.</p>
                        <button class="btn btn-primary" style="margin-top: 25px;" onclick="window.location.href='index.html'">Return Home</button>
                    </div>
                `;
                if (progressHeader) progressHeader.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 7. ITINERARY ACCORDION TOGGLE
    // ==========================================
    const timelineHeaders = document.querySelectorAll('.timeline-header');
    
    timelineHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.timeline-item');
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.timeline-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
