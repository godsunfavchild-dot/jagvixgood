    /**
     * JAGVIX PRODUCTION SUITE
     * Config & Constants
     */
    const WHATSAPP_NUMBER = "919876543210";
    const INSTAGRAM_URL = "https://instagram.com/jagvix";
    const LINKEDIN_URL = "https://linkedin.com/company/jagvix";
    const FACEBOOK_URL = "https://facebook.com/jagvix";

    // Security sanitization helper
    function sanitizeText(str) {
      if (typeof str !== 'string') return '';
      return str.replace(/[<>&"']/g, (m) => {
        switch (m) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '"': return '&quot;';
          case "'": return '&#39;';
          default: return m;
        }
      }).trim();
    }

    /* ==========================================================================
       2. SCROLL-BASED THEME OBSERVER & PROGRESS BAR
       ========================================================================== */
    (function initScrollTheme() {
      const progressBar = document.getElementById('progress-bar');
      const root = document.documentElement;
      const sections = document.querySelectorAll('section[data-bg]');

      // Scroll Progress Bar
      window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        if (total > 0) {
          const pct = (h.scrollTop / total) * 100;
          progressBar.style.width = Math.min(Math.max(pct, 0), 100) + '%';
        }
      }, { passive: true });

      // Luminance Helper: 0.299R + 0.587G + 0.114B > 170 => Light
      function isLight(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        return (0.299 * r + 0.587 * g + 0.114 * b) > 170;
      }

      function applyTheme(bg) {
        if (!bg) return;
        const light = isLight(bg);

        // Transition background color on body
        document.body.style.backgroundColor = bg;
        root.style.setProperty('--page-bg', bg);

        if (light) {
          root.style.setProperty('--tx', '#1d120c');
          root.style.setProperty('--mut', '#6b5446');
          root.style.setProperty('--card', '#ffffffcc');
          root.style.setProperty('--line', '#00000022');
          root.style.setProperty('--header-bg', '#fff8f3dd');
          root.style.setProperty('--menu-btn-fg', '#1d120c');
          root.style.setProperty('--menu-btn-bg', 'rgba(29, 18, 12, 0.08)');
        } else {
          root.style.setProperty('--tx', '#fff4ec');
          root.style.setProperty('--mut', '#f6e0d2');
          root.style.setProperty('--card', 'rgba(0, 0, 0, 0.22)');
          root.style.setProperty('--line', 'rgba(255, 255, 255, 0.18)');
          root.style.setProperty('--header-bg', '#2e170cdd');
          root.style.setProperty('--menu-btn-fg', '#fff4ec');
          root.style.setProperty('--menu-btn-bg', 'rgba(255, 255, 255, 0.08)');
        }
      }

      // Initial theme on load (Hero section)
      applyTheme('#2a1208');

      // IntersectionObserver for dynamic theme
      if ('IntersectionObserver' in window) {
        const themeObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
              const bg = entry.target.getAttribute('data-bg');
              applyTheme(bg);
            }
          });
        }, {
          threshold: [0, 0.35, 0.5, 1]
        });

        sections.forEach(s => themeObserver.observe(s));
      }

      // Reveal Animations: dynamically add .rv class so content is visible if JS fails
      const revealTargets = document.querySelectorAll(
        '.card, .step-card, .stat-card, .faq-item, .services-grid details, h2, .sub, .hero-lead, .hero-location, .hero-actions, .contact-form-card, .social-stack'
      );
      revealTargets.forEach(el => el.classList.add('rv'));

      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              revealObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.12
        });

        revealTargets.forEach(el => revealObserver.observe(el));
      } else {
        // Fallback
        revealTargets.forEach(el => el.classList.add('in'));
      }
    })();

    /* ==========================================================================
       3. MENU & HEADER INTERACTIONS
       ========================================================================== */
    (function initMenu() {
      const menuBtn = document.getElementById('menu-btn');
      const menuDropdown = document.getElementById('menu-dropdown');

      function toggleMenu(open) {
        const willOpen = typeof open === 'boolean' ? open : !menuDropdown.classList.contains('open');
        menuDropdown.classList.toggle('open', willOpen);
        menuBtn.classList.toggle('open', willOpen);
        menuBtn.setAttribute('aria-expanded', String(willOpen));
      }

      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      menuDropdown.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          toggleMenu(false);
        }
      });

      document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
          toggleMenu(false);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuDropdown.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    })();

    /* ==========================================================================
       4. INTERACTIVE SATURN PLANET (ZIGZAG INTRO + 3D RING PLAY)
       ========================================================================== */
    (function initInteractiveSaturn() {
      const planetModel = document.getElementById('saturn-3d-model');
      if (!planetModel) return;

      // Handle the Zigzag Entrance Animation completion (1.85s)
      setTimeout(() => {
        planetModel.classList.remove('intro-zigzag');
        planetModel.classList.add('idle-float');
      }, 1900);

      // Interactive 3D Play State
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let ringDragAngle = 0;
      let targetRingAngle = 0;
      let currentRingAngle = 0;
      let animFrameId = null;

      const ringBack = document.getElementById('saturn-ring-back');
      const ringFront = document.getElementById('saturn-ring-front');
      const hint = document.getElementById('planet-hint');

      function update3DTransform() {
        // Smooth interpolation (lerp)
        currentRotX += (targetRotX - currentRotX) * 0.08;
        currentRotY += (targetRotY - currentRotY) * 0.08;
        currentRingAngle += (targetRingAngle - currentRingAngle) * 0.1;

        if (planetModel) {
          planetModel.style.transform = `perspective(1000px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        }

        // Dynamically tilt the rings as user plays with them
        const baseRingTilt = -13 + currentRingAngle;
        if (ringBack) ringBack.setAttribute('transform', `rotate(${baseRingTilt} 250 250)`);
        if (ringFront && ringFront.firstElementChild) {
          ringFront.firstElementChild.setAttribute('transform', `rotate(${baseRingTilt} 250 250)`);
        }

        animFrameId = requestAnimationFrame(update3DTransform);
      }

      // Start the render loop
      animFrameId = requestAnimationFrame(update3DTransform);

      // Pointer tracking over Hero
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroSection.addEventListener('pointermove', (e) => {
          if (isDragging) return;
          const rect = planetModel.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = (e.clientX - centerX) / (window.innerWidth / 2);
          const dy = (e.clientY - centerY) / (window.innerHeight / 2);

          targetRotY = Math.max(Math.min(dx * 22, 28), -28);
          targetRotX = Math.max(Math.min(-dy * 18, 22), -22);
          targetRingAngle = dx * 14;
        }, { passive: true });

        heroSection.addEventListener('pointerleave', () => {
          if (!isDragging) {
            targetRotX = 0;
            targetRotY = 0;
            targetRingAngle = 0;
          }
        });
      }

      // Direct Drag / Touch to Play With Ring
      planetModel.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        planetModel.classList.remove('idle-float');
        if (hint) hint.style.opacity = '0.3';
        planetModel.setPointerCapture(e.pointerId);
      });

      planetModel.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        targetRotY = Math.max(Math.min(deltaX * 0.28, 45), -45);
        targetRotX = Math.max(Math.min(-deltaY * 0.24, 38), -38);
        targetRingAngle = deltaX * 0.35;
      });

      function stopDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        try { planetModel.releasePointerCapture(e.pointerId); } catch (_) {}
        if (hint) hint.style.opacity = '0.7';

        // Return smoothly to idle floating
        targetRotX = 0;
        targetRotY = 0;
        targetRingAngle = 0;
        setTimeout(() => {
          if (!isDragging) planetModel.classList.add('idle-float');
        }, 600);
      }

      planetModel.addEventListener('pointerup', stopDrag);
      planetModel.addEventListener('pointercancel', stopDrag);
    })();

    /* ==========================================================================
       6. SERVICES ACCORDION (Open one at a time)
       ========================================================================== */
    (function initServicesAccordion() {
      const serviceCards = document.querySelectorAll('.services-grid details');
      serviceCards.forEach((card) => {
        card.addEventListener('toggle', () => {
          if (card.open) {
            serviceCards.forEach((other) => {
              if (other !== card && other.open) {
                other.open = false;
              }
            });
          }
        });
      });
    })();

    /* ==========================================================================
       8. MARQUEE DUPLICATION & TOUCH PAUSE
       ========================================================================== */
    (function initMarquees() {
      const marquees = document.querySelectorAll('[data-marquee="true"]');
      marquees.forEach((m) => {
        // Duplicate children seamlessly for 50% loop
        m.innerHTML += m.innerHTML;

        // Touch hold support to pause
        m.addEventListener('touchstart', () => m.classList.add('paused'), { passive: true });
        m.addEventListener('touchend', () => m.classList.remove('paused'), { passive: true });
        m.addEventListener('touchcancel', () => m.classList.remove('paused'), { passive: true });
      });
    })();

    /* ==========================================================================
       10. CONTACT FORM SUBMISSION TO WHATSAPP (WITH SANITIZATION & SECURITY)
       ========================================================================== */
    (function initContactForm() {
      const form = document.getElementById('contact-form');
      const nameInput = document.getElementById('form-name');
      const phoneInput = document.getElementById('form-phone');
      const countrySelect = document.getElementById('form-country');
      const bizInput = document.getElementById('form-biz');
      const consentInput = document.getElementById('form-consent');

      // Rate limit submit
      let lastSubmitTime = 0;

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const now = Date.now();
        if (now - lastSubmitTime < 2000) return; // Prevent spam
        lastSubmitTime = now;

        const name = sanitizeText(nameInput.value);
        const phone = sanitizeText(phoneInput.value);
        const biz = sanitizeText(bizInput.value);

        if (!name || !phone || !biz) {
          alert('Please fill in all required fields.');
          return;
        }

        if (!consentInput.checked) {
          alert('Please agree to receive a reply on WhatsApp or phone.');
          return;
        }

        // Collect checked chips
        const checkedChips = Array.from(document.querySelectorAll('input[name="needs"]:checked'))
          .map(cb => sanitizeText(cb.value));
        const needsText = checkedChips.length > 0 ? checkedChips.join(', ') : 'Not specified';

        // Clean phone number: remove non-digits
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 7) {
          alert('Please enter a valid phone number.');
          return;
        }

        const countryCode = countrySelect.value || '+91';
        const fullUserPhone = `${countryCode} ${cleanPhone}`;

        // Construct pre-filled WhatsApp message
        const message = `Hi Jagvix, I am ${name}. Business: ${biz}. Need: ${needsText}. My WhatsApp: ${fullUserPhone}`;

        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp in safe new window
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    })();

    /* ==========================================================================
       12. AI ASSISTANT CHATBOT (Bilingual + 24-hr Auto-delete)
       ========================================================================== */
    (function initChatbot() {
      const fab = document.getElementById('chatbot-fab');
      const panel = document.getElementById('chatbot-panel');
      const closeBtn = document.getElementById('chat-close');
      const msgsContainer = document.getElementById('chat-messages');
      const quickRepliesContainer = document.getElementById('chat-quick-replies');
      const chatInput = document.getElementById('chat-input');
      const chatSendBtn = document.getElementById('chat-send');
      const footerNote = document.getElementById('chat-footer-note');

      const STORAGE_KEY = 'jagvix_chat_v1';
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      // Knowledge Base in EXACT SPEC ORDER
      const KNOWLEDGE_BASE = [
        {
          id: 'greeting',
          keywords: /\b(hi|hello|hey|greetings|namaste|pranam|ram ram|kese ho|kaise ho)\b|^(hi|hello|hey)$/i,
          en: "Hello! ðŸ‘‹ I can tell you about Jagvix, our services, process and how to contact us.",
          hi: "à¤¨à¤®à¤¸à¥à¤¤à¥‡! ðŸ‘‹ à¤®à¥ˆà¤‚ à¤†à¤ªà¤•à¥‹ Jagvix, à¤¹à¤®à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾à¤“à¤‚, à¤•à¤¾à¤® à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤¤à¤°à¥€à¤•à¥‡ à¤”à¤° à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤¬à¤¤à¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥‚à¤à¥¤"
        },
        {
          id: 'about',
          keywords: /\b(about|who are you|what is jagvix|what do you do|company|jagvix|growth company)\b/i,
          en: "Jagvix is an AI-powered growth company. We bring marketing, AI automation, websites and video together so every part of your growth works as one system.",
          hi: "Jagvix à¤à¤• AI-à¤ªà¤¾à¤µà¤°à¥à¤¡ à¤—à¥à¤°à¥‹à¤¥ à¤•à¤‚à¤ªà¤¨à¥€ à¤¹à¥ˆà¥¤ à¤¹à¤® à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿà¤¿à¤‚à¤—, AI à¤‘à¤Ÿà¥‹à¤®à¥‡à¤¶à¤¨, à¤µà¥‡à¤¬à¤¸à¤¾à¤‡à¤Ÿ à¤”à¤° à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤•à¥‹ à¤à¤• à¤¸à¤¾à¤¥ à¤œà¥‹à¤¡à¤¼à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤¤à¤¾à¤•à¤¿ à¤†à¤ªà¤•à¥€ à¤—à¥à¤°à¥‹à¤¥ à¤à¤• à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤•à¥€ à¤¤à¤°à¤¹ à¤•à¤¾à¤® à¤•à¤°à¥‡à¥¤"
        },
        {
          id: 'location',
          keywords: /\b(location|where|address|based|city|jagdalpur|bastar|chhattisgarh|office|kahan|sthan|pata)\b/i,
          en: "We are based in Jagdalpur, Bastar, Chhattisgarh, India, and work with businesses across India.",
          hi: "à¤¹à¤® à¤œà¤—à¤¦à¤²à¤ªà¥à¤°, à¤¬à¤¸à¥à¤¤à¤°, à¤›à¤¤à¥à¤¤à¥€à¤¸à¤—à¤¢à¤¼ à¤®à¥‡à¤‚ à¤¹à¥ˆà¤‚ à¤”à¤° à¤ªà¥‚à¤°à¥‡ à¤­à¤¾à¤°à¤¤ à¤•à¥‡ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        },
        {
          id: 'services_overview',
          keywords: /\b(services|all services|offer|provide|options|kya karte ho|seva|sevaen)\b/i,
          en: "We offer 8 services: Google and Meta Ads, SEO and AI Search, Web Development, Business Automation, AI Chatbots and Tools, Video Production, Social Media and Branding, and Business Review. Choose one or combine them.",
          hi: "à¤¹à¤®à¤¾à¤°à¥€ 8 à¤¸à¥‡à¤µà¤¾à¤à¤ à¤¹à¥ˆà¤‚: Google à¤”à¤° Meta Ads, SEO à¤”à¤° AI Search, à¤µà¥‡à¤¬ à¤¡à¥‡à¤µà¤²à¤ªà¤®à¥‡à¤‚à¤Ÿ, à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤‘à¤Ÿà¥‹à¤®à¥‡à¤¶à¤¨, AI à¤šà¥ˆà¤Ÿà¤¬à¥‰à¤Ÿ à¤”à¤° à¤Ÿà¥‚à¤²à¥à¤¸, à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤¶à¤¨, à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤”à¤° à¤¬à¥à¤°à¤¾à¤‚à¤¡à¤¿à¤‚à¤—, à¤”à¤° à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤°à¤¿à¤µà¥à¤¯à¥‚à¥¤ à¤à¤• à¤šà¥à¤¨à¥‡à¤‚ à¤¯à¤¾ à¤¸à¤¬ à¤®à¤¿à¤²à¤¾à¤à¤à¥¤"
        },
        {
          id: 'ads',
          keywords: /\b(ads|google ads|meta ads|facebook ads|instagram ads|paid ads|ad campaigns|ad|vigyapan)\b/i,
          en: "Ads: Google Search and Display ads, Facebook and Instagram ads, lead and sales campaigns, and a simple monthly report.",
          hi: "à¤µà¤¿à¤œà¥à¤žà¤¾à¤ªà¤¨: Google Search à¤”à¤° Display ads, Facebook à¤”à¤° Instagram ads, à¤²à¥€à¤¡ à¤”à¤° à¤¸à¥‡à¤²à¥à¤¸ à¤•à¥ˆà¤‚à¤ªà¥‡à¤¨, à¤”à¤° à¤†à¤¸à¤¾à¤¨ à¤®à¤¾à¤¸à¤¿à¤• à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿà¥¤"
        },
        {
          id: 'seo',
          keywords: /\b(seo|ai search|geo|search ranking|google business profile|gmb|keyword)\b/i,
          en: "SEO and AI Search: local and website SEO, Google Business Profile, AI search visibility (GEO) and a keyword and content plan.",
          hi: "SEO à¤”à¤° AI Search: à¤²à¥‹à¤•à¤² à¤”à¤° à¤µà¥‡à¤¬à¤¸à¤¾à¤‡à¤Ÿ SEO, Google Business Profile, AI à¤¸à¤°à¥à¤š à¤®à¥‡à¤‚ à¤¦à¤¿à¤–à¤¨à¤¾ (GEO) à¤”à¤° à¤•à¥€à¤µà¤°à¥à¤¡ à¤µ à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ à¤ªà¥à¤²à¤¾à¤¨à¥¤"
        },
        {
          id: 'web',
          keywords: /\b(web|website|web development|app|online store|ecommerce|landing page|mobile design)\b/i,
          en: "Web Development: business and landing pages, online stores, mobile-first design, with speed and security.",
          hi: "à¤µà¥‡à¤¬ à¤¡à¥‡à¤µà¤²à¤ªà¤®à¥‡à¤‚à¤Ÿ: à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤”à¤° à¤²à¥ˆà¤‚à¤¡à¤¿à¤‚à¤— à¤ªà¥‡à¤œ, à¤‘à¤¨à¤²à¤¾à¤‡à¤¨ à¤¸à¥à¤Ÿà¥‹à¤°, à¤®à¥‹à¤¬à¤¾à¤‡à¤²-à¤«à¥à¤°à¥‡à¤‚à¤¡à¤²à¥€ à¤¡à¤¿à¤œà¤¼à¤¾à¤‡à¤¨, à¤¤à¥‡à¤œà¤¼ à¤”à¤° à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤à¥¤"
        },
        {
          id: 'automation',
          keywords: /\b(automation|ai tools|workflow|crm|follow-up|follow up|reminders|lead capture|chatbots)\b/i,
          en: "Business Automation and AI: automatic follow-ups and reminders, lead capture, WhatsApp and email workflows, chatbots and AI tools. We also support you after launch.",
          hi: "à¤‘à¤Ÿà¥‹à¤®à¥‡à¤¶à¤¨ à¤”à¤° AI: à¤‘à¤Ÿà¥‹à¤®à¥ˆà¤Ÿà¤¿à¤• à¤«à¥‰à¤²à¥‹-à¤…à¤ª à¤”à¤° à¤°à¤¿à¤®à¤¾à¤‡à¤‚à¤¡à¤°, à¤²à¥€à¤¡ à¤•à¥ˆà¤ªà¥à¤šà¤°, WhatsApp à¤”à¤° à¤ˆà¤®à¥‡à¤² à¤µà¤°à¥à¤•à¤«à¤¼à¥à¤²à¥‹, à¤šà¥ˆà¤Ÿà¤¬à¥‰à¤Ÿ à¤”à¤° AI à¤Ÿà¥‚à¤²à¥à¤¸à¥¤ à¤²à¥‰à¤¨à¥à¤š à¤•à¥‡ à¤¬à¤¾à¤¦ à¤­à¥€ à¤¹à¤® à¤¸à¤ªà¥‹à¤°à¥à¤Ÿ à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        },
        {
          id: 'video',
          keywords: /\b(video|videos|film|films|reels|social media|branding|logo|brand look|editing|content)\b/i,
          en: "Video and Content: brand and product films, reels and ads, editing, social media content, account handling, logo and brand look.",
          hi: "à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤”à¤° à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ: à¤¬à¥à¤°à¤¾à¤‚à¤¡ à¤”à¤° à¤ªà¥à¤°à¥‹à¤¡à¤•à¥à¤Ÿ à¤«à¤¿à¤²à¥à¤®, à¤°à¥€à¤²à¥à¤¸ à¤”à¤° à¤à¤¡à¥à¤¸, à¤à¤¡à¤¿à¤Ÿà¤¿à¤‚à¤—, à¤¸à¥‹à¤¶à¤² à¤®à¥€à¤¡à¤¿à¤¯à¤¾ à¤•à¤‚à¤Ÿà¥‡à¤‚à¤Ÿ, à¤…à¤•à¤¾à¤‰à¤‚à¤Ÿ à¤¹à¥ˆà¤‚à¤¡à¤²à¤¿à¤‚à¤—, à¤²à¥‹à¤—à¥‹ à¤”à¤° à¤¬à¥à¤°à¤¾à¤‚à¤¡ à¤²à¥à¤•à¥¤"
        },
        {
          id: 'review',
          keywords: /\b(review|business review|growth plan|audit|gaps|quick wins|growth plan)\b/i,
          en: "Business Review: we review your marketing, website and follow-up, list gaps and quick wins, and give you a written growth plan you can use with us or without us.",
          hi: "à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤°à¤¿à¤µà¥à¤¯à¥‚: à¤¹à¤® à¤†à¤ªà¤•à¥€ à¤®à¤¾à¤°à¥à¤•à¥‡à¤Ÿà¤¿à¤‚à¤—, à¤µà¥‡à¤¬à¤¸à¤¾à¤‡à¤Ÿ à¤”à¤° à¤«à¥‰à¤²à¥‹-à¤…à¤ª à¤¦à¥‡à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤•à¤®à¤¿à¤¯à¤¾à¤ à¤”à¤° à¤œà¤²à¥à¤¦à¥€ à¤œà¥€à¤¤ à¤¬à¤¤à¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤”à¤° à¤²à¤¿à¤–à¤¿à¤¤ à¤—à¥à¤°à¥‹à¤¥ à¤ªà¥à¤²à¤¾à¤¨ à¤¦à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤œà¥‹ à¤†à¤ª à¤¹à¤®à¤¾à¤°à¥‡ à¤¸à¤¾à¤¥ à¤¯à¤¾ à¤¬à¤¿à¤¨à¤¾ à¤¹à¤®à¤¾à¤°à¥‡ à¤‡à¤¸à¥à¤¤à¥‡à¤®à¤¾à¤² à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        },
        {
          id: 'process',
          keywords: /\b(process|how we work|how do you work|steps|discover|plan|build|grow|tareeka)\b/i,
          en: "4 steps: Discover, Plan, Build, Grow. We learn your business, make a clear plan, create everything, then track and improve every month.",
          hi: "4 à¤¸à¥à¤Ÿà¥‡à¤ª: Discover, Plan, Build, Growà¥¤ à¤¹à¤® à¤†à¤ªà¤•à¤¾ à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¸à¤®à¤à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¸à¤¾à¤«à¤¼ à¤ªà¥à¤²à¤¾à¤¨ à¤¬à¤¨à¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤¸à¤¬ à¤•à¥à¤› à¤¤à¥ˆà¤¯à¤¾à¤° à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤¹à¤° à¤®à¤¹à¥€à¤¨à¥‡ à¤¸à¥à¤§à¤¾à¤° à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        },
        {
          id: 'clients',
          keywords: /\b(clients|trusted by|brands|decathlon|mohotsav|pw|vidyapeeth|portfolio|customers)\b/i,
          en: "We have worked with brands like Decathlon, Mohotsav and PW Vidyapeeth, and create for construction, real estate and retail businesses.",
          hi: "à¤¹à¤®à¤¨à¥‡ Decathlon, Mohotsav à¤”à¤° PW Vidyapeeth à¤œà¥ˆà¤¸à¥‡ à¤¬à¥à¤°à¤¾à¤‚à¤¡à¥à¤¸ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤•à¤¾à¤® à¤•à¤¿à¤¯à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤•à¤‚à¤¸à¥à¤Ÿà¥à¤°à¤•à¥à¤¶à¤¨, à¤°à¤¿à¤¯à¤² à¤à¤¸à¥à¤Ÿà¥‡à¤Ÿ à¤”à¤° à¤°à¤¿à¤Ÿà¥‡à¤² à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤•à¥‡ à¤²à¤¿à¤ à¤¬à¤¨à¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        },
        {
          id: 'pricing',
          keywords: /\b(price|pricing|cost|rate|fee|fees|budget|charge|kitna|kitne|paisa|daam)\b/i,
          en: "Pricing depends on what you need. Share your details in the contact form and we will reply on WhatsApp with a clear plan.",
          hi: "à¤•à¥€à¤®à¤¤ à¤†à¤ªà¤•à¥€ à¤œà¤¼à¤°à¥‚à¤°à¤¤ à¤ªà¤° à¤¨à¤¿à¤°à¥à¤­à¤° à¤•à¤°à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤•à¥‰à¤¨à¥à¤Ÿà¥ˆà¤•à¥à¤Ÿ à¤«à¥‰à¤°à¥à¤® à¤­à¤°à¥‡à¤‚, à¤¹à¤® WhatsApp à¤ªà¤° à¤¸à¤¾à¤«à¤¼ à¤ªà¥à¤²à¤¾à¤¨ à¤•à¥‡ à¤¸à¤¾à¤¥ à¤œà¤µà¤¾à¤¬ à¤¦à¥‡à¤‚à¤—à¥‡à¥¤"
        },
        {
          id: 'get_started',
          keywords: /\b(get started|start|begin|hire|onboard|kaise shuru|shuru kare|shuruat)\b/i,
          en: "Getting started is easy: fill in the contact form or message us on WhatsApp. We reply within one business day.",
          hi: "à¤¶à¥à¤°à¥‚ à¤•à¤°à¤¨à¤¾ à¤†à¤¸à¤¾à¤¨ à¤¹à¥ˆ: à¤•à¥‰à¤¨à¥à¤Ÿà¥ˆà¤•à¥à¤Ÿ à¤«à¥‰à¤°à¥à¤® à¤­à¤°à¥‡à¤‚ à¤¯à¤¾ WhatsApp à¤ªà¤° à¤®à¥ˆà¤¸à¥‡à¤œ à¤•à¤°à¥‡à¤‚à¥¤ à¤¹à¤® à¤à¤• à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¡à¥‡ à¤®à¥‡à¤‚ à¤œà¤µà¤¾à¤¬ à¤¦à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        },
        {
          id: 'contact',
          keywords: /\b(contact|reach|phone|call|email|whatsapp|instagram|linkedin|facebook|sampark)\b/i,
          en: "You can reach us through the contact form, WhatsApp, Instagram, LinkedIn or Facebook. See the Contact section. We reply within one business day.",
          hi: "à¤†à¤ª à¤•à¥‰à¤¨à¥à¤Ÿà¥ˆà¤•à¥à¤Ÿ à¤«à¥‰à¤°à¥à¤®, WhatsApp, Instagram, LinkedIn à¤¯à¤¾ Facebook à¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤¹à¤® à¤à¤• à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¡à¥‡ à¤®à¥‡à¤‚ à¤œà¤µà¤¾à¤¬ à¤¦à¥‡à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤"
        }
      ];

      const FALLBACK = {
        en: "I am not sure about that. Please use the contact form or WhatsApp and our team will reply within one business day.",
        hi: "à¤‡à¤¸ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤®à¥à¤à¥‡ à¤ªà¤•à¥à¤•à¤¾ à¤ªà¤¤à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤•à¥‰à¤¨à¥à¤Ÿà¥ˆà¤•à¥à¤Ÿ à¤«à¥‰à¤°à¥à¤® à¤¯à¤¾ WhatsApp à¤•à¤¾ à¤‡à¤¸à¥à¤¤à¥‡à¤®à¤¾à¤² à¤•à¤°à¥‡à¤‚, à¤¹à¤®à¤¾à¤°à¥€ à¤Ÿà¥€à¤® à¤à¤• à¤¬à¤¿à¤œà¤¼à¤¨à¥‡à¤¸ à¤¡à¥‡ à¤®à¥‡à¤‚ à¤œà¤µà¤¾à¤¬ à¤¦à¥‡à¤—à¥€à¥¤"
      };

      const QUICK_CHIPS = {
        en: ["What does Jagvix do?", "Our services", "Where are you based?", "How to get started?"],
        hi: ["Jagvix à¤•à¥à¤¯à¤¾ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ?", "à¤¹à¤®à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾à¤à¤", "à¤†à¤ª à¤•à¤¹à¤¾à¤ à¤¸à¥à¤¥à¤¿à¤¤ à¤¹à¥ˆà¤‚?", "à¤•à¥ˆà¤¸à¥‡ à¤¶à¥à¤°à¥‚ à¤•à¤°à¥‡à¤‚?"]
      };

      let currentLang = 'en';
      let memoryHistory = { createdAt: Date.now(), messages: [] };

      // Language detection
      function detectLanguage(text) {
        if (/[\u0900-\u097F]/.test(text)) return 'hi';
        const hinglishPattern = /\b(kya|kaise|hai|hain|aap|hum|kahan|kitna|kitne|chahiye|batao|bataiye|karte|kaam|seva|sampark|naukri|paisa|daam|karo|kaun|kab|kyu|kyun|shuru|madad|namaste|pranam|bata|batao|karen|kare|ke|ki|ko|se|me|mein|par)\b/i;
        if (hinglishPattern.test(text)) return 'hi';
        return 'en';
      }

      // Update UI elements to match current language
      function updateUILanguage(lang) {
        currentLang = lang;
        if (lang === 'hi') {
          chatInput.placeholder = "Jagvix à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤ªà¥‚à¤›à¥‡à¤‚â€¦";
          chatInput.setAttribute('aria-label', "Jagvix à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤ªà¥‚à¤›à¥‡à¤‚");
          chatSendBtn.textContent = "à¤­à¥‡à¤œà¥‡à¤‚";
          footerNote.textContent = "à¤šà¥ˆà¤Ÿ à¤¹à¤° 24 à¤˜à¤‚à¤Ÿà¥‡ à¤®à¥‡à¤‚ à¤…à¤ªà¤¨à¥‡ à¤†à¤ª à¤¡à¤¿à¤²à¥€à¤Ÿ à¤¹à¥‹ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆà¥¤";
        } else {
          chatInput.placeholder = "Ask about Jagvixâ€¦";
          chatInput.setAttribute('aria-label', "Ask about Jagvix");
          chatSendBtn.textContent = "Send";
          footerNote.textContent = "Chats are deleted automatically every 24 hours.";
        }
        renderQuickChips(lang);
      }

      function renderQuickChips(lang) {
        quickRepliesContainer.innerHTML = '';
        const chips = QUICK_CHIPS[lang] || QUICK_CHIPS.en;
        chips.forEach((q) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = q;
          btn.addEventListener('click', () => handleUserInput(q));
          quickRepliesContainer.appendChild(btn);
        });
      }

      // Safely append a message to DOM without XSS
      function appendMessageDOM(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${role === 'user' ? 'user' : 'bot'}`;
        msgDiv.textContent = text;
        msgsContainer.appendChild(msgDiv);
        msgsContainer.scrollTop = msgsContainer.scrollHeight;
      }

      // Storage Management (24-Hour Client-Side Auto-Delete)
      function loadStorage() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const data = JSON.parse(raw);
            const now = Date.now();
            if (now - (data.createdAt || 0) > TWENTY_FOUR_HOURS) {
              clearStorage();
              return null;
            }
            // Filter messages older than 24 hours
            data.messages = (data.messages || []).filter(m => (now - m.ts) < TWENTY_FOUR_HOURS);
            saveStorage(data);
            return data;
          }
        } catch (e) {
          // LocalStorage blocked or error
        }
        return null;
      }

      function saveStorage(data) {
        memoryHistory = data;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
          // LocalStorage quota or access denied
        }
      }

      function clearStorage() {
        memoryHistory = { createdAt: Date.now(), messages: [] };
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
      }

      // Restore messages or show welcome
      function renderHistory() {
        msgsContainer.innerHTML = '';
        const data = loadStorage() || memoryHistory;
        if (data && data.messages && data.messages.length > 0) {
          data.messages.forEach(m => appendMessageDOM(m.role, m.text));
        } else {
          // Welcome message
          const welcome = "Hi! I am the Jagvix assistant. Ask me anything about our company.";
          appendMessageDOM('bot', welcome);
          saveMessage('bot', welcome);
        }
      }

      function saveMessage(role, text) {
        let data = loadStorage() || memoryHistory;
        if (!data || !data.createdAt) {
          data = { createdAt: Date.now(), messages: [] };
        }
        data.messages.push({ role, text, ts: Date.now() });
        saveStorage(data);
      }

      // Knowledge Base Matcher
      function getBotAnswer(query, lang) {
        for (const item of KNOWLEDGE_BASE) {
          if (item.keywords.test(query)) {
            return lang === 'hi' ? item.hi : item.en;
          }
        }
        return lang === 'hi' ? FALLBACK.hi : FALLBACK.en;
      }

      let isBotTyping = false;

      function handleUserInput(rawText) {
        const text = sanitizeText(rawText);
        if (!text || isBotTyping) return;

        // Detect language for latest message
        const lang = detectLanguage(text);
        updateUILanguage(lang);

        // Render user message
        appendMessageDOM('user', text);
        saveMessage('user', text);
        chatInput.value = '';

        // Typing indicator
        isBotTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        msgsContainer.appendChild(typingDiv);
        msgsContainer.scrollTop = msgsContainer.scrollHeight;

        // 350-550ms typing delay
        const delay = Math.floor(Math.random() * 200) + 350;
        setTimeout(() => {
          if (typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
          }
          const reply = getBotAnswer(text, lang);
          appendMessageDOM('bot', reply);
          saveMessage('bot', reply);
          isBotTyping = false;
        }, delay);
      }

      // Event Listeners
      fab.addEventListener('click', () => {
        const isOpen = panel.classList.contains('open');
        panel.classList.toggle('open', !isOpen);
        fab.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) {
          loadStorage(); // Verify 24hr expiry upon opening
          chatInput.focus();
        }
      });

      closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
      });

      chatSendBtn.addEventListener('click', () => {
        handleUserInput(chatInput.value);
      });

      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleUserInput(chatInput.value);
        }
      });

      // Initialize Chatbot State
      updateUILanguage('en');
      renderHistory();

      // Check 24-hr expiry every 5 minutes
      setInterval(() => {
        loadStorage();
      }, 5 * 60 * 1000);
    })();
