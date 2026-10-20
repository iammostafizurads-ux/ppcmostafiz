/**
 * PPC Mostafiz - Portfolio Interactive Logic
 * Brand: PPC Mostafiz (Mostafizur Rahman)
 * Domain: ppcmostafiz.com
 */

function initPortfolio() {
  // 1. Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');
  let isMobileMenuOpen = false;

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      isMobileMenuOpen = !isMobileMenuOpen;
      toggleMobileMenu(isMobileMenuOpen);
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        isMobileMenuOpen = false;
        toggleMobileMenu(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (isMobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        isMobileMenuOpen = false;
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    if (open) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
      const closeIcon = mobileMenuBtn.querySelector('.close-icon');
      if (menuIcon && closeIcon) {
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      }
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
      const closeIcon = mobileMenuBtn.querySelector('.close-icon');
      if (menuIcon && closeIcon) {
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    }
  }

  // 2. Animated Counter for Trust Badges (Instant + Smooth Viewport Trigger)
  const counters = document.querySelectorAll('.counter-value');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      if (isNaN(target)) return;
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        if (decimals > 0) {
          counter.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;
        } else {
          counter.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          if (decimals > 0) {
            counter.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          } else {
            counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const counterSection = document.getElementById('trust-metrics');
  if (counterSection) {
    const checkAndAnimate = () => {
      const rect = counterSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        animateCounters();
      }
    };

    // Trigger immediately if already in viewport
    checkAndAnimate();

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(counterSection);
    } else {
      window.addEventListener('scroll', checkAndAnimate, { passive: true });
    }
  } else {
    animateCounters();
  }

  // 3. Interactive Ad Waste & ROI Calculator
  const spendSlider = document.getElementById('adSpendSlider');
  const spendDisplay = document.getElementById('spendDisplay');
  const industrySelect = document.getElementById('industrySelect');
  const wastedSpendVal = document.getElementById('calcWastedSpend');
  const recoveredLeadsVal = document.getElementById('calcRecoveredLeads');
  const projectedRevenueVal = document.getElementById('calcProjectedRevenue');

  const industryMultipliers = {
    'home-services': { wasteRate: 0.35, costPerLead: 48, closeRate: 0.35, dealValue: 2400 },
    'b2b-consulting': { wasteRate: 0.40, costPerLead: 110, closeRate: 0.20, dealValue: 8500 },
    'healthcare': { wasteRate: 0.30, costPerLead: 42, closeRate: 0.50, dealValue: 1200 },
    'high-ticket': { wasteRate: 0.38, costPerLead: 85, closeRate: 0.25, dealValue: 5000 }
  };

  function updateCalculator() {
    if (!spendSlider || !spendDisplay || !industrySelect) return;

    const monthlySpend = parseInt(spendSlider.value, 10);
    const industryKey = industrySelect.value || 'home-services';
    const profile = industryMultipliers[industryKey] || industryMultipliers['home-services'];

    spendDisplay.textContent = `$${monthlySpend.toLocaleString()}`;

    // Estimated monthly wasted ad spend
    const wastedAmount = Math.round(monthlySpend * profile.wasteRate);
    wastedSpendVal.textContent = `$${wastedAmount.toLocaleString()}/mo`;

    // Additional qualified leads generated by optimizing & reallocating that waste
    const extraLeads = Math.max(4, Math.round(wastedAmount / profile.costPerLead));
    recoveredLeadsVal.textContent = `+${extraLeads} Leads/mo`;

    // Estimated incremental pipeline value
    const incrementalRevenue = Math.round(extraLeads * profile.closeRate * profile.dealValue);
    projectedRevenueVal.textContent = `+$${incrementalRevenue.toLocaleString()}`;
  }

  if (spendSlider && industrySelect) {
    spendSlider.addEventListener('input', updateCalculator);
    industrySelect.addEventListener('change', updateCalculator);
    updateCalculator(); // Initialize on load
  }

  // 4. Case Studies Interactive Filter / Tabs
  const caseStudyButtons = document.querySelectorAll('.case-filter-btn');
  const caseCards = document.querySelectorAll('.case-study-card');

  if (caseStudyButtons.length > 0) {
    caseStudyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        caseStudyButtons.forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
          b.classList.add('bg-slate-800/60', 'text-slate-400', 'border-slate-700/60');
        });

        btn.classList.add('bg-blue-600', 'text-white', 'border-blue-500');
        btn.classList.remove('bg-slate-800/60', 'text-slate-400', 'border-slate-700/60');

        caseCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
            card.classList.add('flex');
          } else {
            card.classList.add('hidden');
            card.classList.remove('flex');
          }
        });
      });
    });
  }

  // 5. Contact / Free Audit Form Submission Simulation
  const auditForm = document.getElementById('auditForm');
  const formSuccessModal = document.getElementById('formSuccessModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const submitBtn = document.getElementById('submitAuditBtn');

  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const website = document.getElementById('clientWebsite')?.value.trim();

      if (!name || !email || !website) {
        alert('Please fill out all required fields (Name, Email, Website).');
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing Request...
        `;
      }

      // Simulate API submission
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Claim Your Free Google Ads Audit</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          `;
        }

        // Display Success Modal
        if (formSuccessModal) {
          formSuccessModal.classList.remove('hidden');
          formSuccessModal.classList.add('flex');
        }

        auditForm.reset();
        if (spendSlider) {
          spendSlider.value = 5000;
          updateCalculator();
        }
      }, 1200);
    });
  }

  if (closeModalBtn && formSuccessModal) {
    closeModalBtn.addEventListener('click', () => {
      formSuccessModal.classList.add('hidden');
      formSuccessModal.classList.remove('flex');
    });

    formSuccessModal.addEventListener('click', (e) => {
      if (e.target === formSuccessModal) {
        formSuccessModal.classList.add('hidden');
        formSuccessModal.classList.remove('flex');
      }
    });
  }

  // 6. Accordion for FAQ
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqQuestions.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.add('hidden');
          }
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherIcon) {
            otherIcon.classList.remove('rotate-180');
          }
        }
      });

      // Toggle current
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // 7. Copy Email Quick Action
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = 'hello@ppcmostafiz.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.getAttribute('data-original-text') || btn.innerHTML;
        btn.setAttribute('data-original-text', originalText);
        btn.innerHTML = `
          <svg class="w-4 h-4 text-emerald-400 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span class="text-emerald-400 font-semibold">Email Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2500);
      });
    });
  });

  // 8. Sticky Nav Scroll Shadow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('shadow-xl', 'border-b', 'border-slate-800');
    } else {
      navbar?.classList.remove('shadow-xl');
    }
  });

  // 9. YouTube Video Player & Playlist Handler
  let activeVideoId = 'Pobp8ena5Hg';
  const mainYouTubePlayer = document.getElementById('mainYouTubePlayer');
  const playlistItems = document.querySelectorAll('.playlist-item');

  if (playlistItems.length > 0) {
    playlistItems.forEach(item => {
      item.addEventListener('click', () => {
        const videoId = item.getAttribute('data-video-id') || 'Pobp8ena5Hg';
        activeVideoId = videoId;

        if (mainYouTubePlayer) {
          mainYouTubePlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
        }

        // Update active UI styles on playlist items
        playlistItems.forEach(pi => {
          pi.classList.remove('border-red-500/50', 'bg-red-950/20');
          pi.classList.add('border-slate-700/60');
          const statusSpan = pi.querySelector('.playlist-status');
          if (statusSpan) statusSpan.textContent = 'Load in Player';
        });

        item.classList.add('border-red-500/50', 'bg-red-950/20');
        item.classList.remove('border-slate-700/60');
        const currentStatus = item.querySelector('.playlist-status');
        if (currentStatus) currentStatus.textContent = 'Playing in player ↑';

        // Smoothly scroll to the video player
        const container = document.getElementById('videoContainer');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // On-Site Video Theater Mode Modal
  const openTheaterBtn = document.getElementById('openTheaterBtn');
  const closeTheaterBtn = document.getElementById('closeTheaterBtn');
  const videoTheaterModal = document.getElementById('videoTheaterModal');
  const theaterIframeContainer = document.getElementById('theaterIframeContainer');

  if (openTheaterBtn && videoTheaterModal && theaterIframeContainer) {
    const openTheater = () => {
      theaterIframeContainer.innerHTML = `
        <iframe 
          class="w-full h-full border-0 rounded-2xl"
          src="https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&rel=0&autoplay=1" 
          title="Meet Mostafizur Rahman | ROI-Driven Google Ads Specialist" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      `;
      videoTheaterModal.classList.remove('hidden');
      videoTheaterModal.classList.add('flex');
      if (window.lucide) {
        lucide.createIcons();
      }
    };

    const closeTheater = () => {
      videoTheaterModal.classList.add('hidden');
      videoTheaterModal.classList.remove('flex');
      theaterIframeContainer.innerHTML = ''; // Stop video playback on close
    };

    openTheaterBtn.addEventListener('click', openTheater);
    closeTheaterBtn?.addEventListener('click', closeTheater);
    videoTheaterModal.addEventListener('click', (e) => {
      if (e.target === videoTheaterModal) {
        closeTheater();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !videoTheaterModal.classList.contains('hidden')) {
        closeTheater();
      }
    });
  }
}

// Reliable Initialization across all browser loading states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}


