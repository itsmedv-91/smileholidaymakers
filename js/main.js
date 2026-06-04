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
        const target = destParam.toLowerCase();
        for (let option of destinationSelect.options) {
            const val = option.value.toLowerCase();
            if (val === target || val.startsWith(target)) {
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
        'special-shimla': {
            title: 'Special Shimla Tour Package',
            duration: '2 Nights / 3 Days',
            price: 'Starting from ₹5,999 / Person',
            image: 'images/hero-shimla.png',
            inclusions: ['Luxury Hotel Stay (2 Nights)', 'Luxury AC Volvo tickets (Delhi to Shimla both ways)', 'Free Pick-up & Drop within Shimla', '2 Breakfasts & 2 Dinners in hotel', 'Complete Local Shimla Sightseeing', 'Tolls, Parking & Driver Allowance included'],
            itinerary: [
                'Day 1: Departure from Delhi & Arrival. Board Luxury AC Volvo from Delhi for an overnight journey. Arrive in Shimla, check-in, freshen up, and relax. Meals: Dinner included.',
                'Day 2: Local Shimla & Kufri Sightseeing. Breakfast at hotel. Morning sightseeing: The Ridge, Mall Road, Lakkar Bazaar, Christ Church, Sankat Mochan Hanuman Ji, Jakhu Temple, and Adventure Park. Afternoon excursion to Kufri for mountain views, optional horse riding, and nature walks. Meals: Breakfast & Dinner included.',
                'Day 3: Mashobra, Tattapani, Naldehra & Departure. Breakfast at hotel, check-out, and store luggage. Explore Mashobra (apple orchards & wildlife sanctuary), Tattapani (hot springs on Sutlej River), and Naldehra (golf course & meadows). Evening departure via Luxury AC Volvo back to Delhi. Meals: Breakfast included.'
            ]
        },
        'special-combined': {
            title: 'Special Shimla & Manali Tour Package',
            duration: '5 Nights / 6 Days',
            price: 'Starting from ₹14,999 / Person',
            image: 'images/hero-combined.png',
            inclusions: ['3-Star Luxury Hotel (2 Nights Shimla / 3 Nights Manali)', 'Luxury AC Volvo transport (Delhi-Shimla & Manali-Delhi)', 'Private Cab Transfer & Sightseeing for all days', '5 Breakfasts & 5 Dinners', 'Welcome drinks (non-alcoholic) in Manali hotel', 'Tolls, Parking & Driver Allowance included', 'Note: Adventure activities at own cost'],
            itinerary: [
                'Day 1: Delhi to Shimla. Board Luxury AC Volvo from Delhi for an overnight journey. Arrive in Shimla, complimentary hotel transfer, check-in, and relax. Meals: Dinner included.',
                'Day 2: Local Shimla Sightseeing. Breakfast at hotel. Take a private cab tour of The Ridge, Mall Road, Lakkar Bazaar, Christ Church, Sankat Mochan Hanuman Ji, and Jakhu Temple. Free evening to stroll Mall Road. Meals: Breakfast & Dinner included.',
                'Day 3: Kufri + Transfer to Manali. Breakfast at Shimla hotel. Explore Kufri scenery, optional horse riding, and nature walks. Depart by cab to Manali (approx. 7–8 hours via Kullu Valley). Check-in at Manali hotel with welcome drinks. Meals: Breakfast & Dinner included.',
                'Day 4: Local Manali Sightseeing. Breakfast at hotel. Visit Hidimba Devi Temple, Club House, Vashisht Temple (hot water spring), Jugni Waterfall Trek, Tibetan Monastery, and Van Vihar. Leisure evening on Manali Mall Road. Meals: Breakfast & Dinner included.',
                'Day 5: Solang Valley Adventure Day. Breakfast at hotel. Drive 15 km to Solang Valley for activities like paragliding, cable car, zorbing, snow scooter, skiing, horse riding, or the optional Anjani Mahadev Trek. Meals: Breakfast & Dinner included.',
                'Day 6: Kullu / Manikaran & Departure. Breakfast at hotel, then check-out. Tour Kullu (Naggar Castle, Roerich Art Gallery, Raison Museum, Waterfall, Kais Gompa, Vaishno Mata Temple, Shawl Factory, and Rafting/Paragliding point) and visit Manikaran Sahib Gurudwara. Board evening Luxury AC Volvo from Manali back to Delhi. Meals: Breakfast included.'
            ]
        },
        'special-manali-4n': {
            title: 'Special Manali Tour Package (4N/5D)',
            duration: '4 Nights / 5 Days',
            price: 'Starting from ₹9,999 / Person',
            image: 'images/hero-manali.png',
            inclusions: ['3-Star Hotel (2 Nights Stay in Manali, 2 Nights in Volvo)', 'Luxury AC Volvo tickets (Delhi to Manali both ways)', 'Private Car for local sightseeing and excursions', '2 Breakfasts & 2 Dinners', 'Welcome drinks (non-alcoholic) on arrival', 'Pick-up/Drop at Manali Volvo Bus Stand', 'Tolls, Parking & Driver Allowance included', 'Note: Adventure activities at own cost'],
            itinerary: [
                'Day 1: Departure. Evening departure from Delhi via Luxury AC Volvo. Overnight journey into the Himalayas.',
                'Day 2: Arrive Manali + Local Sightseeing. Arrive, hotel pick-up, and check-in with welcome drinks. Sightseeing covers Hidimba Devi Temple, Club House, Tibetan Monastery, and Van Vihar National Park. Evening leisure on Mall Road. Meals: Breakfast & Dinner included.',
                'Day 3: Solang Valley Adventure Day. Breakfast at hotel. Day trip to Solang Valley (lush green fields in summer; snow sports/skiing in winter). Available activities include paragliding, cable car, zorbing, snow scooter, horse riding, and Anjani Mahadev Trek. Meals: Breakfast & Dinner included.',
                'Day 4: Kullu / Manikaran Sightseeing & Departure. Breakfast at hotel, check-out. Private car tour of Kullu highlights (Naggar Castle, Roerich Art Gallery, Raison Museum, Waterfall, Kais Gompa, Vaishno Mata Temple, Shawl Factory Outlet, Rafting & Paragliding Point) and Manikaran Sahib Ji Gurudwara. Evening drop to Volvo stand for return journey. Meals: Breakfast included.',
                'Day 5: Arrive Delhi. Early morning arrival in Delhi.'
            ]
        },
        'special-manali-5n': {
            title: 'Special Manali Tour Package (5N/6D)',
            duration: '5 Nights / 6 Days',
            price: 'Starting from ₹11,999 / Person',
            image: 'images/hero-manali.png',
            inclusions: ['3-Star Hotel (3 Nights Stay in Manali, 2 Nights in Volvo)', 'Luxury AC Volvo tickets (Delhi to Manali both ways)', 'Private Car for sightseeing and transfers', '3 Breakfasts & 3 Dinners', 'Welcome drinks (non-alcoholic) on arrival', 'Pick-up/Drop at Manali Volvo Bus Stand', 'Tolls, Parking & Driver Allowance included', 'Note: Adventure activities at own cost'],
            itinerary: [
                'Day 1: Departure. Evening departure from Delhi via Luxury AC Volvo; overnight travel.',
                'Day 2: Arrive Manali + Local Sightseeing. Arrive, pick-up, check-in with welcome drinks. Sightseeing includes Hidimba Devi Temple, Jugni Waterfall Trek, Tibetan Monastery, and Van Vihar National Park. Evening spent on Mall Road. Meals: Breakfast & Dinner included.',
                'Day 3: Solang Valley Adventure Day. Breakfast at hotel. Excursion to Solang Valley for seasonal mountain/snow activities, paragliding, zorbing, skiing, cable car, or Anjani Mahadev Trek. Meals: Breakfast & Dinner included.',
                'Day 4: Kullu / Manikaran Sightseeing. Breakfast at hotel. Full-day private car excursion to Kullu (Naggar Castle, Roerich Art Gallery, Raison Museum, Waterfall, Kais Gompa, Vaishno Mata Temple, Shawl Factory Outlet, Rafting & Paragliding Point) and the sacred hot springs of Manikaran Sahib Ji Gurudwara. Return to hotel. Meals: Breakfast & Dinner included.',
                'Day 5: Leisure / Optional Activities & Departure. Breakfast at hotel followed by check-out. Enjoy a free morning to relax by the Beas River or shop for Himachali shawls, dry fruits, and souvenirs on Mall Road. Evening drop to the Volvo stand for an overnight trip to Delhi. Meals: Breakfast included.',
                'Day 6: Arrive Delhi. Early morning arrival in Delhi.'
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
                
                // Construct encoded WhatsApp message content
                const mainFormWaText = `🏔️ *SMILE HOLIDAY MAKERS* 🏔️
*Stress Less, Travel More.*
-----------------------------------
*Main Form Enquiry Details:*
*Name:* ${dataObject.fullname}
*Email:* ${dataObject.email}
*Phone:* ${dataObject.phone}
*Destination:* ${dataObject.interest}
*Travel Date:* ${dataObject.travelDate}
*Duration:* ${dataObject.duration}
*Adults:* ${dataObject.adults}
*Children:* ${dataObject.children || '0'}
*Budget:* ${dataObject.budget}
*Custom requests:* ${dataObject.message || 'None'}`;
                
                // Hide steps & indicators, display Success layout
                leadForm.innerHTML = `
                    <div class="form-success-message" style="text-align: center;">
                        <div class="success-icon-wrap" style="margin: 0 auto 20px auto;">
                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>Thank You, ${dataObject.fullname.split(' ')[0]}!</h3>
                        <p>Your custom tour inquiry has been received. Our local travel expert will contact you within the next 2-4 business hours with custom quote options.</p>
                        
                        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px; flex-wrap: wrap;">
                            <a href="https://api.whatsapp.com/send?phone=919654502501&text=${encodeURIComponent(mainFormWaText)}" target="_blank" class="btn" style="background-color: #25D366; color: white; border: none; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.46 3.473 1.336 4.985l-1.42 5.185 5.305-1.393c1.461.796 3.102 1.213 4.767 1.213h.004c5.502 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.273 14.184c-.258.729-1.503 1.341-2.074 1.433-.518.083-1.196.155-3.327-.728-2.73-1.13-4.475-3.896-4.611-4.077-.136-.182-1.109-1.474-1.109-2.812 0-1.338.701-1.996.949-2.26.248-.264.542-.33.723-.33.181 0 .362.001.52.01.164.009.385-.062.602.46.223.538.765 1.861.831 1.996.066.136.11.294.02.476-.09.182-.136.294-.27.452-.136.157-.285.352-.408.472-.136.13-.277.271-.12.54.156.27.697 1.144 1.493 1.854.616.549 1.139.88 1.468 1.042.33.161.517.135.711-.087.194-.222.831-.965 1.053-1.298.223-.333.444-.277.747-.164.303.111 1.922.906 2.253 1.072.33.165.55.244.612.35.062.106.062.616-.196 1.345z"/>
                                </svg>
                                <span>Send via WhatsApp</span>
                            </a>
                            <button class="btn btn-primary" onclick="window.location.href='index.html'">Return Home</button>
                        </div>
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

    // ==========================================
    // 8. FLOATING WHATSAPP INQUIRY WIDGET
    // ==========================================
    const injectWhatsAppWidget = () => {
        const container = document.createElement('div');
        container.className = 'whatsapp-widget-container';
        container.innerHTML = `
            <!-- Floating Button -->
            <button class="whatsapp-floating-btn" id="waFloatingBtn" aria-label="Chat on WhatsApp">
                <svg viewBox="0 0 24 24" width="30" height="30">
                    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.46 3.473 1.336 4.985l-1.42 5.185 5.305-1.393c1.461.796 3.102 1.213 4.767 1.213h.004c5.502 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.273 14.184c-.258.729-1.503 1.341-2.074 1.433-.518.083-1.196.155-3.327-.728-2.73-1.13-4.475-3.896-4.611-4.077-.136-.182-1.109-1.474-1.109-2.812 0-1.338.701-1.996.949-2.26.248-.264.542-.33.723-.33.181 0 .362.001.52.01.164.009.385-.062.602.46.223.538.765 1.861.831 1.996.066.136.11.294.02.476-.09.182-.136.294-.27.452-.136.157-.285.352-.408.472-.136.13-.277.271-.12.54.156.27.697 1.144 1.493 1.854.616.549 1.139.88 1.468 1.042.33.161.517.135.711-.087.194-.222.831-.965 1.053-1.298.223-.333.444-.277.747-.164.303.111 1.922.906 2.253 1.072.33.165.55.244.612.35.062.106.062.616-.196 1.345z"/>
                </svg>
                <span class="whatsapp-pulse"></span>
            </button>
            
            <!-- Popup Form Card -->
            <div class="whatsapp-popup-card" id="waPopupCard">
                <div class="wa-popup-header">
                    <div class="wa-agent-info">
                        <div class="wa-avatar">
                            <img src="images/logo.png" alt="SMILE HOLIDAY MAKERS Logo">
                            <span class="wa-status-dot"></span>
                        </div>
                        <div>
                            <h5>SMILE HOLIDAY MAKERS</h5>
                            <p>Stress Less, Travel More.</p>
                        </div>
                    </div>
                    <button class="wa-popup-close" id="waPopupClose" aria-label="Close chat">&times;</button>
                </div>
                <div class="wa-popup-body">
                    <p class="wa-welcome-msg">Hi there! Fill out this quick form to send a custom trip enquiry directly to our WhatsApp support.</p>
                    <form id="waInquiryForm" novalidate>
                        <div class="wa-form-group">
                            <label for="waName" class="wa-label">Your Name *</label>
                            <input type="text" id="waName" placeholder="e.g. Amit Sharma" class="wa-input" required>
                        </div>
                        <div class="wa-form-group">
                            <label for="waPhone" class="wa-label">Phone Number *</label>
                            <input type="tel" id="waPhone" placeholder="10-digit mobile" class="wa-input" required>
                        </div>
                        <div class="wa-form-group">
                            <label for="waDestination" class="wa-label">Destination Interest *</label>
                            <select id="waDestination" class="wa-select" required>
                                <option value="">-- Select Destination --</option>
                                <option value="Shimla (2N/3D)">Shimla Escapes (2N/3D)</option>
                                <option value="Manali (4N/5D)">Manali Specials (4N/5D)</option>
                                <option value="Manali (5N/6D)">Manali Specials (5N/6D)</option>
                                <option value="Combined (5N/6D)">Combined Shimla-Manali Loop (5N/6D)</option>
                            </select>
                        </div>
                        <div class="wa-form-group">
                            <label for="waDate" class="wa-label">Estimated Date *</label>
                            <input type="date" id="waDate" class="wa-input" required>
                        </div>
                        <button type="submit" class="wa-submit-btn">
                            <span>Send via WhatsApp</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.46 3.473 1.336 4.985l-1.42 5.185 5.305-1.393c1.461.796 3.102 1.213 4.767 1.213h.004c5.502 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.273 14.184c-.258.729-1.503 1.341-2.074 1.433-.518.083-1.196.155-3.327-.728-2.73-1.13-4.475-3.896-4.611-4.077-.136-.182-1.109-1.474-1.109-2.812 0-1.338.701-1.996.949-2.26.248-.264.542-.33.723-.33.181 0 .362.001.52.01.164.009.385-.062.602.46.223.538.765 1.861.831 1.996.066.136.11.294.02.476-.09.182-.136.294-.27.452-.136.157-.285.352-.408.472-.136.13-.277.271-.12.54.156.27.697 1.144 1.493 1.854.616.549 1.139.88 1.468 1.042.33.161.517.135.711-.087.194-.222.831-.965 1.053-1.298.223-.333.444-.277.747-.164.303.111 1.922.906 2.253 1.072.33.165.55.244.612.35.062.106.062.616-.196 1.345z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // DOM elements
        const waFloatingBtn = document.getElementById('waFloatingBtn');
        const waPopupCard = document.getElementById('waPopupCard');
        const waPopupClose = document.getElementById('waPopupClose');
        const waInquiryForm = document.getElementById('waInquiryForm');

        waFloatingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waPopupCard.classList.toggle('active');
        });

        waPopupClose.addEventListener('click', (e) => {
            e.stopPropagation();
            waPopupCard.classList.remove('active');
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (waPopupCard.classList.contains('active') && !waPopupCard.contains(e.target) && e.target !== waFloatingBtn) {
                waPopupCard.classList.remove('active');
            }
        });

        // Form Submit Handler
        waInquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('waName');
            const phoneInput = document.getElementById('waPhone');
            const destSelect = document.getElementById('waDestination');
            const dateInput = document.getElementById('waDate');

            // Clear errors
            waInquiryForm.querySelectorAll('.wa-error-msg').forEach(el => el.remove());
            [nameInput, phoneInput, destSelect, dateInput].forEach(el => el.style.borderColor = '');

            let isValid = true;

            const showError = (input, msg) => {
                isValid = false;
                input.style.borderColor = '#E53E3E';
                const err = document.createElement('span');
                err.className = 'wa-error-msg';
                err.textContent = msg;
                input.parentNode.appendChild(err);
            };

            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name.');
            }

            const telVal = phoneInput.value.replace(/\s+/g, '');
            const telRegex = /^[6-9]\d{9}$/;
            if (!telVal) {
                showError(phoneInput, 'Please enter your phone number.');
            } else if (!telRegex.test(telVal)) {
                showError(phoneInput, 'Enter a valid 10-digit mobile.');
            }

            if (!destSelect.value) {
                showError(destSelect, 'Please select a destination.');
            }

            if (!dateInput.value) {
                showError(dateInput, 'Please select a travel date.');
            }

            if (isValid) {
                // Construct message
                const formattedMsg = `🏔️ *SMILE HOLIDAY MAKERS* 🏔️
*Stress Less, Travel More.*
-----------------------------------
*New WhatsApp Inquiry:*
*Name:* ${nameInput.value.trim()}
*Phone:* ${phoneInput.value.trim()}
*Destination:* ${destSelect.value}
*Travel Date:* ${dateInput.value}
-----------------------------------
_Verified Lead via Website Widget_`;

                const encodedText = encodeURIComponent(formattedMsg);
                const waLink = `https://api.whatsapp.com/send?phone=919654502501&text=${encodedText}`;

                waPopupCard.classList.remove('active');
                waInquiryForm.reset();
                window.open(waLink, '_blank');
            }
        });
    };

    // Inject widget into DOM
    injectWhatsAppWidget();
});
