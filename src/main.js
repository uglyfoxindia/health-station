/**
 * HEALTH STATION - Premium Physiotherapy Website Logic
 * Pure vanilla ES module Javascript with high performance handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Reveal Animations on Scroll (Intersection Observer) ---
  const initScrollReveals = () => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% of element is in view
      rootMargin: '0px 0px -50px 0px' // slightly trigger before fully visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  };

  // --- 2. Mobile Navigation Menu Toggle ---
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
      const isExpanded = mobileMenu.classList.contains('hidden');
      if (isExpanded) {
        // Open
        mobileMenu.classList.remove('hidden');
        // Small fade animation
        setTimeout(() => {
          mobileMenu.classList.remove('opacity-0', '-translate-y-4');
        }, 10);
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        // Close
        mobileMenu.classList.add('opacity-0', '-translate-y-4');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close on navigation click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', '-translate-y-4');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });

    // Close on clicking outside mobile nav
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && 
          !mobileMenu.contains(e.target) && 
          !menuBtn.contains(e.target)) {
        toggleMenu();
      }
    });
  };

  // --- 3. Active Nav Links Mapping on Scroll ---
  const initActiveLinkTracker = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav-link');

    const trackActiveSection = () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 160; // offset

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('text-brand-600', 'font-semibold', 'border-b-2', 'border-brand-600');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('text-brand-600', 'font-semibold', 'border-b-2', 'border-brand-600');
        }
      });
    };

    window.addEventListener('scroll', trackActiveSection);
    // run once initially
    trackActiveSection();
  };

  // --- 4. Interactive Testimonials Carousel ---
  const initTestimonialSlider = () => {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (testimonials.length === 0 || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    let autoplayInterval;

    const showTestimonial = (index) => {
      testimonials.forEach((card, idx) => {
        card.classList.add('hidden', 'opacity-0', 'scale-95');
        card.classList.remove('flex');
        if (dots[idx]) {
          dots[idx].classList.remove('bg-brand-600', 'w-6');
          dots[idx].classList.add('bg-zinc-300', 'w-2');
        }
      });

      testimonials[index].classList.remove('hidden');
      testimonials[index].classList.add('flex');
      // micro-timeout for transition to kick in
      setTimeout(() => {
        testimonials[index].classList.remove('opacity-0', 'scale-95');
        testimonials[index].classList.add('opacity-100', 'scale-100');
      }, 50);

      if (dots[index]) {
        dots[index].classList.remove('bg-zinc-300', 'w-2');
        dots[index].classList.add('bg-brand-600', 'w-6');
      }
      
      currentIndex = index;
    };

    const nextTestimonial = () => {
      let nextIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(nextIndex);
    };

    const prevTestimonial = () => {
      let prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(prevIndex);
    };

    // Click events
    nextBtn.addEventListener('click', () => {
      nextTestimonial();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevTestimonial();
      resetAutoplay();
    });

    // Dot indicators click
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showTestimonial(idx);
        resetAutoplay();
      });
    });

    // Handle swipe/drag for touch screen preview devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliderContainer = document.querySelector('.testimonials-slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    const handleSwipe = () => {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        nextTestimonial();
        resetAutoplay();
      } else if (touchEndX - touchStartX > threshold) {
        prevTestimonial();
        resetAutoplay();
      }
    };

    // Autoplay setup
    const startAutoplay = () => {
      autoplayInterval = setInterval(nextTestimonial, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    // Initialize
    showTestimonial(0);
    startAutoplay();
  };

  // --- 5. Interactive Clinical Services Detail Accordions / Modals ---
  const initServicesInteractive = () => {
    const serviceCards = document.querySelectorAll('.service-card-interactive');
    const detailsModal = document.getElementById('service-details-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (!detailsModal || !closeModalBtn) return;

    const modalTitle = document.getElementById('modal-service-title');
    const modalDesc = document.getElementById('modal-service-description');
    const modalBenefits = document.getElementById('modal-service-benefits');
    const modalImagePlaceholder = document.getElementById('modal-service-img');
    const modalIconBg = document.getElementById('modal-service-icon-bg');
    const modalIconSvg = document.getElementById('modal-service-icon-svg');

    // Deep service details database to populate modal with high value clinical explanations
    const serviceDetails = {
      'sports-injury': {
        title: 'Sports Injury Rehabilitation',
        desc: 'Advanced physical rehabilitation and return-to-play strategies engineered for athletes and active individuals of all experience levels.',
        benefits: [
          'Pre-participation assessment & injury risk mitigation mapping.',
          'Post-concussive tracking and systemic neuromotor training.',
          'Accelerated tissue recovery via customized load therapy regimens.',
          'Sport-specific motor pattern restoration and functional athletic testing.'
        ],
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        iconSvg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
      },
      'post-surgery': {
        title: 'Post-Surgery Recovery',
        desc: 'Bespoke clinical tissue management, joint mobilization, and strength mapping designed to recover complete physiological function after surgical interventions.',
        benefits: [
          'Safe progressive load-bearing tracking with targeted mechanical feedback.',
          'Clinical scar tissue manipulation and range of motion optimization.',
          'Targeted muscle activation therapies to counter surgical atrophy.',
          'Close coordination and surgical protocol matching with your orthopedist.'
        ],
        iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        iconSvg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`
      },
      'back-neck': {
        title: 'Back & Neck Pain Treatment',
        desc: 'Evidence-based spinal decompression, mechanical diagnosis, alignment therapy, and core stabilizing structures targeting acute or chronic back and cervical neck pain.',
        benefits: [
          'Clinical assessment mapping of disc, facet joint, and soft muscular pain sources.',
          'McKenzie Method mechanical diagnosis and physical alignment correction.',
          'Deep lumbar and cervical stabilization training based on EMG telemetry values.',
          'Ergonomic analysis and posture stabilization mapping for long office hours.'
        ],
        iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
        iconSvg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/></svg>`
      },
      'posture-correction': {
        title: 'Posture Correction',
        desc: 'Scientific assessment of skeletal alignments, spinal curves, and neuromuscular imbalances, backed by active retraining to eliminate tension and strain points.',
        benefits: [
          'Biomechanical analysis of kinetic chains and spinal alignment axes.',
          'Targeted strengthening of deep scapular stabilizers and hip rotators.',
          'Integrated breathing and core centering loops during prolonged static sitting.',
          'Release techniques for hypertonic patterns in neck and lower back muscle groups.'
        ],
        iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
        iconSvg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`
      },
      'joint-mobility': {
        title: 'Joint Mobility & Arthritis Care',
        desc: 'Advanced pain offset techniques, range-of-motion routines, and protective joint training designed to boost cartilage resilience and mechanical movement freedom.',
        benefits: [
          'Hydrodynamics and localized loading strategies that promote joint cell health.',
          'Gentle clinical rhythmic distraction and glide techniques to optimize ease of movement.',
          'Custom non-impact cardiac and load conditioning routines targeting arthritis.',
          'Splinting, mechanical tracking advice, and localized strength offsets.'
        ],
        iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
        iconSvg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      },
      'pediatric-physio': {
        title: 'Pediatric Physiotherapy',
        desc: 'Devoted, welcoming developmental alignment, posture, and motor control training for children and teenagers navigating growth phases or recovering from playground injuries.',
        benefits: [
          'Developmental motor milestones assessment (infant to early adolescent stages).',
          'Fun, interactive clinical exercises disguised as sports loops and play patterns.',
          'Scoliosis scans and early mechanical curvature alignment strategies.',
          'Pediatric repetitive strain protection plans (e.g. tablet neck, heavy school bags).'
        ],
        iconBg: 'bg-pink-50 text-pink-600 border-pink-100',
        iconSvg: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
      }
    };

    const openModal = (serviceKey) => {
      const data = serviceDetails[serviceKey];
      if (!data) return;

      modalTitle.innerText = data.title;
      modalDesc.innerText = data.desc;
      
      // Clear and populate benefits list
      modalBenefits.innerHTML = '';
      data.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.className = 'flex items-start text-zinc-600';
        li.innerHTML = `
          <svg class="w-5 h-5 text-brand-600 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm md:text-base">${benefit}</span>
        `;
        modalBenefits.appendChild(li);
      });

      // Style Icon Bg & SVG
      modalIconBg.className = `w-14 h-14 ${data.iconBg} rounded-xl border flex items-center justify-center shrink-0 mb-4 md:mb-0 md:mr-4`;
      modalIconSvg.innerHTML = data.iconSvg;

      // Show Modal
      detailsModal.classList.remove('hidden', 'pointer-events-none');
      document.body.classList.add('overflow-hidden'); // Lock background scroll
      // Small fade in
      setTimeout(() => {
        const modalBg = detailsModal.querySelector('.modal-bg');
        const modalContainer = detailsModal.querySelector('.modal-container');
        if (modalBg) modalBg.classList.remove('opacity-0');
        if (modalContainer) modalContainer.classList.remove('opacity-0', 'scale-95', 'translate-y-4');
      }, 10);
    };

    const closeModal = () => {
      const modalBg = detailsModal.querySelector('.modal-bg');
      const modalContainer = detailsModal.querySelector('.modal-container');
      
      if (modalBg) modalBg.classList.add('opacity-0');
      if (modalContainer) modalContainer.classList.add('opacity-0', 'scale-95', 'translate-y-4');

      setTimeout(() => {
        detailsModal.classList.add('hidden', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    };

    serviceCards.forEach(card => {
      const btn = card.querySelector('.learn-more-btn');
      const key = card.getAttribute('data-service-key');
      
      const handleTrigger = (e) => {
        e.preventDefault();
        openModal(key);
      };

      if (btn) btn.addEventListener('click', handleTrigger);
      card.addEventListener('click', (e) => {
        // Prevent trigger if they click another link specifically, otherwise make card body clickable
        if (e.target.closest('a') !== btn && e.target.closest('a') !== null) return;
        openModal(key);
      });
    });

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !detailsModal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Close modal on backdrop click
    detailsModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-bg') || e.target.closest('.modal-container-wrapper') === null && !e.target.closest('#close-modal-btn')) {
        // Confirm they click the background overlay
        if (e.target === detailsModal || e.target.classList.contains('modal-container-wrapper')) {
          closeModal();
        }
      }
    });
  };

  // --- 6. Form Submission Logic & Animated Confirmation Screen ---
  const initBookingForm = () => {
    const bookingForm = document.getElementById('booking-form');
    const successOverlay = document.getElementById('success-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    
    if (!bookingForm || !successOverlay) return;

    // Helper functions for real-time visual feedback:
    const showFieldError = (input, message) => {
      const groupDiv = input.closest('.form-group');
      if (!groupDiv) return;
      
      input.classList.add('border-red-500', 'focus:ring-red-400');
      input.classList.remove('border-zinc-200', 'focus:ring-brand-500');
      
      let errorLabel = groupDiv.querySelector('.error-message');
      if (!errorLabel) {
        errorLabel = document.createElement('span');
        errorLabel.className = 'error-message text-red-500 text-xs mt-1 block font-medium';
        groupDiv.appendChild(errorLabel);
      }
      errorLabel.innerText = message;
    };

    const clearFieldError = (input) => {
      const groupDiv = input.closest('.form-group');
      if (!groupDiv) return;
      
      input.classList.remove('border-red-500', 'focus:ring-red-400');
      input.classList.add('border-zinc-200', 'focus:ring-brand-500');
      
      const errorLabel = groupDiv.querySelector('.error-message');
      if (errorLabel) {
        errorLabel.remove();
      }
    };

    // Live validation on blur
    bookingForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
          clearFieldError(input);
        }
      });
      // also validation on input entry
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          clearFieldError(input);
        }
      });
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let hasErrors = false;
      const formData = {
        name: bookingForm.querySelector('#patient-name'),
        phone: bookingForm.querySelector('#patient-phone'),
        date: bookingForm.querySelector('#booking-date'),
        service: bookingForm.querySelector('#booking-service'),
        message: bookingForm.querySelector('#booking-notes')
      };

      // 1. Validate name
      if (!formData.name.value || formData.name.value.trim().length < 2) {
        showFieldError(formData.name, 'Please enter your full name (minimum 2 characters).');
        hasErrors = true;
      } else {
        clearFieldError(formData.name);
      }

      // 2. Validate phone number (basic regex to match 10+ digits or typical phone formats)
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/im;
      if (!formData.phone.value || !phoneRegex.test(formData.phone.value.trim().replace(/[-\s]/g, ''))) {
        showFieldError(formData.phone, 'Please enter a valid phone number (e.g., 555-019-2831).');
        hasErrors = true;
      } else {
        clearFieldError(formData.phone);
      }

      // 3. Validate Date
      const selectedDate = new Date(formData.date.value);
      const today = new Date();
      today.setHours(0,0,0,0); // compare dates accurately

      if (!formData.date.value) {
        showFieldError(formData.date, 'Please choose a preferred date for your checkup.');
        hasErrors = true;
      } else if (selectedDate < today) {
        showFieldError(formData.date, 'We cannot book retroactively. Please select a future date.');
        hasErrors = true;
      } else {
        clearFieldError(formData.date);
      }

      // 4. Validate Service
      if (!formData.service.value || formData.service.value === '') {
        showFieldError(formData.service, 'Please select a service so we can pair you with the best specialist.');
        hasErrors = true;
      } else {
        clearFieldError(formData.service);
      }

      if (hasErrors) {
        // Scroll to the first error
        const firstErrorField = bookingForm.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Generate visual outputs for our custom confirmation overlay
      const referralCode = 'HS-' + Math.floor(100000 + Math.random() * 900000);
      const chosenServiceText = formData.service.options[formData.service.selectedIndex].text;
      const cleanDateString = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Populate Success Modal Fields
      document.getElementById('receipt-ticket').innerText = referralCode;
      document.getElementById('receipt-name').innerText = formData.name.value.trim();
      document.getElementById('receipt-service').innerText = chosenServiceText;
      document.getElementById('receipt-date').innerText = cleanDateString;

      // Log/Show beautiful animated card
      successOverlay.classList.remove('hidden', 'pointer-events-none');
      document.body.classList.add('overflow-hidden');

      // Animating the ticket card entrance
      setTimeout(() => {
        const modalBackdrop = successOverlay.querySelector('.modal-backdrop');
        const modalBody = successOverlay.querySelector('.success-card-body');
        if (modalBackdrop) modalBackdrop.classList.remove('opacity-0');
        if (modalBody) modalBody.classList.remove('opacity-0', 'scale-90', 'translate-y-8');
      }, 10);

      // Reset the form
      bookingForm.reset();
    });

    const closeSuccessModal = () => {
      const modalBackdrop = successOverlay.querySelector('.modal-backdrop');
      const modalBody = successOverlay.querySelector('.success-card-body');
      
      if (modalBackdrop) modalBackdrop.classList.add('opacity-0');
      if (modalBody) modalBody.classList.add('opacity-0', 'scale-90', 'translate-y-8');

      setTimeout(() => {
        successOverlay.classList.add('hidden', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    };

    closeSuccessBtn.addEventListener('click', closeSuccessModal);
    
    // allow clicking on backdrop of success screen to dismiss
    successOverlay.addEventListener('click', (e) => {
      if (e.target === successOverlay || e.target.classList.contains('success-backdrop-wrapper')) {
        closeSuccessModal();
      }
    });
  };

  // --- 7. Interactive Filterable Media Gallery with Lightbox Showcase ---
  const initGallery = () => {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxDesc = document.getElementById('lightbox-description');
    const lightboxIndex = document.getElementById('lightbox-index-span');
    const closeBtn = document.getElementById('close-lightbox-btn');
    const prevBtn = document.getElementById('prev-lightbox-btn');
    const nextBtn = document.getElementById('next-lightbox-btn');

    if (!galleryItems.length || !lightbox) return;

    // Gallery item text details for high-fidelity modal captions
    const galleryData = [
      {
        src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
        title: "Treatment Suite Alpha",
        category: "Clinical Rooms",
        description: "Equipped with motorized adjustment tables, state-of-the-art posture analyzers, and gentle, calming ambient light setups for focused evaluation."
      },
      {
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
        title: "Consultation Suite Beta",
        category: "Clinical Rooms",
        description: "A welcoming diagnosis and planning environment featuring anatomical reference aids, digital range-of-motion visualizers, and pristine furniture."
      },
      {
        src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
        title: "Bio-Electric Console Unit",
        category: "Advanced Equipment",
        description: "Multi-channel electronic nerve stimulation systems utilized to relieve chronic muscle spasms, block acute pain signals, and accelerate local cell regeneration."
      },
      {
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200",
        title: "Athletic Load Rig Space",
        category: "Advanced Equipment",
        description: "Our dedicated functional fitness arena loaded with premium elastic loops, calibrated kettlebells, targets, and progressive resistance apparatus."
      },
      {
        src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
        title: "Spinal Flexion Mobilization",
        category: "Therapy & Recovery",
        description: "Specialized, therapist-guided segmental manual stretching aimed at reducing vertebral muscle fatigue and increasing spinal flexibility safely."
      },
      {
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
        title: "Sartorial & Kinematic Joint Analysis",
        category: "Therapy & Recovery",
        description: "Clinical evaluation checking localized knee joint range of motion and checking ligament resilience to target specific biomechanical discrepancies."
      }
    ];

    let currentActiveIdx = 0;
    // We will keep track of items that are currently active under current filter for previous/next actions
    let filteredIndices = [0, 1, 2, 3, 4, 5];

    // --- 7A. Filtering logic ---
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-gallery-filter');

        // Reset all filter buttons styling
        filterBtns.forEach(b => {
          b.className = "gallery-filter-btn px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border border-zinc-200/80 bg-stone-50/50 text-zinc-600 hover:text-brand-600 hover:border-brand-300 transition-all duration-300 cursor-pointer";
        });

        // Set activated button styling
        btn.className = "gallery-filter-btn px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-300 cursor-pointer active shadow-sm bg-gradient-clinical text-white border-transparent";

        // Filter and animate items
        filteredIndices = [];
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-gallery-category');
          const index = parseInt(item.getAttribute('data-index'), 10);

          if (selectedFilter === 'all' || category === selectedFilter) {
            filteredIndices.push(index);
            item.style.display = 'block';
            // subtle fade-in transition
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(8px) scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // --- 7B. Lightbox Operations ---
    const updateLightboxImage = (index) => {
      if (index < 0 || index >= galleryData.length) return;
      currentActiveIdx = index;
      
      const data = galleryData[index];
      
      // Animate transition on image load
      lightboxImg.style.transform = 'scale(0.95) translateY(4px)';
      lightboxImg.style.opacity = '0.7';

      setTimeout(() => {
        lightboxImg.src = data.src;
        lightboxImg.alt = data.title;
        lightboxTitle.innerText = data.title;
        lightboxCategory.innerText = data.category;
        lightboxDesc.innerText = data.description;
        lightboxIndex.innerText = (index + 1).toString();
        
        lightboxImg.style.transform = 'scale(1) translateY(0)';
        lightboxImg.style.opacity = '1';
      }, 150);
    };

    const openLightbox = (index) => {
      updateLightboxImage(index);
      lightbox.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');

      setTimeout(() => {
        lightbox.classList.remove('opacity-0');
      }, 30);
    };

    const closeLightbox = () => {
      lightbox.classList.add('opacity-0');
      setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    };

    const handleNext = () => {
      let pos = filteredIndices.indexOf(currentActiveIdx);
      if (pos === -1) {
        let nextIdx = (currentActiveIdx + 1) % galleryData.length;
        updateLightboxImage(nextIdx);
      } else {
        let nextPos = (pos + 1) % filteredIndices.length;
        updateLightboxImage(filteredIndices[nextPos]);
      }
    };

    const handlePrev = () => {
      let pos = filteredIndices.indexOf(currentActiveIdx);
      if (pos === -1) {
        let prevIdx = (currentActiveIdx - 1 + galleryData.length) % galleryData.length;
        updateLightboxImage(prevIdx);
      } else {
        let prevPos = (pos - 1 + filteredIndices.length) % filteredIndices.length;
        updateLightboxImage(filteredIndices[prevPos]);
      }
    };

    // Attach click events on items
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        openLightbox(index);
      });
    });

    // Support client testimonial uploaded photo clicks in same lightbox
    const reviewThumbs = document.querySelectorAll('.review-photo-thumb');
    reviewThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-lightbox-src');
        const title = thumb.getAttribute('data-title');
        const category = thumb.getAttribute('data-category');
        const desc = thumb.getAttribute('data-desc');

        lightboxImg.style.transform = 'scale(0.95) translateY(4px)';
        lightboxImg.style.opacity = '0.7';
        lightboxIndex.innerText = "★";

        setTimeout(() => {
          lightboxImg.src = src;
          lightboxImg.alt = title;
          lightboxTitle.innerText = title;
          lightboxCategory.innerText = category;
          lightboxDesc.innerText = desc;
          
          lightboxImg.style.transform = 'scale(1) translateY(0)';
          lightboxImg.style.opacity = '1';
        }, 150);

        lightbox.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        setTimeout(() => {
          lightbox.classList.remove('opacity-0');
        }, 30);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);

    // Close lightbox on clicking backdrop space
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('#gallery-lightbox') && e.target === lightboxImg.parentElement) {
        closeLightbox();
      }
    });

    // Keyboard support for accessibility
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    });
  };

  // --- Initialize All Logic ---
  initScrollReveals();
  initMobileMenu();
  initActiveLinkTracker();
  initTestimonialSlider();
  initServicesInteractive();
  initBookingForm();
  initGallery();
});
