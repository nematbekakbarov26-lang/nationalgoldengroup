document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonials Slider Logic
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');

    window.currentSlide = (n) => {
        showSlides(currentSlideIndex = n);
    };

    function showSlides(n) {
        if (!slides.length) return;
        if (n >= slides.length) currentSlideIndex = 0;
        if (n < 0) currentSlideIndex = slides.length - 1;

        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    }

    // Auto slide
    setInterval(() => {
        currentSlideIndex++;
        showSlides(currentSlideIndex);
    }, 5000);

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('section, .glass-card, .stat-item');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('revealed');
            }
        });
    };

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentLang = localStorage.getItem('selectedLang') || 'en';
            const email = "mexri@tuit.uz";
            const name = contactForm.querySelector('input[type="text"]').value;
            const userEmail = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            const mailtoLink = `mailto:${email}?subject=New Inquiry from ${name}&body=From: ${name} (${userEmail})%0D%0A%0D%0A${message}`;
            window.location.href = mailtoLink;

            alert(translations[currentLang].msg_sent || "Message sent!");
            contactForm.reset();
        });
    }

    // Pricing Toggle Logic
    const planToggle = document.getElementById('plan-toggle');
    const updatePrices = () => {
        const isYearly = planToggle.checked;
        const buyNowButtons = document.querySelectorAll('.buy-now');
        const currentLang = localStorage.getItem('selectedLang') || 'en';

        buyNowButtons.forEach(btn => {
            const priceMo = btn.getAttribute('data-price-mo');
            const priceYr = btn.getAttribute('data-price-yr');
            const priceEl = btn.parentElement.querySelector('.price');

            if (priceMo && priceYr) {
                if (isYearly) {
                    priceEl.innerHTML = `$${priceYr} <span class="period">${translations[currentLang].per_yr}</span>`;
                } else {
                    priceEl.innerHTML = `$${priceMo} <span class="period">${translations[currentLang].per_mo}</span>`;
                }
            }
        });
    };

    if (planToggle) {
        planToggle.addEventListener('change', updatePrices);
    }

    // Cart Logic
    let cart = [];
    const cartBadge = document.querySelector('.cart-badge');
    const cartToggle = document.getElementById('cart-toggle');
    const modal = document.getElementById('checkout-modal');
    const closeBtn = document.querySelector('.close-modal');
    const buyBtns = document.querySelectorAll('.buy-now');
    const paymentForm = document.getElementById('payment-form');
    const paymentStatus = document.getElementById('payment-status');
    const selectedProductName = document.getElementById('selected-product-name');
    const selectedProductPrice = document.getElementById('selected-product-price');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('card-expiry');
    const cvcInput = document.getElementById('card-cvc');

    const validateCard = (number) => {
        let nCheck = 0, nDigit = 0, bEven = false;
        number = number.replace(/\D/g, "");
        for (let n = number.length - 1; n >= 0; n--) {
            let cDigit = number.charAt(n),
                nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return (nCheck % 10) === 0 && number.length >= 13;
    };

    const validateExpiry = (value) => {
        if (!/^\d{2}\/\d{2}$/.test(value)) return false;
        const [month, year] = value.split('/').map(v => parseInt(v, 10));
        if (month < 1 || month > 12) return false;

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        return true;
    };

    const validateCVC = (value) => {
        return /^\d{3,4}$/.test(value);
    };

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formattedValue += ' ';
                formattedValue += value[i];
            }
            e.target.value = formattedValue.slice(0, 19);

            if (value.length >= 13) {
                if (validateCard(value)) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                } else {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.remove('valid', 'invalid');
            }
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value.slice(0, 5);

            if (value.length === 5) {
                if (validateExpiry(e.target.value)) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                } else {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.remove('valid', 'invalid');
            }
        });
    }

    if (cvcInput) {
        cvcInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.slice(0, 4);

            if (value.length >= 3) {
                if (validateCVC(value)) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                } else {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            } else {
                e.target.classList.remove('valid', 'invalid');
            }
        });
    }

    const updateCartBadge = () => {
        if (cartBadge) {
            cartBadge.textContent = cart.length;
            cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    };

    const openCart = () => {
        const currentLang = localStorage.getItem('selectedLang') || 'en';
        if (cart.length === 0) {
            alert(translations[currentLang].msg_cart_empty || "Your cart is empty!");
            return;
        }

        const itemsList = document.getElementById('cart-items-list');
        const totalPriceEl = document.getElementById('selected-product-price');
        const subtotalEl = document.getElementById('summary-subtotal');

        if (itemsList) {
            itemsList.innerHTML = '';
            cart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item-row';
                itemDiv.innerHTML = `
                    <span>${item.name}</span>
                    <span>$${item.price}</span>
                `;
                itemsList.appendChild(itemDiv);
            });
        }

        const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;
        if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
        paymentStatus.textContent = '';
        if (paymentForm) paymentForm.reset();

        // Show/Hide Zoom Email field
        const zoomField = document.getElementById('zoom-email-group');
        if (zoomField) {
            const hasZoom = cart.some(item => item.name.toLowerCase().includes('zoom'));
            zoomField.style.display = hasZoom ? 'block' : 'none';
            document.getElementById('zoom-account-email').required = hasZoom;
        }
    };

    const closeCart = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    const panelOverlay = document.querySelector('.panel-overlay');
    if (panelOverlay) panelOverlay.addEventListener('click', closeCart);

    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
    }

    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.getAttribute('data-product');
            const isYearly = planToggle && planToggle.checked;
            const priceMo = btn.getAttribute('data-price-mo');
            const priceYr = btn.getAttribute('data-price-yr');
            const price = isYearly ? priceYr : priceMo;
            const currentLang = localStorage.getItem('selectedLang') || 'en';
            const periodLabel = isYearly ? translations[currentLang].per_yr : translations[currentLang].per_mo;

            cart.push({
                name: `${product} (${periodLabel.replace('/', '')})`,
                price: price
            });
            updateCartBadge();

            // Open cart immediately as per user request
            openCart();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentLang = localStorage.getItem('selectedLang') || 'en';
            const zoomAccountEmail = document.getElementById('zoom-account-email')?.value;
            const customerEmail = paymentForm.querySelector('input[type="email"]')?.value || zoomAccountEmail;

            paymentStatus.innerHTML = `<span style="color: var(--primary)">${translations[currentLang].msg_processing}</span>`;

            try {
                const response = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cart,
                        customerEmail: customerEmail,
                        zoomAccountEmail: zoomAccountEmail
                    })
                });

                const session = await response.json();
                if (session.url) {
                    window.location.href = session.url; // Redirect to Stripe
                } else {
                    throw new Error(session.error || 'Failed to create session');
                }
            } catch (error) {
                console.error(error);
                paymentStatus.innerHTML = `<span style="color: #f44336">${translations[currentLang].msg_error_generic || "Checkout failed. Please try again."}</span>`;
            }
        });
    }

    updateCartBadge();

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Localization Logic
    const initLanguage = () => {
        const savedLang = localStorage.getItem('selectedLang') || 'en';
        applyTranslations(savedLang);

        // Update mini switchers if they exist
        const miniSwitchers = document.querySelectorAll('.lang-select-mini');
        miniSwitchers.forEach(s => s.value = savedLang);
    };

    window.changeLanguage = (lang) => {
        localStorage.setItem('selectedLang', lang);
        applyTranslations(lang);

        // Sync mini switchers
        const miniSwitchers = document.querySelectorAll('.lang-select-mini');
        miniSwitchers.forEach(s => s.value = lang);
    };

    const applyTranslations = (lang) => {
        const dict = translations[lang];

        // Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                // If it contains a span (like titles), we might need to handle it carefully
                if (el.querySelector('span')) {
                    const spanText = el.querySelector('span').outerHTML;
                    // This is a bit hacky, assumes the span is at the end or marked. 
                    // Better approach: use keys for parts or simple innerHTML if it's safe.
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    };

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');

        if (!cookiesAccepted) {
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 2000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('active');
        });
    }

    initLanguage();
});

const translations = {
    en: {
        nav_home: "Home", nav_about: "About", nav_services: "Services", nav_products: "Products", nav_contact: "Contact",
        hero_title: "Leading Excellence in <span>Digital Solutions</span>",
        hero_desc: "NATIONAL GOLDEN GROUP delivers high-performance IT infrastructure, cybersecurity, and cloud services tailored for your business growth.",
        btn_services: "Our Services", btn_contact: "Contact Us",
        about_title: "About <span>Us</span>",
        about_desc1: "NATIONAL GOLDEN GROUP is a premier Value Added Distributor and IT solutions provider. Inspired by the best in the industry, we bring top-tier technologies to the local and regional markets.",
        about_desc2: "We are a proud partner and distributor of world-leading brands including Zoom, Microsoft, Kaspersky, Eset, ANY.RUN, STATA, and many other industry leaders.",
        about_desc3: "Our mission is to empower businesses with secure, scalable, and efficient IT ecosystems that drive innovation.",
        stat_years: "Years Experience", stat_clients: "Clients", stat_vendors: "Global Vendors",
        services_title: "Our <span>Core Services</span>",
        svc_cyber_title: "Cyber Security", svc_cyber_desc: "Advanced protection for your digital assets against evolving threats.",
        svc_cloud_title: "Cloud Infrastructure", svc_cloud_desc: "Scalable cloud solutions that enhance business agility and performance.",
        svc_net_title: "Network Solutions", svc_net_desc: "Robust networking infrastructure for seamless communication.",
        vendors_title: "Our <span>Premium Partners</span>",
        vnd_zoom: "Official Partner", vnd_ms: "Authorized Seller", vnd_kasp: "Security Partner", vnd_eset: "Gold Partner", vnd_any: "Security Partner", vnd_stata: "Official Distributor",
        vendors_footer: "and 50+ other world-leading IT brands...",
        contact_title: "Contact <span>Us</span>",
        ph_name: "Name", ph_email: "Email", ph_msg: "Your Message", btn_send: "Send Message",
        select_lang: "Select Language", footer_copy: "© 2026 NATIONAL GOLDEN GROUP. All rights reserved.",
        contact_addr: "Uzbekistan, Bukhara, Gijduvan, Alpomish 1",
        about_ssl: "We also provide various types of SSL certificates to ensure the highest level of security for your websites and digital infrastructure.",
        products_title: "Our <span>Premium Products</span>", btn_buy: "Buy Now", btn_inquire: "Inquire Now", price_contact: "Contact for pricing",
        per_mo: "/mo", per_yr: "/yr", per_once: "/once",
        lbl_monthly: "Monthly", lbl_yearly: "Yearly", lbl_save_up_to: "Save up to 20%",
        mdl_checkout: "Checkout", lbl_name: "Cardholder Name", ph_john: "John Doe", lbl_card: "Card Number", lbl_expiry: "Expiry Date", lbl_cvv: "CVV", btn_pay: "Pay Now",
        lbl_addr: "Shipping Address", ph_addr: "Your full address", msg_cart_empty: "Your cart is empty!",
        msg_processing: "Processing payment...", msg_success: "Payment Successful! Thank you for your purchase.",
        msg_invalid_card: "Invalid card number!", msg_sent: "Message sent! We will contact you soon.",
        lbl_total: "Total", lbl_product: "Product:",
        lbl_order_summary: "Order Summary", lbl_subtotal: "Subtotal", lbl_tax: "Tax (0%)",
        lbl_secure: "Secure Payment", lbl_guarantee: "Money Back Guarantee",
        step_1: "1. Shipping Information", step_2: "2. Payment Method",
        alert_congrats: "Congratulations! You have successfully purchased the product.",
        msg_error_generic: "Checkout failed. Please try again.",
        lbl_zoom_email: "Zoom Account Email",
        prod_m365: "Microsoft 365 Business", prod_m365_f1: "Full Office Suite & Teams", prod_m365_f2: "1TB Cloud Storage", prod_m365_f3: "Advanced Security",
        prod_zoom_pro: "Zoom Workplace Pro", prod_zoom_pro_f1: "Up to 100 participants", prod_zoom_pro_f2: "Unlimited whiteboards", prod_zoom_pro_f3: "AI Companion included",
        prod_zoom_large: "Large Meetings Add-on", prod_zoom_large_f1: "Up to 500 participants", prod_zoom_large_f2: "Custom branding options", prod_zoom_large_f3: "Advanced registration",
        prod_win11: "Windows 11 Professional", prod_win11_f1: "For small & mid-size business", prod_win11_f2: "Enterprise-grade Security", prod_win11_f3: "Remote Desktop enabled",
        prod_zoom: "Zoom Workplace Business Plus", prod_zoom_f1: "Up to 300 Participants", prod_zoom_f2: "Unlimited Whiteboards", prod_zoom_f3: "Zoom Phone included",
        prod_kasp: "Kaspersky Plus", prod_kasp_f1: "Advanced Malware Protection", prod_kasp_f2: "Unlimited VPN included", prod_kasp_f3: "Safe Money features",
        prod_eset: "ESET Home Security Premium", prod_eset_f1: "Legendary Antivirus technology", prod_eset_f2: "Password Manager included", prod_eset_f3: "Secure Data encryption",
        prod_any: "ANY.RUN Hunter", prod_any_f1: "Interactive Malware Sandbox", prod_any_f2: "Network Traffic analysis", prod_any_f3: "Process behavior tracking",
        prod_stata: "Stata/MP (2-core)", prod_stata_f1: "Fastest version of Stata", prod_stata_f2: "Parallel computing support", prod_stata_f3: "For large datasets",
        prod_rstudio: "R-Studio Standard", prod_rstudio_f1: "Advanced Data Recovery", prod_rstudio_f2: "FAT/NTFS/HFS+ Support", prod_rstudio_f3: "RAID Recovery included",
        per_mo: "/mo", per_yr: "/yr", per_once: "/once",
        bot_name: "National Assistant", bot_status: "Online", bot_greeting: "Hello! I'm your National Golden Group assistant. How can I help you today?",
        chat_ph: "Type your message...", bot_typing: "Typing...", bot_response_default: "Thank you for your message! Our team will get back to you soon. You can ask about our products, services, or pricing.",
        faq_ngg: "National Golden Group (NGG) is a leading IT distributor and solution provider. we specialize in Cybersecurity, Cloud infrastructure, and Software licensing.",
        faq_services: "We offer Cybersecurity (protection), Cloud Solutions (infrastructure), and Network Solutions. Which one would you like to know more about?",
        faq_price: "For detailed pricing on our enterprise solutions, please contact our sales team at info.nationalgoldengroup@gmail.com or call our office.",
        faq_payment: "We support various payment methods including bank transfers and major credit cards for our products.",
        faq_buy: "To purchase, you can use the 'Buy Now' buttons on our products page or contact us directly for bulk licenses.",
        faq_title: "Frequently Asked <span>Questions</span>",
        faq_q1: "What services does National Golden Group provide?",
        faq_a1: "We specialize in Cybersecurity, Cloud Infrastructure, and Network Solutions. We also provide software licensing for major brands like Microsoft, Zoom, Kaspersky, and ESET.",
        faq_q2: "Where is your office located?",
        faq_a2: "Our office is located at Uzbekistan, Bukhara, Gijduvan, Alpomish 1. You are welcome to visit us!",
        faq_q3: "Do you provide SSL certificates?",
        faq_a3: "Yes, we provide various types of SSL certificates to ensure the highest level of security for your websites and digital infrastructure.",
        faq_q4: "How can I contact sales?",
        faq_a4: "You can contact our sales team via email at info.nationalgoldengroup@gmail.com or by calling +998 91 828 22 08 / +998 91 780 00 35.",
        testi_title: "Client <span>Feedback</span>",
        testi_q1: "National Golden Group has transformed our IT infrastructure. Their cybersecurity solutions are top-notch and reliable.",
        testi_a1: "Azizbek G'ofurov", testi_p1: "IT Director, TechMind",
        testi_q2: "The cloud migration was seamless. Highly recommend their professional team for any IT project.",
        testi_a2: "Elena Smirnova", testi_p2: "CEO, Global Solutions",
        testi_q3: "Professional service and great support. They are our go-to partner for all software licensing needs.",
        testi_a3: "Umar Shodiyev", testi_p3: "Procurement Manager, Innovate Uz",
        how_title: "How it <span>Works</span>",
        how_step1_t: "Choose & Order", how_step1_d: "Select your digital product or subscription and proceed to secure checkout.",
        how_step2_t: "License Delivery", how_step2_d: "For Zoom: We assign the license to your email. For others: You receive a key via email.",
        how_step3_t: "Instant Activate", how_step3_d: "Start using your premium features immediately with professional support if needed.",
        cookie_msg: "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
        btn_accept: "Accept"
    },
    ru: {
        nav_home: "Главная", nav_about: "О нас", nav_services: "Услуги", nav_products: "Продукты", nav_contact: "Контакты",
        hero_title: "Лидерство в <span>Цифровых Решениях</span>",
        hero_desc: "NATIONAL GOLDEN GROUP предоставляет высокопроизводительную ИТ-инфраструктуру, кибербезопасность и облачные услуги для роста вашего бизнеса.",
        btn_services: "Наши Услуги", btn_contact: "Связаться с нами",
        about_title: "О <span>Нас</span>",
        about_desc1: "NATIONAL GOLDEN GROUP — ведущий дистрибьютор и поставщик ИТ-решений. Вдохновленные лучшими в отрасли, мы приносим передaвые технологии на местный и региональный рынки.",
        about_desc2: "Мы являемся гордым партнером и дистрибьютором мировых брендов, включая Zoom, Microsoft, Kaspersky, Eset, ANY.RUN, STATA и многих других.",
        about_desc3: "Наша миссия — расширять возможности бизнеса с помощью безопасных, масштабируемых и эффективных ИТ-экосистем.",
        stat_years: "Лет Опыта", stat_clients: "Клиентов", stat_vendors: "Мировых Вендоров",
        services_title: "Наши <span>Основные Услуги</span>",
        svc_cyber_title: "Кибербезопасность", svc_cyber_desc: "Современная защита ваших цифровых активов от возникающих угроз.",
        svc_cloud_title: "Облачная Инфраструктура", svc_cloud_desc: "Масштабируемые облачные решения, повышающие гибкость и производительность бизнеса.",
        svc_net_title: "Сетевые Решения", svc_net_desc: "Надежная сетевая инфраструктура для бесперебойной связи.",
        vendors_title: "Наши <span>Премиум Партнеры</span>",
        vnd_zoom: "Официальный Партнер", vnd_ms: "Авторизованный Продавец", vnd_kasp: "Партнер по Безопасности", vnd_eset: "Золотой Партнер", vnd_any: "Партнер по Безопасности", vnd_stata: "Официальный Дистрибьютор",
        vendors_footer: "и более 50 других ведущих мировых ИТ-брендов...",
        contact_title: "Связаться с <span>Нами</span>",
        ph_name: "Имя", ph_email: "Email", ph_msg: "Ваше сообщение", btn_send: "Отправить Сообщение",
        select_lang: "Выберите Язык", footer_copy: "© 2026 NATIONAL GOLDEN GROUP. Все права защищены.",
        contact_addr: "Узбекистан, Бухара, Гиждуван, Алпомиш 1",
        about_ssl: "Мы также предоставляем различные типы SSL-сертификатов для обеспечения высочайшего уровня безопасности ваших веб-сайтов и цифровой инфраструктуры.",
        products_title: "Наши <span>Премиум Продукты</span>", btn_buy: "Купить Сейчас", btn_inquire: "Узнать цену", price_contact: "Запросить цену",
        per_mo: "/мес", per_yr: "/год", per_once: "/единоразово",
        lbl_monthly: "Ежемесячно", lbl_yearly: "Ежегодно", lbl_save_up_to: "Скидка до 20%",
        mdl_checkout: "Оформление заказа", lbl_name: "Имя держателя карты", ph_john: "Иван Иванов", lbl_card: "Номер карты", lbl_expiry: "Срок действия", lbl_cvv: "CVV", btn_pay: "Оплатить",
        lbl_addr: "Адрес доставки", ph_addr: "Ваш полный адрес", msg_cart_empty: "Ваша корзина пуста!",
        msg_processing: "Обработка платежа...", msg_success: "Платеж успешен! Спасибо за покупку.",
        msg_invalid_card: "Неверный номер карты!", msg_sent: "Сообщение отправлено! Мы скоро свяжемся с вами.",
        lbl_total: "Итого", lbl_product: "Продукт:",
        lbl_order_summary: "Детали заказа", lbl_subtotal: "Сумма", lbl_tax: "Налог (0%)",
        lbl_secure: "Безопасная оплата", lbl_guarantee: "Гарантия возврата",
        step_1: "1. Информация о доставке", step_2: "2. Метод оплаты",
        alert_congrats: "Поздравляем! Вы успешно приобрели продукт.",
        msg_error_generic: "Ошибка оформления заказа. Попробуйте еще раз.",
        lbl_zoom_email: "Email аккаунта Zoom",
        prod_m365: "Microsoft 365 Бизнес", prod_m365_f1: "Полный пакет Office и Teams", prod_m365_f2: "1ТБ Облачного хранилища", prod_m365_f3: "Улучшенная безопасность",
        prod_zoom_pro: "Zoom Workplace Про", prod_zoom_pro_f1: "До 100 участников", prod_zoom_pro_f2: "Неограниченное количество досок", prod_zoom_pro_f3: "AI Companion включен",
        prod_zoom_large: "Большие собрания (Large Meetings)", prod_zoom_large_f1: "До 500 участников", prod_zoom_large_f2: "Возможности брендинга", prod_zoom_large_f3: "Расширенная регистрация",
        prod_win11: "Windows 11 Профессиональная", prod_win11_f1: "Для малого и среднего бизнеса", prod_win11_f2: "Безопасность корпоративного уровня", prod_win11_f3: "Удаленный рабочий стол включен",
        prod_zoom: "Zoom Workplace Бизнес Плюс", prod_zoom_f1: "До 300 участников", prod_zoom_f2: "Неограниченное количество досок", prod_zoom_f3: "Zoom Phone включен",
        prod_kasp: "Kaspersky Plus", prod_kasp_f1: "Улучшенная защита от вредоносных программ", prod_kasp_f2: "Безлимитный VPN включен", prod_kasp_f3: "Функции Safe Money",
        prod_eset: "ESET Home Security Premium", prod_eset_f1: "Легендарная антивирусная технология", prod_eset_f2: "Менеджер паролей включен", prod_eset_f3: "Шифрование данных",
        prod_any: "ANY.RUN Hunter", prod_any_f1: "Интерактивная песочница для ВПО", prod_any_f2: "Анализ сетевого трафика", prod_any_f3: "Отслеживание поведения процессов",
        prod_stata: "Stata/MP (2-ядра)", prod_stata_f1: "Самая быстрая версия Stata", prod_stata_f2: "Поддержка параллельных вычислений", prod_stata_f3: "Для больших наборов данных",
        prod_rstudio: "R-Studio Standard", prod_rstudio_f1: "Расширенное восстановление данных", prod_rstudio_f2: "Поддержка FAT/NTFS/HFS+", prod_rstudio_f3: "Восстановление RAID включено",
        per_mo: "/мес", per_yr: "/год", per_once: "/единоразово",
        bot_name: "Национальный помощник", bot_status: "В сети", bot_greeting: "Здравствуйте! Я ваш помощник National Golden Group. Чем я могу вам помочь сегодня?",
        chat_ph: "Введите сообщение...", bot_typing: "Печатает...", bot_response_default: "Спасибо за ваше сообщение! Наша команда свяжется с вами в ближайшее время. Вы можете спросить о наших продуктах, услугах или ценах.",
        faq_ngg: "National Golden Group (NGG) — ведущий ИТ-дистрибьютор и поставщик решений. Мы специализируемся на кибербезопасности, облачной инфраструктуре и лицензировании ПО.",
        faq_services: "Мы предлагаем услуги кибербезопасности, облачных решений и сетевых решений. О чем бы вы хотели узнать подробнее?",
        faq_price: "Для получения подробной информации о ценах на наши корпоративные решения, пожалуйста, свяжитесь с отделом продаж по адресу info.nationalgoldengroup@gmail.com или позвоните нам.",
        faq_payment: "Мы поддерживаем различные способы оплаты, включая банковские переводы и основные кредитные карты для наших продуктов.",
        faq_buy: "Чтобы купить, вы можете использовать кнопки 'Купить сейчас' на странице наших продуктов или связаться с нами напрямую для получения пакетных лицензий.",
        faq_title: "Часто Задаваемые <span>Вопросы</span>",
        faq_q1: "Какие услуги предоставляет National Golden Group?",
        faq_a1: "Мы специализируемся на кибербезопасности, облачной инфраструктуре и сетевых решениях. Мы также предоставляем лицензирование программного обеспечения для таких брендов, как Microsoft, Zoom, Kaspersky и ESET.",
        faq_q2: "Где находится ваш офис?",
        faq_a2: "Наш офис находится по адресу: Узбекистан, Бухара, Гиждуван, Алпомиш 1. Мы всегда рады вашему визиту!",
        faq_q3: "Предоставляете ли вы SSL-сертификаты?",
        faq_a3: "Да, мы предоставляем различные типы SSL-сертификатов для обеспечения высочайшего уровня безопасности ваших веб-сайтов и цифровой инфраструктуры.",
        faq_q4: "Как я могу связаться с отделом продаж?",
        faq_a4: "Вы можете связаться с нашим отделом продаж по электронной почте info.nationalgoldengroup@gmail.com или по телефонам +998 91 828 22 08 / +998 91 780 00 35.",
        testi_title: "Отзывы <span>Клиентов</span>",
        testi_q1: "National Golden Group преобразила нашу ИТ-инфраструктуру. Их решения в области кибербезопасности первоклассны и надежны.",
        testi_a1: "Азизбек Гофуров", testi_p1: "ИТ-директор, TechMind",
        testi_q2: "Облачная миграция прошла безупречно. Очень рекомендую их профессиональную команду для любого ИТ-проекта.",
        testi_a2: "Елена Смирнова", testi_p2: "Генеральный директор, Global Solutions",
        testi_q3: "Профессиональный сервис и отличная поддержка. Они наш основной партнер по всем вопросам лицензирования ПО.",
        testi_a3: "Умар Шодиев", testi_p3: "Менеджер по закупкам, Innovate Uz",
        how_title: "Как это <span>Работает</span>",
        how_step1_t: "Выбор и Заказ", how_step1_d: "Выберите цифровой продукт или подписку и перейдите к безопасной оплате.",
        how_step2_t: "Доставка Лицензии", how_step2_d: "Для Zoom: Мы привязываем лицензию к вашему email. Для других: Вы получаете ключ на почту.",
        how_step3_t: "Мгновенная Активация", how_step3_d: "Начните использовать премиум-функции сразу при поддержке наших специалистов.",
        cookie_msg: "Мы используем файлы cookie для улучшения вашей работы. Продолжая посещать этот сайт, вы соглашаетесь на использование нами файлов cookie.",
        btn_accept: "Принять"
    },
    uz: {
        nav_home: "Bosh sahifa", nav_about: "Biz haqimizda", nav_services: "Xizmatlar", nav_products: "Mahsulotlar", nav_contact: "Aloqa",
        hero_title: "Raqamli <span>Yechimlarda</span> Mukammallik",
        hero_desc: "NATIONAL GOLDEN GROUP biznesingiz o'sishi uchun yuqori darajadagi IT infratuzilmasi, kiberxavfsizlik va bulutli xizmatlarni taqdim etadi.",
        btn_services: "Xizmatlarimiz", btn_contact: "Biz bilan bog'lanish",
        about_title: "Biz <span>haqimizda</span>",
        about_desc1: "NATIONAL GOLDEN GROUP - bu yetakchi Value Added Distributor va IT yechimlar provayderi. Sohadagi eng yaxshilardan ilhomlanib, biz mahalliy va mintaqaviy bozorlarga yuqori darajadagi texnologiyalarni olib kiramiz.",
        about_desc2: "Biz Zoom, Microsoft, Kaspersky, Eset, ANY.RUN, STATA va boshqa ko'plab jahon miqyosidagi brendlarning rasmiy hamkori va distribyutorimiz.",
        about_desc3: "Bizning maqsadimiz - innovatsiyalarga turtki beruvchi xavfsiz, kengaytiriladigan va samarali IT ekotizimlari bilan bizneslarni qo'llab-quvvatlash.",
        stat_years: "Yillik Tajriba", stat_clients: "Mijozlar", stat_vendors: "Global Vendorlar",
        services_title: "Asosiy <span>Xizmatlarimiz</span>",
        svc_cyber_title: "Kiberxavfsizlik", svc_cyber_desc: "Raqamli aktivlaringizni rivojlanayotgan tahdidlardan zamonaviy himoya qilish.",
        svc_cloud_title: "Bulutli Infratuzilma", svc_cloud_desc: "Biznes moslashuvchanligi va unumdorligini oshiruvchi bulutli yechimlar.",
        svc_net_title: "Tarmoq Yechimlari", svc_net_desc: "Uzluksiz aloqa uchun mustahkam tarmoq infratuzilmasi.",
        vendors_title: "Bizning <span>Premium Hamkorlarimiz</span>",
        vnd_zoom: "Rasmiy Hamkor", vnd_ms: "Vakolatli Sotuvchi", vnd_kasp: "Xavfsizlik bo'yicha hamkor", vnd_eset: "Oltin Hamkor", vnd_any: "Xavfsizlik bo'yicha hamkor", vnd_stata: "Rasmiy Distribyutor",
        vendors_footer: "va 50 dan ortiq boshqa jahon miqyosidagi IT brendlar...",
        contact_title: "Biz bilan <span>Bog'lanish</span>",
        ph_name: "Ism", ph_email: "Email", ph_msg: "Xabaringiz", btn_send: "Xabarni Yuborish",
        select_lang: "Tilni tanlang", footer_copy: "© 2026 NATIONAL GOLDEN GROUP. Barcha huquqlar himoyalangan.",
        contact_addr: "O'zbekiston, Buxoro, G'ijduvon, Alpomish 1",
        about_ssl: "Biz shuningdek veb-saytlaringiz va raqamli infratuzilmangiz uchun eng yuqori darajadagi xavfsizlikni ta'minlash uchun turli xildagi SSL sertifikatlarini ham taqdim etamiz.",
        products_title: "Bizning <span>Premium Mahsulotlarimiz</span>", btn_buy: "Sotib olish", btn_inquire: "Narxini bilish", price_contact: "Narxi so'rov bo'yicha",
        per_mo: "/oy", per_yr: "/yil",
        lbl_monthly: "Oylik", lbl_yearly: "Yillik", lbl_save_up_to: "20% gacha tejash",
        mdl_checkout: "To'lovni rasmiylashtirish", lbl_name: "Karta egasining ismi", ph_john: "Ali Valiyev", lbl_card: "Karta raqami", lbl_expiry: "Amal qilish muddati", lbl_cvv: "CVV", btn_pay: "To'lash",
        lbl_addr: "Yetkazib berish manzili", ph_addr: "To'liq manzilingiz", msg_cart_empty: "Savat bo'sh!",
        msg_processing: "To'lov amalga oshirilmoqda...", msg_success: "To'lov muvaffaqiyatli! Xaridingiz uchun rahmat.",
        msg_invalid_card: "Karta raqami noto'g'ri!", msg_sent: "Xabar yuborildi! Tez orada siz bilan bog'lanamiz.",
        lbl_total: "Jami", lbl_product: "Mahsulot:",
        lbl_order_summary: "Buyurtma tafsilotlari", lbl_subtotal: "Summa", lbl_tax: "Soliq (0%)",
        lbl_secure: "Xavfsiz to'lov", lbl_guarantee: "Qaytarish kafolati",
        step_1: "1. Yetkazib berish ma'lumotlari", step_2: "2. To'lov usuli",
        alert_congrats: "Tabriklaymiz! Siz mahsulotni muvaffaqiyatli sotib oldingiz.",
        msg_error_generic: "Xaridni amalga oshirishda xatolik yuz berdi. Qayta urinib ko'ring.",
        lbl_zoom_email: "Zoom akkaunt emaili",
        prod_m365: "Microsoft 365 Biznes", prod_m365_f1: "To'liq Office va Teams paketi", prod_m365_f2: "1TB Bulutli xotira", prod_m365_f3: "Kengaytirilgan xavfsizlik",
        prod_zoom_pro: "Zoom Workplace Pro", prod_zoom_pro_f1: "100 ishtirokchigacha", prod_zoom_pro_f2: "Cheksiz whiteboardlar", prod_zoom_pro_f3: "AI Companion ichida",
        prod_zoom_large: "Large Meetings (Katta yig'ilishlar)", prod_zoom_large_f1: "500 ishtirokchigacha", prod_zoom_large_f2: "Brending imkoniyatlari", prod_zoom_large_f3: "Kengaytirilgan ro'yxatga olish",
        prod_win11: "Windows 11 Professional", prod_win11_f1: "Kichik va o'rta biznes uchun", prod_win11_f2: "Korporativ darajadagi xavfsizlik", prod_win11_f3: "Masofaviy ish stoli yoqilgan",
        prod_zoom: "Zoom Workplace Biznes Plyus", prod_zoom_f1: "300 ishtirokchigacha", prod_zoom_f2: "Cheksiz whiteboardlar", prod_zoom_f3: "Zoom Phone ichida",
        prod_kasp: "Kaspersky Plus", prod_kasp_f1: "Kengaytirilgan virusdan himoya", prod_kasp_f2: "Cheksiz VPN ichida", prod_kasp_f3: "Safe Money funksiyalari",
        prod_eset: "ESET Home Security Premium", prod_eset_f1: "Legendary Antivirus texnologiyasi", prod_eset_f2: "Password Manager ichida", prod_eset_f3: "Xavfsiz ma'lumotlarni shifrlash",
        prod_any: "ANY.RUN Hunter", prod_any_f1: "Interaktiv zararli dasturlar sandboxi", prod_any_f2: "Tarmoq trafigi tahlili", prod_any_f3: "Jarayonlarning xatti-harakatlarini kuzatish",
        prod_stata: "Stata/MP (2-yadro)", prod_stata_f1: "Stata-ning eng tezkor versiyasi", prod_stata_f2: "Parallel hisoblashni qo'llab-quvvatlash", prod_stata_f3: "Katta ma'lumotlar to'plami uchun",
        prod_rstudio: "R-Studio Standard", prod_rstudio_f1: "Kengaytirilgan ma'lumotlarni tiklash", prod_rstudio_f2: "FAT/NTFS/HFS+ qo'llab-quvvatlash", prod_rstudio_f3: "RAID tiklash ichida",
        per_mo: "/oy", per_yr: "/yil", per_once: "/bir marta",
        bot_name: "National yordamchi", bot_status: "Onlayn", bot_greeting: "Assalomu alaykum! Men National Golden Group yordamchisiman. Bugun sizga qanday yordam bera olaman?",
        chat_ph: "Xabaringizni yozing...", bot_typing: "Yozmoqda...", bot_response_default: "Xabaringiz uchun rahmat! Bizning jamoamiz tez orada siz bilan bog'lanadi. Bizning mahsulotlar, xizmatlar yoki narxlar haqida so'rashingiz mumkin.",
        faq_ngg: "National Golden Group (NGG) - yetakchi IT distribyutor va yechimlar provayderi. Biz kiberxavfsizlik, bulutli infratuzilma va dasturiy ta'minot litsenziyalashga ixtisoslashganmiz.",
        faq_services: "Biz kiberxavfsizlik, bulutli yechimlar va tarmoq yechimlari xizmatlarini taklif qilamiz. Qaysi biri haqida ko'proq bilishni xohlaysiz?",
        faq_price: "Korporativ yechimlarimiz narxlari haqida batafsil ma'lumot olish uchun info.nationalgoldengroup@gmail.com manziliga yozing yoki ofisimizga qo'ng'iroq qiling.",
        faq_payment: "Biz bank o'tkazmalari va mahsulotlarimiz uchun asosiy kredit kartalarini o'z ichiga olgan turli xil to'lov usullarini qo'llab-quvvatlaymiz.",
        faq_buy: "Sotib olish uchun mahsulotlarimiz sahifasidagi 'Sotib olish' tugmalaridan foydalanishingiz yoki litsenziyalar uchun biz bilan bevosita bog'lanishingiz mumkin.",
        faq_title: "Ko'p beriladigan <span>savollar</span>",
        faq_q1: "National Golden Group qanday xizmatlarni taqdim etadi?",
        faq_a1: "Biz Kiberxavfsizlik, Bulutli infratuzilma va Tarmoq yechimlariga ixtisoslashganmiz. Shuningdek, Microsoft, Zoom, Kaspersky va ESET kabi yirik brendlar uchun dasturiy ta'minot litsenziyalashni ham taqdim etamiz.",
        faq_q2: "Sizning ofisingiz qayerda joylashgan?",
        faq_a2: "Bizning ofisimiz O'zbekiston, Buxoro, G'ijduvon, Alpomish 1 manzilida joylashgan. Tashrifingizdan mamnun bo'lamiz!",
        faq_q3: "SSL sertifikatlarini taqdim etasizmi?",
        faq_a3: "Ha, biz veb-saytlaringiz va raqamli infratuzilmangiz uchun eng yuqori darajadagi xavfsizlikni ta'minlash uchun turli xildagi SSL sertifikatlarini taqdim etamiz.",
        faq_q4: "Sotuvlar bo'limi bilan qanday bog'lanishim mumkin?",
        faq_a4: "Sotuvlar bo'limimiz bilan info.nationalgoldengroup@gmail.com elektron pochta manzili yoki +998 91 828 22 08 / +998 91 780 00 35 telefon raqamlari orqali bog'lanishingiz mumkin.",
        testi_title: "Mijozlarimiz <span>fikrlari</span>",
        testi_q1: "National Golden Group bizning IT infratuzilmamizni butunlay o'zgartirdi. Ularning kiberxavfsizlik yechimlari juda ishonchli.",
        testi_a1: "Azizbek G'ofurov", testi_p1: "IT direktor, TechMind",
        testi_q2: "Bulutli migratsiya juda oson va sifatli amalga oshirildi. Har qanday IT loyiha uchun ularning professional jamoasini tavsiya qilaman.",
        testi_a2: "Elena Smirnova", testi_p2: "Bosh direktor, Global Solutions",
        testi_q3: "Professional xizmat va ajoyib qo'llab-quvvatlash. Ular dasturiy ta'minot litsenziyalash bo'yicha bizning doimiy hamkorimiz.",
        testi_a3: "Umar Shodiyev", testi_p3: "Xaridlar bo'limi boshlig'i, Innovate Uz",
        cookie_msg: "Biz sizning tajribangizni yaxshilash uchun cookie-fayllardan foydalanamiz. Ushbu saytga tashrif buyurishni davom ettirish orqali siz bizning cookie-fayllardan foydalanishimizga rozilik bildirasiz.",
        btn_accept: "Qabul qilish"
    }
};

// Chatbot Logic
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', `${sender}-message`);
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChat = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        const currentLang = localStorage.getItem('selectedLang') || 'en';

        // Simulating "AI" thinking
        setTimeout(() => {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('message', 'bot-message', 'typing');
            typingDiv.innerHTML = `<p>${translations[currentLang].bot_typing}</p>`;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                chatMessages.removeChild(typingDiv);
                let response = translations[currentLang].bot_response_default;

                // Improved logic with FAQ categories
                const lowerText = text.toLowerCase();

                if (lowerText.includes('ngg') || lowerText.includes('who are you') || lowerText.includes('kim') || lowerText.includes('кто вы') || lowerText.includes('company')) {
                    response = translations[currentLang].faq_ngg;
                } else if (lowerText.includes('service') || lowerText.includes('xizmat') || lowerText.includes('услуг') || lowerText.includes('cloud') || lowerText.includes('cyber') || lowerText.includes('network')) {
                    response = translations[currentLang].faq_services;
                } else if (lowerText.includes('price') || lowerText.includes('narx') || lowerText.includes('цена') || lowerText.includes('cost')) {
                    response = translations[currentLang].faq_price;
                } else if (lowerText.includes('pay') || lowerText.includes('to\'lov') || lowerText.includes('оплат') || lowerText.includes('card') || lowerText.includes('karta')) {
                    response = translations[currentLang].faq_payment;
                } else if (lowerText.includes('buy') || lowerText.includes('sotib olish') || lowerText.includes('купить')) {
                    response = translations[currentLang].faq_buy;
                } else if (lowerText.includes('contact') || lowerText.includes('aloqa') || lowerText.includes('номер') || lowerText.includes('phone') || lowerText.includes('location') || lowerText.includes('manzil') || lowerText.includes('адрес')) {
                    response = currentLang === 'uz' ? "Biz bilan +998 91 828 22 08 yoki +998 91 780 00 35 orqali bog'lanishingiz mumkin. Manzil: Buxoro, G'ijduvon, Alpomish 1." :
                        (currentLang === 'ru' ? "Свяжитесь с нами: +998 91 828 22 08 / +998 91 780 00 35. Адрес: Бухара, Гиждуван, Алпомиш 1." :
                            "Contact us: +998 91 828 22 08 or +998 91 780 00 35. Address: Bukhara, Gijduvan, Alpomish 1.");
                } else if (lowerText.includes('ssl') || lowerText.includes('certificate') || lowerText.includes('sertifikat') || lowerText.includes('сертификат')) {
                    response = translations[currentLang].about_ssl;
                } else if (lowerText.includes('zoom') || lowerText.includes('microsoft') || lowerText.includes('kaspersky') || lowerText.includes('eset')) {
                    response = currentLang === 'uz' ? "Mahsulotlar bo'limida barcha tafsilotlarni topishingiz mumkin." :
                        (currentLang === 'ru' ? "Вы можете найти все подробности в разделе продуктов." :
                            "You can find all details in the products section.");
                } else if (lowerText.includes('hello') || lowerText.includes('salom') || lowerText.includes('привет') || lowerText.includes('hayr') || lowerText.includes('bye')) {
                    response = translations[currentLang].bot_greeting;
                }

                addMessage(response, 'bot');
            }, 1500);
        }, 500);
    };

    if (chatSend) {
        chatSend.addEventListener('click', handleChat);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // Falling Snow Animation
    const canvas = document.getElementById('snow-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initSnow() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 3 + 1,
                    d: Math.random() * 150,
                    v: Math.random() * 1 + 0.5
                });
            }
        }

        function drawSnow() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            }
            ctx.fill();
            moveSnow();
        }

        function moveSnow() {
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.y += p.v;
                p.x += Math.sin(p.d) * 0.5;
                if (p.y > height) {
                    particles[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d, v: p.v };
                }
            }
        }

        function update() {
            drawSnow();
            requestAnimationFrame(update);
        }

        window.addEventListener('resize', initSnow);
        initSnow();
        update();
    }
});
