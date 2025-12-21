        // ============================================
        // GLOBAL CONFIGURATION
        // ============================================
        // Check if user prefers reduced motion (moved to top to avoid initialization errors)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ============================================
        // PAGE LOADING
        // ============================================
        window.addEventListener('load', () => {
            const loadingScreen = document.getElementById('loading-screen');
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        });

        // Initialize AOS
        AOS.init({
            duration: 800,
            once: false,
            offset: 100
        });

        // ============================================
        // SCROLL-TRIGGERED ANIMATION SYSTEM
        // ============================================

        // Optimized IntersectionObserver configs for better performance
        const observerConfigs = {
            default: { threshold: 0.1, rootMargin: '50px' },
            high: { threshold: 0.3, rootMargin: '100px' },
            low: { threshold: 0.05, rootMargin: '20px' }
        };
        
        // Animation observer for entrance animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    // Add will-animate class for performance
                    target.classList.add('will-animate');
                    
                    // Trigger animation based on data attribute
                    const animationType = target.dataset.animate;
                    if (animationType && !prefersReducedMotion) {
                        setTimeout(() => {
                            target.classList.add(`animate-${animationType}`);
                            
                            // Remove will-change after animation
                            setTimeout(() => {
                                target.classList.remove('will-animate');
                                target.classList.add('animated');
                            }, 1000);
                        }, parseInt(target.dataset.delay) || 0);
                    }
                    
                    // Unobserve after animation (once per view)
                    if (target.dataset.once !== 'false') {
                        animationObserver.unobserve(target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });

        // Observe all elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });

        // ============================================
        // TYPING EFFECT
        // ============================================
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.textContent = '';
            
            // Add cursor
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);
            
            function type() {
                if (i < text.length) {
                    element.textContent = text.substring(0, i + 1);
                    element.appendChild(cursor);
                    i++;
                    setTimeout(type, speed);
                } else {
                    // Remove cursor after typing
                    setTimeout(() => {
                        cursor.remove();
                    }, 2000);
                }
            }
            
            if (!prefersReducedMotion) {
                type();
            } else {
                element.textContent = text;
            }
        }

        // Apply typing effect to elements with data-type attribute
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.dataset.type || target.textContent;
                    const speed = parseInt(target.dataset.typeSpeed) || 50;
                    
                    setTimeout(() => {
                        typeWriter(target, text, speed);
                    }, parseInt(target.dataset.delay) || 0);
                    
                    typingObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-type]').forEach(el => {
            typingObserver.observe(el);
        });

        // ============================================
        // ENHANCED NUMBER COUNTER
        // ============================================
        function animateNumber(element, start, end, duration = 2000) {
            const range = end - start;
            const increment = range / (duration / 16);
            let current = start;
            
            const updateNumber = () => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    element.textContent = Math.round(end).toLocaleString('tr-TR');
                    element.classList.add('animate-count');
                } else {
                    element.textContent = Math.round(current).toLocaleString('tr-TR');
                    requestAnimationFrame(updateNumber);
                }
            };
            
            if (!prefersReducedMotion) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = Math.round(end).toLocaleString('tr-TR');
            }
        }

        // Apply number counter to stat numbers
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = parseInt(target.dataset.count);
                    const duration = parseInt(target.dataset.duration) || 2000;
                    
                    setTimeout(() => {
                        animateNumber(target, 0, endValue, duration);
                    }, parseInt(target.dataset.delay) || 0);
                    
                    numberObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-count]').forEach(el => {
            numberObserver.observe(el);
        });

        // ============================================
        // STAGGER ANIMATION
        // ============================================
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    const items = container.querySelectorAll('[data-stagger]');
                    
                    items.forEach((item, index) => {
                        const delay = parseInt(container.dataset.staggerDelay) || 100;
                        item.style.animationDelay = `${index * delay}ms`;
                        item.classList.add('animate-fade-up');
                    });
                    
                    staggerObserver.unobserve(container);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-stagger-container]').forEach(el => {
            staggerObserver.observe(el);
        });

        // ============================================
        // SCROLL-BASED OPACITY AND TRANSFORM
        // ============================================
        function updateScrollEffects() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Fade on scroll elements
            document.querySelectorAll('.fade-on-scroll').forEach(el => {
                const rect = el.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const distanceFromCenter = Math.abs(windowHeight / 2 - elementCenter);
                const maxDistance = windowHeight / 2;
                const opacity = 1 - (distanceFromCenter / maxDistance) * 0.5;
                
                el.style.opacity = Math.max(0.3, Math.min(1, opacity));
            });
            
            // Transform scale on scroll
            document.querySelectorAll('[data-scroll-scale]').forEach(el => {
                const rect = el.getBoundingClientRect();
                const scrollProgress = (windowHeight - rect.top) / windowHeight;
                const scale = 0.8 + (scrollProgress * 0.2);
                
                if (scrollProgress > 0 && scrollProgress < 1) {
                    el.style.transform = `scale(${Math.min(1, Math.max(0.8, scale))})`;
                }
            });
        }

        // Optimized unified scroll handler using requestAnimationFrame
        let scrollRafId = null;
        let lastScrollY = window.scrollY;
        let scrollUpdateCounter = 0;
        
        function unifiedScrollHandler() {
            if (scrollRafId === null) {
                scrollRafId = requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                    
                    // Only update if scroll position changed significantly (performance optimization)
                    if (scrollDelta > 1) {
                        // Update all scroll-dependent functions
                        if (!prefersReducedMotion) {
                            updateScrollEffects();
                            handleParallax();
                            handleSectionParallax();
                        }
                        
                        // Always update these (lightweight operations)
                        updateProgressBar();
                        updateSectionNavigation();
                        
                        lastScrollY = currentScrollY;
                        scrollUpdateCounter++;
                        
                        // Throttle heavy operations - only run every 3rd frame
                        if (scrollUpdateCounter % 3 === 0) {
                            // Heavy operations can be added here if needed
                        }
                    }
                    
                    scrollRafId = null;
                });
            }
        }
        
        // Single optimized scroll event listener with passive flag
        window.addEventListener('scroll', unifiedScrollHandler, { passive: true });

        // ============================================
        // PROGRESSIVE REVEAL
        // ============================================
        const progressiveRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const segments = target.querySelectorAll('[data-reveal]');
                    
                    segments.forEach((segment, index) => {
                        setTimeout(() => {
                            segment.style.opacity = '1';
                            segment.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                    
                    progressiveRevealObserver.unobserve(target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-reveal-container]').forEach(el => {
            // Prepare segments
            el.querySelectorAll('[data-reveal]').forEach(segment => {
                segment.style.opacity = '0';
                segment.style.transform = 'translateY(20px)';
                segment.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            progressiveRevealObserver.observe(el);
        });

        // ============================================
        // PULSE CTA BUTTONS
        // ============================================
        document.querySelectorAll('[data-pulse]').forEach(el => {
            if (!prefersReducedMotion) {
                el.classList.add('pulse-effect');
            }
        });

        // ============================================
        // PARTICLE SYSTEM
        // ============================================
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // ============================================
        // PARALLAX SCROLLING
        // ============================================
        // Parallax handler - integrated into unified scroll handler
        function handleParallax() {
            const parallaxElements = document.querySelectorAll('.parallax');
            if (parallaxElements.length === 0) return;
            
            const scrolled = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }

        // ============================================
        // 3D CARD TILT EFFECT
        // ============================================
        const cards3D = document.querySelectorAll('.card-3d');
        
        cards3D.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        // ============================================
        // PROGRESS BAR - integrated into unified scroll handler
        function updateProgressBar() {
            const progressBar = document.getElementById('progress-bar');
            if (!progressBar) return;
            
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }



        // Print styles are automatically applied via CSS @media print
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                #print-pdf-btn, #theme-toggle, #nav-menu, #particles-canvas {
                    display: none !important;
                }
                section {
                    page-break-inside: avoid;
                    page-break-after: always;
                }
                .glass-card {
                    box-shadow: none;
                    border: 1px solid #ddd;
                }
            }
        `;
        document.head.appendChild(style);

        // ============================================
        // SMOOTH SECTION TRANSITIONS
        // ============================================
        const sections = document.querySelectorAll('section');
        const navDots = document.querySelectorAll('.nav-dot');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    entry.target.classList.remove('section-entering');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '-50px'
        });

        sections.forEach(section => {
            section.classList.add('section-entering');
            sectionObserver.observe(section);
        });

        // ============================================
        // NAVIGATION DOTS
        // ============================================
        let isScrolling = false;

        // Section navigation - integrated into unified scroll handler
        function updateSectionNavigation() {
            if (isScrolling) return;
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-section') === current) {
                    dot.classList.add('active');
                }
            });
        }

        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                isScrolling = true;
                const sectionId = dot.getAttribute('data-section');
                const targetSection = document.getElementById(sectionId);
                
                // Update active class immediately on click
                navDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Smooth scroll with custom easing
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            });
        });

        // Keyboard navigation with arrow keys
        let keyboardNavigationEnabled = true;
        let lastKeyPressTime = 0;
        const KEYBOARD_DEBOUNCE = 500; // Prevent rapid key presses

        function navigateToSection(direction) {
            // Don't navigate if scrolling is in progress or debounce time hasn't passed
            if (isScrolling || Date.now() - lastKeyPressTime < KEYBOARD_DEBOUNCE) {
                return;
            }

            // Get all sections in order
            const sectionIds = Array.from(navDots).map(dot => dot.getAttribute('data-section'));
            const currentSectionId = sectionIds.find(id => {
                const section = document.getElementById(id);
                if (!section) return false;
                const rect = section.getBoundingClientRect();
                return rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3;
            }) || sectionIds[0];

            const currentIndex = sectionIds.indexOf(currentSectionId);
            let targetIndex;

            if (direction === 'next') {
                targetIndex = Math.min(currentIndex + 1, sectionIds.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }

            // Don't navigate if already at the boundary
            if (targetIndex === currentIndex) {
                return;
            }

            const targetSectionId = sectionIds[targetIndex];
            const targetSection = document.getElementById(targetSectionId);
            const targetDot = navDots[targetIndex];

            if (targetSection && targetDot) {
                isScrolling = true;
                lastKeyPressTime = Date.now();

                // Update active class immediately
                navDots.forEach(d => d.classList.remove('active'));
                targetDot.classList.add('active');

                // Smooth scroll to target section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }

        // Keyboard event listener
        document.addEventListener('keydown', (e) => {
            // Don't navigate if user is typing in an input field
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable
            );

            if (!keyboardNavigationEnabled || isInputFocused) {
                return;
            }

            // Handle arrow keys
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                navigateToSection('next');
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateToSection('prev');
            }
        });

        // Count Up Animation
        function animateCount(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, duration / steps);
        }

        // Intersection Observer for Count Animation
        const statNumbers = document.querySelectorAll('.stat-number');
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.textContent === '0') {
                    animateCount(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => statObserver.observe(stat));

        // ============================================
        // ANIMATED CHARTS
        // ============================================
        const chartColors = {
            primary: '#7c3aed',
            secondary: '#f97316',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#0ea5e9'
        };

        let chartsInitialized = false;
        const chartConfigs = {};

        // Custom animation configuration
        const chartAnimationConfig = {
            duration: 2000,
            easing: 'easeInOutQuart',
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                    delay = context.dataIndex * 100;
                }
                return delay;
            }
        };

        // ============================================
        // CUSTOM RICE CHART - Stacked Horizontal Bars
        // ============================================
        const riceData = [
            { name: 'Temel Operasyonel Raporlama', reach: 100, impact: 1.5, confidence: 100, effort: 1, total: 1500, winner: true },
            { name: 'Otomatik Sözleşme Üretimi', reach: 100, impact: 2, confidence: 100, effort: 2, total: 1000 },
            { name: 'Müşteri Tipine Göre Farklılaşan Kayıt', reach: 100, impact: 2, confidence: 100, effort: 2.5, total: 800 },
            { name: 'Temel Araç ve Sürücü Atama (Kurumsal)', reach: 60, impact: 2, confidence: 100, effort: 1.5, total: 800 },
            { name: 'Detaylı Ceza ve Hasar Yönetimi', reach: 100, impact: 3, confidence: 90, effort: 4, total: 675 },
            { name: 'Temel Risk Skorlaması (Bireysel)', reach: 80, impact: 3, confidence: 80, effort: 3, total: 640 },
            { name: 'Kredi Kartı Provizyon Kontrolü', reach: 80, impact: 2, confidence: 80, effort: 2, total: 640 },
            { name: 'Tek Panelde Bireysel ve Kurumsal Kiralama Yönetimi', reach: 100, impact: 3, confidence: 100, effort: 5, total: 600 },
            { name: 'Otomatik Fatura Planlama ve Takibi', reach: 70, impact: 2.5, confidence: 90, effort: 3, total: 525 },
            { name: 'Gelişmiş Raporlama Paneli', reach: 50, impact: 2, confidence: 80, effort: 4, total: 200 },
        ];

        function createRiceChart() {
            const container = document.getElementById('rice-chart-custom');
            if (!container) return;

            container.innerHTML = '';
            container.style.cssText = 'padding: 20px;';

            riceData.forEach((item, index) => {
                const row = document.createElement('div');
                row.style.cssText = 'margin-bottom: 35px; opacity: 0; animation: fadeInUp 0.6s ease forwards;';
                row.style.animationDelay = `${index * 0.15}s`;

                const label = document.createElement('div');
                label.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 600; font-size: 1rem;';
                label.innerHTML = `
                    <span>${item.name}</span>
                    <span style="color: ${item.winner ? '#10b981' : 'var(--accent-color)'}; font-size: 1.2rem;">
                        ${item.total} ${item.winner ? '🏆' : ''}
                    </span>
                `;

                const barContainer = document.createElement('div');
                barContainer.style.cssText = 'position: relative; height: 40px; background: rgba(0,0,0,0.2); border-radius: 20px; overflow: hidden;';

                const colors = {
                    reach: '#3b82f6',
                    impact: '#10b981',
                    confidence: '#f59e0b',
                    effort: '#ef4444'
                };

                const total = item.reach + item.impact * 10 + item.confidence;
                let currentPercent = 0;

                ['reach', 'impact', 'confidence'].forEach(key => {
                    const value = key === 'impact' ? item[key] * 10 : item[key];
                    const percent = (value / total) * 100;

                    const segment = document.createElement('div');
                    segment.style.cssText = `
                        position: absolute;
                        left: ${currentPercent}%;
                        width: 0%;
                        height: 100%;
                        background: ${colors[key]};
                        transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                        transition-delay: ${index * 0.1}s;
                    `;
                    
                    if (item.winner) {
                        segment.style.boxShadow = `0 0 20px ${colors[key]}`;
                    }

                    barContainer.appendChild(segment);

                    setTimeout(() => {
                        segment.style.width = `${percent}%`;
                    }, 100);

                    currentPercent += percent;
                });

                const legend = document.createElement('div');
                legend.style.cssText = 'display: flex; gap: 15px; margin-top: 8px; font-size: 0.85rem; opacity: 0.8;';
                legend.innerHTML = `
                    <span><span style="color: ${colors.reach};">●</span> Reach: ${item.reach}</span>
                    <span><span style="color: ${colors.impact};">●</span> Impact: ${item.impact}</span>
                    <span><span style="color: ${colors.confidence};">●</span> Confidence: ${item.confidence}%</span>
                    <span style="color: ${colors.effort};">Effort: ${item.effort}</span>
                `;

                row.appendChild(label);
                row.appendChild(barContainer);
                row.appendChild(legend);
                container.appendChild(row);
            });
        }

        // Observe when RICE section comes into view
        const riceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createRiceChart();
                    riceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const riceSection = document.getElementById('rice');
        if (riceSection) {
            riceObserver.observe(riceSection);
        }

        // ============================================
        // CUSTOM TIMELINE CHART
        // ============================================
        function createTimelineChart() {
            const container = document.getElementById('timeline-chart');
            if (!container) return;

            const milestones = [
                { name: 'Talep', current: 10, target: 3 },
                { name: 'Kontrol', current: 12, target: 2 },
                { name: 'Hesaplama', current: 8, target: 2 },
                { name: 'Onay', current: 10, target: 3 },
                { name: 'Teslim', current: 5, target: 2 }
            ];

            container.innerHTML = '';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '200');
            svg.setAttribute('viewBox', '0 0 800 200');

            const lineY = 100;
            const stepX = 800 / (milestones.length + 1);

            // Main timeline line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '50');
            line.setAttribute('y1', lineY);
            line.setAttribute('x2', '750');
            line.setAttribute('y2', lineY);
            line.setAttribute('stroke', '#7c3aed');
            line.setAttribute('stroke-width', '3');
            line.style.strokeDasharray = '750';
            line.style.strokeDashoffset = '750';
            line.style.animation = 'drawLine 2s ease forwards';
            svg.appendChild(line);

            milestones.forEach((milestone, index) => {
                const x = stepX * (index + 1);
                
                // Milestone circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', lineY);
                circle.setAttribute('r', '8');
                circle.setAttribute('fill', '#f97316');
                circle.style.opacity = '0';
                circle.style.animation = `fadeIn 0.5s ease forwards ${0.5 + index * 0.2}s`;
                svg.appendChild(circle);

                // Label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', lineY - 20);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', document.body.classList.contains('light-theme') ? '#000' : '#fff');
                text.setAttribute('font-size', '14');
                text.setAttribute('font-weight', 'bold');
                text.textContent = milestone.name;
                text.style.opacity = '0';
                text.style.animation = `fadeIn 0.5s ease forwards ${0.5 + index * 0.2}s`;
                svg.appendChild(text);

                // Current time (red)
                const currentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                currentText.setAttribute('x', x);
                currentText.setAttribute('y', lineY + 25);
                currentText.setAttribute('text-anchor', 'middle');
                currentText.setAttribute('fill', '#ef4444');
                currentText.setAttribute('font-size', '13');
                currentText.textContent = `${milestone.current}dk`;
                currentText.style.opacity = '0';
                currentText.style.animation = `fadeIn 0.5s ease forwards ${0.7 + index * 0.2}s`;
                svg.appendChild(currentText);

                // Target time (green)
                const targetText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                targetText.setAttribute('x', x);
                targetText.setAttribute('y', lineY + 40);
                targetText.setAttribute('text-anchor', 'middle');
                targetText.setAttribute('fill', '#10b981');
                targetText.setAttribute('font-size', '12');
                targetText.textContent = `↓ ${milestone.target}dk`;
                targetText.style.opacity = '0';
                targetText.style.animation = `fadeIn 0.5s ease forwards ${0.9 + index * 0.2}s`;
                svg.appendChild(targetText);
            });

            container.appendChild(svg);
        }

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createTimelineChart();
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const timelineSection = document.getElementById('metrics');
        if (timelineSection) {
            timelineObserver.observe(timelineSection);
        }

        // SVG Animation styles
        const svgStyle = document.createElement('style');
        svgStyle.textContent = `
            @keyframes drawLine {
                to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(svgStyle);

        // Cost Chart
        const costCtx = document.getElementById('costChart');
        if (costCtx) {
            new Chart(costCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Manuel İşlem', 'Hatalar', 'Tekrar İşler', 'Bekleme'],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: [
                            chartColors.danger,
                            chartColors.warning,
                            chartColors.secondary,
                            chartColors.info
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            position: 'bottom',
                            labels: { color: document.body.classList.contains('light-theme') ? '#000' : '#fff' }
                        }
                    }
                }
            });
        }

        // ============================================
        // CUSTOM GAUGE CHART
        // ============================================
        function createGaugeChart() {
            const container = document.getElementById('gauge-chart');
            if (!container) return;

            const errorRate = 12; // percentage
            const maxRate = 15;

            container.innerHTML = '';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '250');
            svg.setAttribute('viewBox', '0 0 300 200');

            const centerX = 150;
            const centerY = 150;
            const radius = 100;

            // Background arc
            const bgPath = describeArc(centerX, centerY, radius, -135, 135);
            const bgArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            bgArc.setAttribute('d', bgPath);
            bgArc.setAttribute('fill', 'none');
            bgArc.setAttribute('stroke', 'rgba(255,255,255,0.1)');
            bgArc.setAttribute('stroke-width', '20');
            bgArc.setAttribute('stroke-linecap', 'round');
            svg.appendChild(bgArc);

            // Colored zones
            const zones = [
                { start: -135, end: -45, color: '#10b981' }, // Green
                { start: -45, end: 45, color: '#f59e0b' },   // Yellow
                { start: 45, end: 135, color: '#ef4444' }    // Red
            ];

            zones.forEach(zone => {
                const zonePath = describeArc(centerX, centerY, radius, zone.start, zone.end);
                const zoneArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                zoneArc.setAttribute('d', zonePath);
                zoneArc.setAttribute('fill', 'none');
                zoneArc.setAttribute('stroke', zone.color);
                zoneArc.setAttribute('stroke-width', '20');
                zoneArc.setAttribute('stroke-linecap', 'round');
                zoneArc.setAttribute('opacity', '0.3');
                svg.appendChild(zoneArc);
            });

            // Value arc (animated)
            const angle = -135 + (errorRate / maxRate) * 270;
            const valuePath = describeArc(centerX, centerY, radius, -135, angle);
            const valueArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            valueArc.setAttribute('d', valuePath);
            valueArc.setAttribute('fill', 'none');
            valueArc.setAttribute('stroke', errorRate > 10 ? '#ef4444' : errorRate > 5 ? '#f59e0b' : '#10b981');
            valueArc.setAttribute('stroke-width', '20');
            valueArc.setAttribute('stroke-linecap', 'round');
            
            const pathLength = valueArc.getTotalLength();
            valueArc.style.strokeDasharray = pathLength;
            valueArc.style.strokeDashoffset = pathLength;
            valueArc.style.animation = 'drawGauge 2s ease forwards 0.5s';
            svg.appendChild(valueArc);

            // Center text
            const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueText.setAttribute('x', centerX);
            valueText.setAttribute('y', centerY - 10);
            valueText.setAttribute('text-anchor', 'middle');
            valueText.setAttribute('fill', document.body.classList.contains('light-theme') ? '#000' : '#fff');
            valueText.setAttribute('font-size', '40');
            valueText.setAttribute('font-weight', 'bold');
            valueText.textContent = errorRate + '%';
            valueText.style.opacity = '0';
            valueText.style.animation = 'fadeIn 0.5s ease forwards 2s';
            svg.appendChild(valueText);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', centerX);
            label.setAttribute('y', centerY + 15);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', document.body.classList.contains('light-theme') ? '#666' : '#999');
            label.setAttribute('font-size', '14');
            label.textContent = 'Hata Oranı';
            label.style.opacity = '0';
            label.style.animation = 'fadeIn 0.5s ease forwards 2.2s';
            svg.appendChild(label);

            container.appendChild(svg);
        }

        function describeArc(x, y, radius, startAngle, endAngle) {
            const start = polarToCartesian(x, y, radius, endAngle);
            const end = polarToCartesian(x, y, radius, startAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
            return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
        }

        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        }

        const gaugeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createGaugeChart();
                    gaugeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const gaugeSection = document.getElementById('metrics');
        if (gaugeSection) {
            gaugeObserver.observe(gaugeSection);
        }

        const gaugeStyle = document.createElement('style');
        gaugeStyle.textContent = `
            @keyframes drawGauge {
                to { stroke-dashoffset: 0; }
            }
        `;
        document.head.appendChild(gaugeStyle);

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            const currentSection = document.querySelector('section:hover') || 
                                 Array.from(sections).find(section => {
                                     const rect = section.getBoundingClientRect();
                                     return rect.top <= 100 && rect.bottom >= 100;
                                 });
            
            if (!currentSection) return;
            
            const currentIndex = Array.from(sections).indexOf(currentSection);
            
            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Lazy Load Images (if any added)
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
        }

        // Performance Optimization: Debounce scroll events
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Smooth Reveal on Scroll for Cards
        const revealElements = document.querySelectorAll('.glass-card, .improvement-card');
        const cardRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardRevealObserver.observe(el);
        });

        // ============================================
        // INTERACTIVE FISHBONE DIAGRAM
        // ============================================
        const fishboneData = {
            '📈 Pazar ve Rekabet': {
                color: '#3b82f6',
                items: ['Alt Neden: Genel filo yönetimi pazarının doygunluğa ulaşması ve büyüme hızının yavaşlaması.',
                'Alt Neden: Arvento gibi pazar liderlerinin yarattığı yoğun fiyat rekabeti ve baskı.']
            },
            '📦 Ürün ve Teknoloji': {
                color: '#10b981',
                items: ['Alt Neden: Mevcut ürünün "genelleyici" olması ve niş sektörlerin derinlemesine operasyonel ihtiyaçlarını karşılayamaması.',
                'Alt Neden: Platformun, temel bir "takip aracı" olmanın ötesine geçip stratejik bir "işletme aracına" dönüşememesi.']
            },
            '📱 Pazarlama ve Satış': {
                color: '#8b5cf6',
                items: ['Alt Neden: Pazarlama ve satış eforunun sürekli olarak aynı ve artık doymuş olan müşteri segmentine odaklanması.',
                'Alt Neden: Marka konumlandırmasının "araç takip firması" ile sınırlı kalması ve "sektörel çözüm ortağı" olarak algılanmaması.']
            },
            '👥 Müşteriler': {
                color: '#f59e0b',
                items: ['Alt Neden: Araç kiralama gibi sektörlerin, genel filo yönetiminden çok daha farklı ve karmaşık operasyonel ihtiyaçlara sahip olması.',
                'Alt Neden: Potansiyel müşteri havuzunda, mevcut ürünle hizmet verilemeyen ancak yüksek potansiyel taşıyan segmentlerin (kiralama firmaları) gözden kaçırılması.',
                'Alt Neden: Müşterilerin, kendi iş akışlarına özel çözümlere daha fazla değer vermesi ve daha fazla ödeme yapmaya istekli olması.']
            },
            '🎯 Strateji ve Yönetim': {
                color: '#06b6d4',
                items: ['Alt Neden: Büyüme stratejisinin, pazardaki dikey ve daha kârlı nişlere derinleşmek yerine, yatayda "daha fazla benzer müşteri bulmaya" odaklanması.',  
                'Alt Neden: Mevcut teknolojik gücü ve marka bilinirliğini kullanarak yeni bir pazara girmenin, sıfırdan bir iş kurmaktan daha yönetilebilir bir risk olması.',
                'Alt Neden: Şirketin kendi kaynaklarıyla, dış yatırım gerektirmeden yeni bir gelir kapısı yaratma (organik büyüme) fırsatının yeterince değerlendirilmemesi.']
            }
        };

        function createFishboneDiagram() {
            const container = document.getElementById('fishbone-svg-container');
            if (!container) return;

            container.innerHTML = '';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '600');
            svg.setAttribute('viewBox', '0 0 1200 600');

            // Main spine
            const spine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            spine.setAttribute('x1', '100');
            spine.setAttribute('y1', '300');
            spine.setAttribute('x2', '1100');
            spine.setAttribute('y2', '300');
            spine.setAttribute('stroke', '#7c3aed');
            spine.setAttribute('stroke-width', '4');
            spine.style.strokeDasharray = '1000';
            spine.style.strokeDashoffset = '1000';
            spine.style.animation = 'drawLine 2s ease forwards';
            svg.appendChild(spine);

            // Problem head (arrow)
            const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            arrowHead.setAttribute('points', '1100,300 1080,285 1080,315');
            arrowHead.setAttribute('fill', '#f97316');
            arrowHead.style.opacity = '0';
            arrowHead.style.animation = 'fadeIn 0.5s ease forwards 2s';
            svg.appendChild(arrowHead);

            // Problem text
            const problemText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            problemText.setAttribute('x', '1100');
            problemText.setAttribute('y', '260');
            problemText.setAttribute('text-anchor', 'end');
            problemText.setAttribute('fill', '#f97316');
            problemText.setAttribute('font-size', '16');
            problemText.setAttribute('font-weight', 'bold');
            problemText.textContent = 'Problem';
            problemText.style.opacity = '0';
            problemText.style.animation = 'fadeIn 0.5s ease forwards 2.2s';
            svg.appendChild(problemText);

            const categories = Object.keys(fishboneData);
            const spacing = 900 / categories.length;

            categories.forEach((category, index) => {
                const isTop = index % 2 === 0;
                const x = 200 + index * spacing;
                const y = isTop ? 150 : 450;
                const data = fishboneData[category];

                // Branch line
                const branch = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                branch.setAttribute('x1', x);
                branch.setAttribute('y1', 300);
                branch.setAttribute('x2', x);
                branch.setAttribute('y2', y);
                branch.setAttribute('stroke', data.color);
                branch.setAttribute('stroke-width', '3');
                branch.style.strokeDasharray = '200';
                branch.style.strokeDashoffset = '200';
                branch.style.animation = `drawLine 1s ease forwards ${0.5 + index * 0.2}s`;
                branch.style.cursor = 'pointer';
                branch.setAttribute('data-category', category);
                svg.appendChild(branch);

                // Category circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', '40');
                circle.setAttribute('fill', data.color);
                circle.setAttribute('opacity', '0.8');
                circle.style.cursor = 'pointer';
                circle.style.transition = 'all 0.3s ease';
                circle.setAttribute('data-category', category);
                circle.style.animation = `fadeIn 0.5s ease forwards ${1 + index * 0.2}s`;
                
                circle.addEventListener('mouseenter', function() {
                    this.setAttribute('r', '45');
                    this.setAttribute('opacity', '1');
                });
                circle.addEventListener('mouseleave', function() {
                    this.setAttribute('r', '40');
                    this.setAttribute('opacity', '0.8');
                });
                circle.addEventListener('click', () => showFishboneDetails(category, data));
                svg.appendChild(circle);

                // Category label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', y + 5);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', 'white');
                text.setAttribute('font-size', '20');
                text.setAttribute('font-weight', 'bold');
                text.textContent = category.split(' ')[0];
                text.style.cursor = 'pointer';
                text.style.pointerEvents = 'none';
                text.style.animation = `fadeIn 0.5s ease forwards ${1.2 + index * 0.2}s`;
                svg.appendChild(text);

                // Category name
                const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                nameText.setAttribute('x', x);
                nameText.setAttribute('y', isTop ? y - 55 : y + 65);
                nameText.setAttribute('text-anchor', 'middle');
                nameText.setAttribute('fill', document.body.classList.contains('light-theme') ? '#000' : '#fff');
                nameText.setAttribute('font-size', '14');
                nameText.setAttribute('font-weight', '600');
                nameText.textContent = category.substring(2);
                nameText.style.animation = `fadeIn 0.5s ease forwards ${1.4 + index * 0.2}s`;
                svg.appendChild(nameText);
            });

            container.appendChild(svg);
        }

        function showFishboneDetails(category, data) {
            const detailsContainer = document.getElementById('fishbone-details');
            const titleEl = document.getElementById('detail-title');
            const listEl = document.getElementById('detail-list');

            titleEl.textContent = category;
            listEl.innerHTML = '';
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.style.color = document.body.classList.contains('light-theme') ? '#000' : '#fff';
                listEl.appendChild(li);
            });

            detailsContainer.style.display = 'block';
        }

        const fishboneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createFishboneDiagram();
                    fishboneObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const fishboneSection = document.getElementById('ishikawa');
        if (fishboneSection) {
            fishboneObserver.observe(fishboneSection);
        }

        // ============================================
        // SIPOC INTERACTIVE SYSTEM
        // ============================================
        
        // SIPOC Detaylı Veriler
        const sipocDetails = {
            'suppliers': {
                title: 'Tedarikçiler (Suppliers)',
                letter: 'S',
                color: '#8b5cf6',
                description: 'Kiralama sürecine girdi sağlayan tüm dış ve iç paydaşlar. Bu tedarikçiler, sürecin başlaması ve devam etmesi için gerekli kaynakları, bilgileri ve talepleri sağlarlar.',
                items: [
                    {
                        name: 'Müşteriler',
                        detail: 'Araç kiralama talebinde bulunan bireysel ve kurumsal müşteriler. Yaklaşık 12.000+ aktif müşteri profili.'
                    },
                    {
                        name: 'Araç Sahipleri',
                        detail: 'Filoya araç sağlayan bireysel ve kurumsal mal sahipleri. 350+ araç sahibi ile çalışılmaktadır.'
                    },
                    {
                        name: 'Sigorta Şirketleri',
                        detail: 'Kasko ve trafik sigortası sağlayan anlaşmalı kurumlar. 5 farklı sigorta şirketi ile ortaklık.'
                    },
                    {
                        name: 'Bakım Servisleri',
                        detail: 'Araç bakım ve onarım hizmetleri sunan yetkili servisler. 25+ servis noktası.'
                    }
                ],
                keypoints: [
                    'Müşteri taleplerinin %85\'i online kanallardan geliyor',
                    'Araç sahipleri ile stratejik ortaklıklar mevcut',
                    'Sigorta şirketleri ile otomatik entegrasyon hedefleniyor',
                    'Bakım servisleri için dijital takip sistemi kurulacak'
                ],
                metrics: [
                    { label: 'Aktif Tedarikçi', value: '380+' },
                    { label: 'Aylık Talep', value: '15K' },
                    { label: 'Ortaklık Skoru', value: '4.7★' },
                    { label: 'SLA Uyumu', value: '%94' }
                ]
            },
            'inputs': {
                title: 'Girdiler (Inputs)',
                letter: 'I',
                color: '#3b82f6',
                description: 'Kiralama sürecinin başlaması ve yürütülmesi için gerekli olan tüm bilgiler, belgeler ve kaynaklar. Bu girdiler sürecin doğru ve verimli işlemesi için kritik öneme sahiptir.',
                items: [
                    {
                        name: 'Kiralama Talebi',
                        detail: 'Müşterinin araç, tarih ve konum tercihlerini içeren talep formu. Günde ortalama 500 talep alınır.'
                    },
                    {
                        name: 'Müşteri Bilgileri',
                        detail: 'TC kimlik, ehliyet, iletişim ve ödeme bilgileri. KVKK uyumlu veri yönetimi.'
                    },
                    {
                        name: 'Araç Envanter',
                        detail: '5.000+ araçlık envanter verisi. Gerçek zamanlı müsaitlik durumu ve lokasyon bilgisi.'
                    },
                    {
                        name: 'Fiyat Listeleri',
                        detail: 'Dinamik fiyatlandırma algoritması. Sezon, talep ve araç tipine göre değişken fiyatlar.'
                    }
                ],
                keypoints: [
                    'Taleplerin %65\'i mobil cihazlardan geliyor',
                    'Müşteri bilgileri ISO 27001 standardında korunuyor',
                    'Envanter güncellemeleri manuel yapılıyor (otomasyon hedefi)',
                    'Fiyat algoritması AI ile optimize edilecek'
                ],
                metrics: [
                    { label: 'Günlük Talep', value: '500' },
                    { label: 'Veri Doğruluğu', value: '%88' },
                    { label: 'Envanter Sync', value: '15dk' },
                    { label: 'Fiyat Varyasyonu', value: '±%18' }
                ]
            },
            'process': {
                title: 'Süreç (Process)',
                letter: 'P',
                color: '#10b981',
                description: 'Girdilerin çıktılara dönüştürüldüğü temel iş süreçleri. Her adım, değer katarak müşteri talebini karşılamaya yönelik faaliyetlerden oluşur. Ortalama tamamlanma süresi 45 dakika.',
                items: [
                    {
                        name: 'Rezervasyon Al',
                        detail: 'Müşteri talebini kaydetme ve ön onay süreci. Ortalama 10 dakika. Hedef: 3 dakika.'
                    },
                    {
                        name: 'Doğrulama Yap',
                        detail: 'Kimlik, ehliyet ve ödeme bilgilerinin doğrulanması. Ortalama 12 dakika. Hedef: 2 dakika.'
                    },
                    {
                        name: 'Sözleşme Oluştur',
                        detail: 'Dijital veya fiziksel sözleşme hazırlama. Ortalama 8 dakika. Hedef: 2 dakika.'
                    },
                    {
                        name: 'Araç Teslim Et',
                        detail: 'Aracın müşteriye teslimi ve hasarsızlık kontrolü. Ortalama 10 dakika. Hedef: 3 dakika.'
                    },
                    {
                        name: 'Ödeme İşle',
                        detail: 'Ödeme tahsilatı ve faturalama işlemi. Ortalama 5 dakika. Hedef: 2 dakika.'
                    }
                ],
                keypoints: [
                    'Toplam süreç süresi: 45 dakika (Hedef: 15 dakika)',
                    'Manuel işlem oranı: %75 (Hedef: %25)',
                    'Otomasyonla %70 süre tasarrufu sağlanacak',
                    'Dijital sözleşme ile kağıt kullanımı %90 azalacak',
                    'Gerçek zamanlı doğrulama ile hata oranı %80 düşecek'
                ],
                metrics: [
                    { label: 'Toplam Süre', value: '45dk' },
                    { label: 'Adım Sayısı', value: '5' },
                    { label: 'Otomasyon', value: '%25' },
                    { label: 'Verimlilik', value: '%58' }
                ]
            },
            'outputs': {
                title: 'Çıktılar (Outputs)',
                letter: 'O',
                color: '#f59e0b',
                description: 'Süreç sonunda üretilen somut belgeler, onaylar ve deliverable\'lar. Bu çıktılar hem müşteri hem de iç süreçler için kullanılır ve sürecin başarıyla tamamlandığını gösterir.',
                items: [
                    {
                        name: 'Onaylı Rezervasyon',
                        detail: 'Rezervasyon onay belgesi ve referans numarası. Günde 450+ rezervasyon onayı.'
                    },
                    {
                        name: 'Kiralama Sözleşmesi',
                        detail: 'İmzalanmış kiralama sözleşmesi (dijital veya fiziksel). Yasal geçerliliği olan belge.'
                    },
                    {
                        name: 'Teslim Belgesi',
                        detail: 'Araç teslim tutanağı ve hasar kayıt formu. Fotoğraflı belgeleme.'
                    },
                    {
                        name: 'Fatura',
                        detail: 'E-fatura veya fiziksel fatura belgesi. Muhasebe sistemi entegrasyonu.'
                    }
                ],
                keypoints: [
                    'Tüm belgeler dijitalleştirilecek (%100 hedef)',
                    'E-imza entegrasyonu ile anında onay',
                    'Blockchain ile belge güvenliği artırılacak',
                    'Otomatik arşivleme ve kolay erişim',
                    'Müşteri portali üzerinden belge indirme'
                ],
                metrics: [
                    { label: 'Günlük Çıktı', value: '450' },
                    { label: 'Dijital Oran', value: '%42' },
                    { label: 'Hata Oranı', value: '%8' },
                    { label: 'E-Fatura', value: '%78' }
                ]
            },
            'customers': {
                title: 'Müşteriler (Customers)',
                letter: 'C',
                color: '#ef4444',
                description: 'Süreç çıktılarından yararlanan ve hizmeti tüketen tüm müşteri segmentleri. Her segment farklı ihtiyaçlar ve beklentilerle sürece dahil olur.',
                items: [
                    {
                        name: 'Bireysel Müşteriler',
                        detail: 'Kişisel kullanım için araç kiralayan bireyler. Toplam müşterilerin %55\'i. Yıllık 8.000+ işlem.'
                    },
                    {
                        name: 'Kurumsal Firmalar',
                        detail: 'Kurumsal filo ihtiyaçları olan şirketler. Toplam müşterilerin %30\'u. Uzun dönem anlaşmalar.'
                    },
                    {
                        name: 'Turizm Acenteleri',
                        detail: 'Transfer ve tur hizmetleri için toplu kiralama yapan acenteler. %10 pazar payı.'
                    },
                    {
                        name: 'Araç Sahipleri',
                        detail: 'Araçlarını filoya dahil eden ve gelir elde eden sahipler. %5 müşteri segmenti.'
                    }
                ],
                keypoints: [
                    'Bireysel müşteri memnuniyeti: %98',
                    'Kurumsal müşteri sadakati: %85',
                    'Turizm acenteleri için özel fiyatlandırma',
                    'Araç sahipleri için komisyon sistemi: %15-25',
                    'NPS Skoru: +62 (Mükemmel seviye)'
                ],
                metrics: [
                    { label: 'Toplam Müşteri', value: '12K+' },
                    { label: 'Aktif Müşteri', value: '4.5K' },
                    { label: 'Retention', value: '%82' },
                    { label: 'NPS', value: '+62' }
                ]
            }
        };

        // SVG Flow Diyagramı Oluştur
        function createSIPOCFlow() {
            const container = document.getElementById('sipoc-svg-flow');
            if (!container) return;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '120');
            svg.setAttribute('viewBox', '0 0 1200 120');
            svg.style.overflow = 'visible';

            const lineY = 60;
            const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
            const labels = ['S', 'I', 'P', 'O', 'C'];
            const names = ['Suppliers', 'Inputs', 'Process', 'Outputs', 'Customers'];

            // Main flow line
            const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            mainLine.setAttribute('x1', '100');
            mainLine.setAttribute('y1', lineY);
            mainLine.setAttribute('x2', '1100');
            mainLine.setAttribute('y2', lineY);
            mainLine.setAttribute('stroke', 'url(#flowGradient)');
            mainLine.setAttribute('stroke-width', '4');
            mainLine.style.strokeDasharray = '1000';
            mainLine.style.strokeDashoffset = '1000';
            mainLine.style.animation = 'drawLine 3s ease forwards';
            svg.appendChild(mainLine);

            // Gradient definition
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', 'flowGradient');
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '0%');
            
            colors.forEach((color, i) => {
                const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop.setAttribute('offset', `${(i / (colors.length - 1)) * 100}%`);
                stop.setAttribute('stop-color', color);
                gradient.appendChild(stop);
            });
            defs.appendChild(gradient);
            svg.appendChild(defs);

            // SIPOC Points
            for (let i = 0; i < 5; i++) {
                const x = 200 + (i * 200);
                
                // Circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', lineY);
                circle.setAttribute('r', '25');
                circle.setAttribute('fill', colors[i]);
                circle.setAttribute('stroke', 'white');
                circle.setAttribute('stroke-width', '3');
                circle.style.opacity = '0';
                circle.style.cursor = 'pointer';
                circle.style.animation = `fadeIn 0.5s ease forwards ${1 + i * 0.2}s`;
                circle.style.filter = 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))';
                
                circle.addEventListener('mouseenter', function() {
                    this.setAttribute('r', '30');
                });
                circle.addEventListener('mouseleave', function() {
                    this.setAttribute('r', '25');
                });
                
                svg.appendChild(circle);
                
                // Letter
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', lineY + 7);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', 'white');
                text.setAttribute('font-size', '20');
                text.setAttribute('font-weight', 'bold');
                text.textContent = labels[i];
                text.style.opacity = '0';
                text.style.animation = `fadeIn 0.5s ease forwards ${1.2 + i * 0.2}s`;
                text.style.pointerEvents = 'none';
                svg.appendChild(text);
                
                // Name label
                const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                nameText.setAttribute('x', x);
                nameText.setAttribute('y', lineY - 40);
                nameText.setAttribute('text-anchor', 'middle');
                nameText.setAttribute('fill', document.body.classList.contains('light-theme') ? '#000' : '#fff');
                nameText.setAttribute('font-size', '12');
                nameText.setAttribute('font-weight', '600');
                nameText.textContent = names[i];
                nameText.style.opacity = '0';
                nameText.style.animation = `fadeIn 0.5s ease forwards ${1.4 + i * 0.2}s`;
                svg.appendChild(nameText);

                // Arrow (except last)
                if (i < 4) {
                    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    const arrowX = x + 110;
                    arrow.setAttribute('points', `${arrowX},${lineY} ${arrowX-10},${lineY-6} ${arrowX-10},${lineY+6}`);
                    arrow.setAttribute('fill', colors[i+1]);
                    arrow.style.opacity = '0';
                    arrow.style.animation = `fadeIn 0.5s ease forwards ${1.6 + i * 0.2}s`;
                    svg.appendChild(arrow);
                }
            }

            container.appendChild(svg);
        }

        // SIPOC Detay Panelini Göster
        function showSIPOCDetails(sipocId) {
            const panel = document.getElementById('sipoc-details-panel');
            const data = sipocDetails[sipocId];
            
            if (!data) return;

            // Tüm kutulardan active sınıfını kaldır
            document.querySelectorAll('.sipoc-box').forEach(box => {
                box.classList.remove('active');
            });

            // Tıklanan kutuya active ekle
            document.querySelector(`[data-sipoc-id="${sipocId}"]`).classList.add('active');

            // Panel içeriğini doldur
            document.getElementById('sipoc-detail-title').textContent = data.title;
            document.getElementById('sipoc-detail-description').textContent = data.description;

            // Alt kategorileri doldur
            const itemsGrid = document.getElementById('sipoc-detail-items');
            itemsGrid.innerHTML = '';
            data.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'sipoc-item-card';
                card.innerHTML = `
                    <h5>${item.name}</h5>
                    <p>${item.detail}</p>
                `;
                itemsGrid.appendChild(card);
            });

            // Önemli noktaları doldur
            const keypointsList = document.getElementById('sipoc-detail-keypoints');
            keypointsList.innerHTML = '';
            data.keypoints.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                keypointsList.appendChild(li);
            });

            // Metrikleri doldur
            const metricsGrid = document.getElementById('sipoc-detail-metrics');
            metricsGrid.innerHTML = '';
            data.metrics.forEach(metric => {
                const card = document.createElement('div');
                card.className = 'sipoc-metric-card';
                card.innerHTML = `
                    <div class="sipoc-metric-value">${metric.value}</div>
                    <div class="sipoc-metric-label">${metric.label}</div>
                `;
                metricsGrid.appendChild(card);
            });

            // Paneli göster
            panel.classList.add('active');
            
            // Panele scroll
            setTimeout(() => {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }

        // SIPOC Detay Panelini Kapat
        function closeSIPOCDetails() {
            const panel = document.getElementById('sipoc-details-panel');
            panel.classList.remove('active');
            
            // Active sınıfını kaldır
            document.querySelectorAll('.sipoc-box').forEach(box => {
                box.classList.remove('active');
            });
        }

        // SIPOC Close Button
        const sipocCloseBtn = document.querySelector('.sipoc-close-detail');
        if (sipocCloseBtn) {
            sipocCloseBtn.addEventListener('click', closeSIPOCDetails);
        }

        // SIPOC SVG Flow'u oluştur
        const sipocObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createSIPOCFlow();
                    sipocObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const sipocSection = document.getElementById('sipoc');
        if (sipocSection) {
            sipocObserver.observe(sipocSection);
        }

        // ============================================
        // IMPROVEMENT DETAILS MODAL SYSTEM
        // ============================================
        
        // Detaylı iyileştirme verileri
        const improvementDetails = {
            'automation': {
                icon: '🤖',
                title: 'Süreç Otomasyonu',
                priority: 'high',
                priorityText: 'Yüksek',
                overview: 'Kiralama süreçlerinin otomasyonu, manuel işlem adımlarını minimize ederek operasyonel verimliliği artıracak ve hata oranlarını düşürecektir. RPA (Robotic Process Automation) ve workflow automation araçları kullanılarak rezervasyon, onay ve teslim süreçleri otomatize edilecektir.',
                goals: [
                    'Rezervasyon süresini 45 dakikadan 15 dakikaya düşürmek',
                    'Manuel veri girişini %90 azaltmak',
                    'Onay süreçlerini otomatik hale getirmek',
                    'Gerçek zamanlı müsaitlik kontrolü sağlamak',
                    '7/24 rezervasyon imkanı sunmak'
                ],
                benefits: [
                    'İşlem süresinde %70 azalma',
                    'Hata oranında %80 düşüş',
                    'Personel verimliliğinde %50 artış',
                    'Müşteri memnuniyetinde %40 artış',
                    'Yıllık 350.000 TL maliyet tasarrufu',
                    '24/7 hizmet sunumu'
                ],
                metrics: [
                    { label: 'Süre Azalması', value: '%70' },
                    { label: 'Hata Azalması', value: '%80' },
                    { label: 'Verimlilik', value: '%50' },
                    { label: 'ROI', value: '%320' }
                ],
                timeline: '6-9 ay (Faz 1: 3 ay analiz, Faz 2: 4 ay geliştirme, Faz 3: 2 ay test)',
                investment: '450.000 - 650.000 TL (Yazılım lisansı, geliştirme, eğitim dahil)'
            },
            'integration': {
                icon: '🔗',
                title: 'Sistem Entegrasyonu',
                priority: 'high',
                priorityText: 'Yüksek',
                overview: 'Mevcut sistemlerin (CRM, ERP, Muhasebe, Filo Takip) tek bir platformda entegre edilmesi, veri tutarlılığını sağlayacak ve departmanlar arası iletişimi güçlendirecektir. API-first yaklaşımı ile microservices mimarisi kurulacaktır.',
                goals: [
                    'Tüm sistemleri tek platformda birleştirmek',
                    'Veri tutarsızlıklarını elimine etmek',
                    'Gerçek zamanlı veri senkronizasyonu sağlamak',
                    'Departmanlar arası veri akışını optimize etmek',
                    'API gateway kurulumu yapmak'
                ],
                benefits: [
                    'Veri tutarsızlığında %95 azalma',
                    'Çoklu veri girişi ortadan kalkar',
                    'Raporlama süresinde %80 iyileşme',
                    'Sistem bakım maliyetinde %40 düşüş',
                    'Gerçek zamanlı veri erişimi',
                    'Ölçeklenebilir altyapı'
                ],
                metrics: [
                    { label: 'Veri Tutarlılığı', value: '%95' },
                    { label: 'Entegre Sistem', value: '8+' },
                    { label: 'API Endpoint', value: '50+' },
                    { label: 'Sync Hızı', value: '<1s' }
                ],
                timeline: '8-12 ay (Faz 1: 2 ay mimari tasarım, Faz 2: 6 ay entegrasyon, Faz 3: 4 ay test)',
                investment: '850.000 - 1.200.000 TL (Middleware, API gateway, geliştirme)'
            },
            'mobile': {
                icon: '📱',
                title: 'Mobil Uygulama',
                priority: 'high',
                priorityText: 'Yüksek',
                overview: 'iOS ve Android platformları için native mobil uygulama geliştirilerek müşterilere 7/24 erişim imkanı sağlanacaktır. Push notification, GPS tracking ve offline mode özellikleri bulunacaktır.',
                goals: [
                    'iOS ve Android uygulamaları geliştirmek',
                    'Mobil üzerinden rezervasyon imkanı sunmak',
                    'Push notification sistemi kurmak',
                    'QR kod ile araç teslim/iade sağlamak',
                    'Offline mode desteği eklemek'
                ],
                benefits: [
                    'Mobil kullanıcılara %100 erişim',
                    'Rezervasyon süresinde %60 azalma',
                    'Müşteri etkileşiminde %150 artış',
                    'Dijital belge yönetimi',
                    'GPS ile araç takibi',
                    'Anlık bildirimler'
                ],
                metrics: [
                    { label: 'Mobil İşlem', value: '%65' },
                    { label: 'App Store Rating', value: '4.8★' },
                    { label: 'Günlük Aktif', value: '3500+' },
                    { label: 'Push Open Rate', value: '%42' }
                ],
                timeline: '5-7 ay (Faz 1: 1 ay tasarım, Faz 2: 4 ay geliştirme, Faz 3: 2 ay test)',
                investment: '380.000 - 550.000 TL (UI/UX tasarım, native development, backend API)'
            },
            'analytics': {
                icon: '📊',
                title: 'Analitik Dashboard',
                priority: 'medium',
                priorityText: 'Orta',
                overview: 'Gerçek zamanlı veri analitiği ve görselleştirme platformu ile iş süreçlerinin performansı izlenecek, trendler analiz edilecek ve veri-tabanlı kararlar alınacaktır. BI (Business Intelligence) araçları entegre edilecektir.',
                goals: [
                    'Gerçek zamanlı dashboard oluşturmak',
                    'KPI tracking sistemi kurmak',
                    'Özelleştirilebilir raporlar sunmak',
                    'Predictive analytics eklemek',
                    'Automated reporting sağlamak'
                ],
                benefits: [
                    'Gerçek zamanlı performans izleme',
                    'Veri-tabanlı karar alma',
                    'Trend analizi ve tahminleme',
                    'Otomatik raporlama',
                    'Anomali tespiti',
                    'Departman bazlı metrikler'
                ],
                metrics: [
                    { label: 'KPI Sayısı', value: '25+' },
                    { label: 'Rapor Türü', value: '15+' },
                    { label: 'Veri Kaynağı', value: '8' },
                    { label: 'Refresh Rate', value: '5sn' }
                ],
                timeline: '4-6 ay (Faz 1: 1 ay veri modelleme, Faz 2: 3 ay dashboard geliştirme, Faz 3: 2 ay optimize)',
                investment: '280.000 - 420.000 TL (BI tool lisansı, dashboard development, data warehouse)'
            },
            'training': {
                icon: '🎓',
                title: 'Personel Eğitimi',
                priority: 'medium',
                priorityText: 'Orta',
                overview: 'Yeni sistemlerin etkin kullanımı için kapsamlı eğitim programları düzenlenecektir. E-learning platformu, hands-on workshop\'lar ve sertifikasyon programları ile personelin yetkinliği artırılacaktır.',
                goals: [
                    'E-learning platformu kurmak',
                    'Role-based eğitim programları oluşturmak',
                    'Sertifikasyon sistemi kurmak',
                    'Sürekli gelişim programları başlatmak',
                    'Change management desteği sağlamak'
                ],
                benefits: [
                    'Sistem adaptasyonunda %60 hızlanma',
                    'Kullanıcı hatalarında %70 azalma',
                    'Personel memnuniyetinde artış',
                    'Sistem kullanım oranında %85 artış',
                    'Destek taleplerinde %50 azalma',
                    'İnovasyon kültürü oluşumu'
                ],
                metrics: [
                    { label: 'Eğitim Alan', value: '250' },
                    { label: 'Tamamlama', value: '%91' },
                    { label: 'Sertifika', value: '180+' },
                    { label: 'Memnuniyet', value: '4.6★' }
                ],
                timeline: '3-4 ay (Faz 1: 1 ay içerik hazırlama, Faz 2: 2 ay eğitimler, Faz 3: 1 ay değerlendirme)',
                investment: '120.000 - 180.000 TL (E-learning platform, eğitmen, materyal, sertifikasyon)'
            },
            'crm': {
                icon: '🤝',
                title: 'CRM Entegrasyonu',
                priority: 'low',
                priorityText: 'Düşük',
                overview: 'Müşteri ilişkileri yönetim sistemi (CRM) entegrasyonu ile müşteri verilerinin merkezi yönetimi, sadakat programları ve kişiselleştirilmiş hizmet sunumu sağlanacaktır. 360-derece müşteri görünümü elde edilecektir.',
                goals: [
                    'CRM sistemi entegre etmek',
                    'Müşteri 360° görünümü sağlamak',
                    'Sadakat programı başlatmak',
                    'Kişiselleştirilmiş kampanyalar sunmak',
                    'Müşteri journey mapping yapmak'
                ],
                benefits: [
                    'Müşteri memnuniyetinde %25 artış',
                    'Tekrar eden müşteri oranında %35 artış',
                    'Cross-sell/up-sell fırsatları',
                    'Churn oranında %40 azalma',
                    'Marketing ROI\'da %120 artış',
                    'Kişiselleştirilmiş deneyim'
                ],
                metrics: [
                    { label: 'Müşteri Profili', value: '12K+' },
                    { label: 'Sadakat Üyesi', value: '4500' },
                    { label: 'NPS Skoru', value: '+58' },
                    { label: 'Retention', value: '%82' }
                ],
                timeline: '4-5 ay (Faz 1: 1 ay CRM seçimi, Faz 2: 3 ay entegrasyon, Faz 3: 1 ay kampanya)',
                investment: '220.000 - 320.000 TL (CRM lisansı, entegrasyon, eğitim, kampanya)'
            }
        };

        // Modal açma fonksiyonu
        function openImprovementModal(improvementId) {
            const modal = document.getElementById('improvement-modal');
            const data = improvementDetails[improvementId];
            
            if (!data) return;

            // Modal içeriğini doldur
            document.getElementById('modal-icon').textContent = data.icon;
            document.getElementById('modal-title').textContent = data.title;
            
            const priorityBadge = document.getElementById('modal-priority');
            priorityBadge.textContent = data.priorityText;
            priorityBadge.className = `priority-badge priority-${data.priority}`;
            
            document.getElementById('modal-overview').textContent = data.overview;
            
            // Hedefleri doldur
            const goalsList = document.getElementById('modal-goals');
            goalsList.innerHTML = '';
            data.goals.forEach(goal => {
                const li = document.createElement('li');
                li.textContent = goal;
                goalsList.appendChild(li);
            });
            
            // Faydaları doldur
            const benefitsList = document.getElementById('modal-benefits');
            benefitsList.innerHTML = '';
            data.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });
            
            // Metrikleri doldur
            const metricsList = document.getElementById('modal-metrics');
            metricsList.innerHTML = '';
            data.metrics.forEach(metric => {
                const metricDiv = document.createElement('div');
                metricDiv.className = 'metric-item';
                metricDiv.innerHTML = `
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-label">${metric.label}</div>
                `;
                metricsList.appendChild(metricDiv);
            });
            
            document.getElementById('modal-timeline').textContent = data.timeline;
            document.getElementById('modal-investment').textContent = data.investment;
            
            // Modal'ı göster
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Modal kapatma fonksiyonu
        function closeImprovementModal() {
            const modal = document.getElementById('improvement-modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Improvement kartlarına click event ekle
        document.querySelectorAll('.improvement-card').forEach(card => {
            card.addEventListener('click', () => {
                const improvementId = card.getAttribute('data-improvement-id');
                if (improvementId) {
                    openImprovementModal(improvementId);
                }
            });
            
            // Hover effect için cursor pointer
            card.style.cursor = 'pointer';
        });

        // Modal kapatma event'leri
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
            btn.addEventListener('click', closeImprovementModal);
        });


        // ESC tuşu ile kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeImprovementModal();
            }
        });

        console.log('🚀 Bulut Filo Yönetimi - BPM Analiz Sunumu Yüklendi');

        // BPMN Image Zoom Functionality
        let currentZoom = 1;
        const minZoom = 0.5;
        const maxZoom = 3;
        const zoomStep = 0.2;
        
        // Drag/Pan functionality
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentTranslateX = 0;
        let currentTranslateY = 0;
        let lastTranslateX = 0;
        let lastTranslateY = 0;

        function zoomIn() {
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                applyZoom();
            }
        }

        function zoomOut() {
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                applyZoom();
            }
        }

        function resetZoom() {
            currentZoom = 1;
            currentTranslateX = 0;
            currentTranslateY = 0;
            lastTranslateX = 0;
            lastTranslateY = 0;
            applyZoom();
        }

        function applyZoom() {
            const image = document.getElementById('bpmn-image');
            if (image) {
                image.style.transform = `scale(${currentZoom}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
                
                // Zoom seviyesini göster
                updateZoomIndicator();
            }
        }

        function updateZoomIndicator() {
            // Zoom seviyesini konsola yazdır (isteğe bağlı)
            console.log(`Zoom Level: ${Math.round(currentZoom * 100)}%`);
        }

        // Mouse wheel zoom ve drag desteği
        document.addEventListener('DOMContentLoaded', function() {
            const imageContainer = document.querySelector('.bpmn-image-container');
            const image = document.getElementById('bpmn-image');
            
            if (imageContainer && image) {
                // Mouse wheel zoom - only when Ctrl key is pressed or over image
                imageContainer.addEventListener('wheel', function(e) {
                    // Only prevent default if Ctrl key is pressed (zoom mode) or hovering over image
                    const isOverImage = e.target === image || image.contains(e.target);
                    const isCtrlPressed = e.ctrlKey || e.metaKey;
                    
                    if (isCtrlPressed || isOverImage) {
                        e.preventDefault();
                        if (e.deltaY < 0) {
                            zoomIn();
                        } else {
                            zoomOut();
                        }
                    }
                    // Otherwise, allow normal scroll
                });
                
                // Mouse drag events
                image.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Sol mouse tuşu
                        isDragging = true;
                        startX = e.clientX - currentTranslateX;
                        startY = e.clientY - currentTranslateY;
                        image.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        currentTranslateX = e.clientX - startX;
                        currentTranslateY = e.clientY - startY;
                        
                        // Sınırları kontrol et
                        const containerRect = imageContainer.getBoundingClientRect();
                        const imageRect = image.getBoundingClientRect();
                        const scaledWidth = imageRect.width * currentZoom;
                        const scaledHeight = imageRect.height * currentZoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        currentTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, currentTranslateX));
                        currentTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, currentTranslateY));
                        
                        applyZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (isDragging) {
                        isDragging = false;
                        lastTranslateX = currentTranslateX;
                        lastTranslateY = currentTranslateY;
                        image.classList.remove('dragging');
                    }
                });
                
                // Drag'i engellemek için context menu'yu kapat
                image.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
            }
        });

        // Touch zoom ve drag desteği (mobil cihazlar için)
        let initialDistance = 0;
        let initialZoom = 1;
        let initialTranslateX = 0;
        let initialTranslateY = 0;
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('DOMContentLoaded', function() {
            const image = document.getElementById('bpmn-image');
            if (image) {
                image.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Tek parmak - drag
                        touchStartX = e.touches[0].clientX - currentTranslateX;
                        touchStartY = e.touches[0].clientY - currentTranslateY;
                    } else if (e.touches.length === 2) {
                        // İki parmak - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = currentZoom;
                        initialTranslateX = currentTranslateX;
                        initialTranslateY = currentTranslateY;
                    }
                });

                image.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Tek parmak - drag
                        e.preventDefault();
                        currentTranslateX = e.touches[0].clientX - touchStartX;
                        currentTranslateY = e.touches[0].clientY - touchStartY;
                        
                        // Sınırları kontrol et
                        const imageContainer = document.querySelector('.bpmn-image-container');
                        const containerRect = imageContainer.getBoundingClientRect();
                        const imageRect = image.getBoundingClientRect();
                        const scaledWidth = imageRect.width * currentZoom;
                        const scaledHeight = imageRect.height * currentZoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        currentTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, currentTranslateX));
                        currentTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, currentTranslateY));
                        
                        applyZoom();
                    } else if (e.touches.length === 2) {
                        // İki parmak - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= minZoom && newZoom <= maxZoom) {
                            currentZoom = newZoom;
                            applyZoom();
                        }
                    }
                });
            }
        });

        function getDistance(touch1, touch2) {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // ============================================
        // PRODUCT GALLERY ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Product gallery zoom states
        const productZoomStates = {};
        const productDragStates = {};
        
        // Initialize product gallery functionality
        document.addEventListener('DOMContentLoaded', function() {
            const productImages = document.querySelectorAll('.product-image');
            productImages.forEach(image => {
                const imageId = image.id;
                productZoomStates[imageId] = {
                    zoom: 1,
                    translateX: 0,
                    translateY: 0,
                    lastTranslateX: 0,
                    lastTranslateY: 0
                };
                
                productDragStates[imageId] = {
                    isDragging: false,
                    startX: 0,
                    startY: 0
                };
                
                // Mouse events
                image.addEventListener('mousedown', function(e) {
                    if (e.button === 0) {
                        productDragStates[imageId].isDragging = true;
                        productDragStates[imageId].startX = e.clientX - productZoomStates[imageId].translateX;
                        productDragStates[imageId].startY = e.clientY - productZoomStates[imageId].translateY;
                        image.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                // Mouse wheel zoom - only when Ctrl key is pressed
                image.addEventListener('wheel', function(e) {
                    // Only prevent default if Ctrl key is pressed (zoom mode)
                    const isCtrlPressed = e.ctrlKey || e.metaKey;
                    
                    if (isCtrlPressed) {
                        e.preventDefault();
                        if (e.deltaY < 0) {
                            zoomInProduct(imageId);
                        } else {
                            zoomOutProduct(imageId);
                        }
                    }
                    // Otherwise, allow normal scroll
                });
                
                // Context menu prevention
                image.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
            });
            
            // Global mouse events for product gallery
            document.addEventListener('mousemove', function(e) {
                Object.keys(productDragStates).forEach(imageId => {
                    const dragState = productDragStates[imageId];
                    const zoomState = productZoomStates[imageId];
                    
                    if (dragState.isDragging) {
                        zoomState.translateX = e.clientX - dragState.startX;
                        zoomState.translateY = e.clientY - dragState.startY;
                        
                        // Apply boundaries
                        const image = document.getElementById(imageId);
                        const container = image.closest('.product-image-container');
                        if (container) {
                            const containerRect = container.getBoundingClientRect();
                            const imageRect = image.getBoundingClientRect();
                            const scaledWidth = imageRect.width * zoomState.zoom;
                            const scaledHeight = imageRect.height * zoomState.zoom;
                            
                            const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                            const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                            
                            zoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, zoomState.translateX));
                            zoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, zoomState.translateY));
                        }
                        
                        applyProductZoom(imageId);
                    }
                });
            });
            
            document.addEventListener('mouseup', function() {
                Object.keys(productDragStates).forEach(imageId => {
                    const dragState = productDragStates[imageId];
                    const zoomState = productZoomStates[imageId];
                    
                    if (dragState.isDragging) {
                        dragState.isDragging = false;
                        zoomState.lastTranslateX = zoomState.translateX;
                        zoomState.lastTranslateY = zoomState.translateY;
                        document.getElementById(imageId).classList.remove('dragging');
                    }
                });
            });
            
            // Touch events for product gallery
            Object.keys(productZoomStates).forEach(imageId => {
                const image = document.getElementById(imageId);
                if (image) {
                    let initialDistance = 0;
                    let initialZoom = 1;
                    let initialTranslateX = 0;
                    let initialTranslateY = 0;
                    let touchStartX = 0;
                    let touchStartY = 0;
                    
                    image.addEventListener('touchstart', function(e) {
                        if (e.touches.length === 1) {
                            // Single touch - drag
                            touchStartX = e.touches[0].clientX - productZoomStates[imageId].translateX;
                            touchStartY = e.touches[0].clientY - productZoomStates[imageId].translateY;
                        } else if (e.touches.length === 2) {
                            // Two touches - zoom
                            e.preventDefault();
                            initialDistance = getDistance(e.touches[0], e.touches[1]);
                            initialZoom = productZoomStates[imageId].zoom;
                            initialTranslateX = productZoomStates[imageId].translateX;
                            initialTranslateY = productZoomStates[imageId].translateY;
                        }
                    });
                    
                    image.addEventListener('touchmove', function(e) {
                        if (e.touches.length === 1) {
                            // Single touch - drag
                            e.preventDefault();
                            productZoomStates[imageId].translateX = e.touches[0].clientX - touchStartX;
                            productZoomStates[imageId].translateY = e.touches[0].clientY - touchStartY;
                            
                            // Apply boundaries
                            const container = image.closest('.product-image-container');
                            if (container) {
                                const containerRect = container.getBoundingClientRect();
                                const imageRect = image.getBoundingClientRect();
                                const scaledWidth = imageRect.width * productZoomStates[imageId].zoom;
                                const scaledHeight = imageRect.height * productZoomStates[imageId].zoom;
                                
                                const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                                const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                                
                                productZoomStates[imageId].translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, productZoomStates[imageId].translateX));
                                productZoomStates[imageId].translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, productZoomStates[imageId].translateY));
                            }
                            
                            applyProductZoom(imageId);
                        } else if (e.touches.length === 2) {
                            // Two touches - zoom
                            e.preventDefault();
                            const currentDistance = getDistance(e.touches[0], e.touches[1]);
                            const scale = currentDistance / initialDistance;
                            const newZoom = initialZoom * scale;
                            
                            if (newZoom >= 0.5 && newZoom <= 3) {
                                productZoomStates[imageId].zoom = newZoom;
                                applyProductZoom(imageId);
                            }
                        }
                    });
                }
            });
        });
        
        // Product gallery zoom functions
        function zoomInProduct(imageId) {
            if (productZoomStates[imageId].zoom < 3) {
                productZoomStates[imageId].zoom += 0.2;
                applyProductZoom(imageId);
            }
        }
        
        function zoomOutProduct(imageId) {
            if (productZoomStates[imageId].zoom > 0.5) {
                productZoomStates[imageId].zoom -= 0.2;
                applyProductZoom(imageId);
            }
        }
        
        function resetZoomProduct(imageId) {
            productZoomStates[imageId].zoom = 1;
            productZoomStates[imageId].translateX = 0;
            productZoomStates[imageId].translateY = 0;
            productZoomStates[imageId].lastTranslateX = 0;
            productZoomStates[imageId].lastTranslateY = 0;
            applyProductZoom(imageId);
        }
        
        function applyProductZoom(imageId) {
            const image = document.getElementById(imageId);
            if (image && productZoomStates[imageId]) {
                const state = productZoomStates[imageId];
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }

        // ============================================
        // STORYBOARD SECTION - INTERACTIVE FEATURES
        // ============================================

        // Animate risk score numbers
        function animateRiskScore(element, targetValue, duration = 1000) {
            if (!element || prefersReducedMotion) {
                element.textContent = targetValue;
                return;
            }

            const startValue = 0;
            const increment = targetValue / (duration / 16);
            let currentValue = startValue;

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    element.textContent = targetValue;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(currentValue);
                }
            }, 16);
        }

        // Observe risk score elements
        const riskScoreObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scoreValue = entry.target.querySelector('.score-value');
                    if (scoreValue && !scoreValue.dataset.animated) {
                        const targetValue = parseInt(scoreValue.textContent);
                        scoreValue.dataset.animated = 'true';
                        animateRiskScore(scoreValue, targetValue);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.risk-score-display').forEach(display => {
            riskScoreObserver.observe(display);
        });

        // Animate timeline items sequentially
        const storyboardTimelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateX(-20px)';
                        entry.target.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 200);
                    
                    storyboardTimelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.timeline-item').forEach(item => {
            storyboardTimelineObserver.observe(item);
        });

        // Animate result cards on scroll
        const resultCardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                        entry.target.style.transition = 'all 0.6s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 150);
                    
                    resultCardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.result-card').forEach(card => {
            resultCardObserver.observe(card);
        });

        // Animate scene elements
        const sceneElementObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'scale(0.5) rotate(-180deg)';
                        entry.target.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1) rotate(0deg)';
                        }, 100);
                    }, index * 100);
                    
                    sceneElementObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.scene-element').forEach(element => {
            sceneElementObserver.observe(element);
        });

        // Animate character avatars
        const characterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'scale(0) rotate(360deg)';
                    entry.target.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1) rotate(0deg)';
                    }, 100);
                    
                    characterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.character-avatar').forEach(avatar => {
            characterObserver.observe(avatar);
        });

        // Wireframe screen interaction
        document.querySelectorAll('.wireframe-screen').forEach(screen => {
            screen.addEventListener('mouseenter', () => {
                screen.style.transform = 'translateY(-5px)';
                screen.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.6)';
            });

            screen.addEventListener('mouseleave', () => {
                screen.style.transform = 'translateY(0)';
                screen.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
            });
        });

        // Action button interactions
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple effect styles dynamically
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .action-button {
                position: relative;
                overflow: hidden;
            }
            
            .action-button .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        // Phase content stagger animation
        const phaseContentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.storyboard-visual, .storyboard-text, .wireframe-container');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '0';
                            child.style.transform = 'translateY(20px)';
                            child.style.transition = 'all 0.6s ease';
                            
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 200);
                    });
                    
                    phaseContentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.phase-content').forEach(content => {
            phaseContentObserver.observe(content);
        });

        // ============================================
        // SECTION-SPECIFIC INTERACTIVE ANIMATIONS
        // ============================================

        // Section 1: 3M Analysis - Interactive Cards
        const analysisCards = document.querySelectorAll('#section-1 .analysis-card');
        let isAnalysisCardScrolling = false;
        let analysisCardScrollTimeout = null;
        
        // Detect scroll to disable hover effects for analysis cards
        window.addEventListener('scroll', () => {
            isAnalysisCardScrolling = true;
            if (analysisCardScrollTimeout) clearTimeout(analysisCardScrollTimeout);
            analysisCardScrollTimeout = setTimeout(() => {
                isAnalysisCardScrolling = false;
            }, 150);
        }, { passive: true });
        
        analysisCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            
            card.addEventListener('mouseenter', function() {
                // Don't apply transform if scrolling
                if (isAnalysisCardScrolling) return;
                
                // Use CSS hover instead of inline transform to prevent scroll lag
                const icon = this.querySelector('.card-icon');
                if (icon) {
                    icon.style.animation = 'none';
                    setTimeout(() => {
                        icon.style.animation = 'float-icon 3s ease-in-out infinite';
                    }, 10);
                }
            });
            
            card.addEventListener('mouseleave', function() {
                // No need to reset transform since we're not using it anymore
            });
        });

        // EBO Items - Ripple Effect
        const eboItems = document.querySelectorAll('#section-1 .ebo-item');
        eboItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-animation 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Section 2: Stakeholder Cards - Tilt Effect
        const stakeholderCards = document.querySelectorAll('#section-2 .stakeholder-card');
        stakeholderCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        // Section 3: RACI Table - Row Highlight
        const raciRows = document.querySelectorAll('#section-3 .raci-table tbody tr');
        raciRows.forEach((row, index) => {
            row.style.transition = 'all 0.3s ease';
            row.style.animationDelay = `${index * 0.1}s`;
            
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                const cells = this.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.transform = 'scale(1.05)';
                });
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
                const cells = this.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.transform = 'scale(1)';
                });
            });
        });

        // Section 4: Persona Avatar - Interactive
        const personaAvatar = document.querySelector('#section-4 .persona-avatar');
        if (personaAvatar) {
            personaAvatar.addEventListener('click', function() {
                this.style.animation = 'none';
                this.style.transform = 'scale(1.2) rotate(360deg)';
                setTimeout(() => {
                    this.style.animation = 'avatar-bounce 2s ease-in-out infinite';
                    this.style.transform = 'scale(1) rotate(0deg)';
                }, 600);
            });
        }

        // Empathy Cards - Sequential Reveal
        const empathyCards = document.querySelectorAll('#section-4 .empathy-card');
        const empathyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                        entry.target.style.transition = 'all 0.6s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 150);
                    
                    empathyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        empathyCards.forEach(card => {
            empathyObserver.observe(card);
        });

        // Section 5: HMW Cards - Typewriter Effect
        const hmwQuestions = document.querySelectorAll('#section-5 .hmw-question');
        hmwQuestions.forEach(question => {
            const originalText = question.textContent;
            question.textContent = '';
            question.style.opacity = '0';
            
            const hmwObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let i = 0;
                        const typeInterval = setInterval(() => {
                            if (i < originalText.length) {
                                entry.target.textContent = originalText.substring(0, i + 1);
                                entry.target.style.opacity = '1';
                                i++;
                            } else {
                                clearInterval(typeInterval);
                            }
                        }, 30);
                        
                        hmwObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            hmwObserver.observe(question);
        });

        // Section 6: Pyramid Layers - Cascade Animation
        const pyramidLayers = document.querySelectorAll('#section-6 .pyramid-layer');
        const pyramidObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pyramidLayers.forEach((layer, index) => {
                        setTimeout(() => {
                            layer.style.opacity = '0';
                            layer.style.transform = 'translateY(50px) scale(0.9)';
                            layer.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                            
                            setTimeout(() => {
                                layer.style.opacity = '1';
                                layer.style.transform = 'translateY(0) scale(1)';
                            }, 100);
                        }, index * 200);
                    });
                    
                    pyramidObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (pyramidLayers.length > 0) {
            pyramidObserver.observe(pyramidLayers[0].closest('.glass-card'));
        }

        // Section 7: Requirement Cards - Counter Animation
        const requirementCards = document.querySelectorAll('#section-7 .requirement-card');
        requirementCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            
            const reqNumber = card.querySelector('.req-number');
            if (reqNumber) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            reqNumber.style.animation = 'req-number-pulse 0.5s ease-out';
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(card);
            }
        });

        // Section 8: KANO Cards - Color Wave
        const kanoCards = document.querySelectorAll('#section-8 .kano-card');
        kanoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const color = this.classList.contains('must-be') ? '239, 68, 68' :
                             this.classList.contains('performance') ? '59, 130, 246' :
                             '16, 185, 129';
                
                this.style.boxShadow = `0 30px 60px rgba(${color}, 0.4)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        });

        // Section 9: User Stories - Flip Animation
        const userStoryCards = document.querySelectorAll('#section-9 .user-story-card');
        userStoryCards.forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'rotateY(180deg)';
                setTimeout(() => {
                    this.style.transform = 'rotateY(0deg)';
                }, 600);
            });
        });

        // INVEST Items - Letter Animation
        const investItems = document.querySelectorAll('#section-9 .invest-item');
        investItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            
            const letter = item.querySelector('.invest-letter');
            if (letter) {
                item.addEventListener('mouseenter', function() {
                    letter.style.animation = 'invest-letter-rotate 0.5s ease-out';
                });
            }
        });

        // Section 10: Gherkin Steps - Sequential Reveal
        const gherkinSteps = document.querySelectorAll('#section-10 .step');
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateX(-30px)';
                        entry.target.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 200);
                    
                    stepObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        gherkinSteps.forEach(step => {
            stepObserver.observe(step);
        });

        // Section 11: Actor Cards - 3D Flip
        const actorCards = document.querySelectorAll('#section-11 .actor-card');
        actorCards.forEach(card => {
            card.style.perspective = '1000px';
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'perspective(1000px) rotateY(5deg) translateY(-15px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0) scale(1)';
            });
        });

        // Use Case Cards - Stagger Animation
        const usecaseCards = document.querySelectorAll('#section-11 .usecase-card');
        const usecaseObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'scale(0.5) rotate(-180deg)';
                        entry.target.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1) rotate(0deg)';
                        }, 100);
                    }, index * 100);
                    
                    usecaseObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        usecaseCards.forEach(card => {
            usecaseObserver.observe(card);
        });

        // Section 12: Enhanced Storyboard Animations
        const storyboardPhases = document.querySelectorAll('#section-12 .storyboard-phase');
        storyboardPhases.forEach((phase, index) => {
            phase.style.animationDelay = `${index * 0.2}s`;
        });

        // Parallax Effect for Sections - integrated into unified scroll handler
        function handleSectionParallax() {
            const sections = document.querySelectorAll('.content-section');
            if (sections.length === 0) return;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const speed = 0.5;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(rect.top * speed);
                    const geometricPattern = section.querySelector('.geometric-pattern');
                    if (geometricPattern) {
                        geometricPattern.style.transform = `translateY(${yPos}px)`;
                    }
                }
            });
        }

        // Number Counter Animation
        function animateCounter(element, target, duration = 2000) {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + (element.textContent.includes('%') ? '%' : '');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
                }
            }, 16);
        }

        // Observe metric numbers
        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const metricNumber = entry.target.querySelector('.metric-number');
                    if (metricNumber && !metricNumber.dataset.animated) {
                        const text = metricNumber.textContent;
                        const number = parseInt(text.replace(/\D/g, ''));
                        if (!isNaN(number)) {
                            metricNumber.dataset.animated = 'true';
                            metricNumber.textContent = '0' + (text.includes('%') ? '%' : '');
                            animateCounter(metricNumber, number, 2000);
                        }
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.metric-box').forEach(box => {
            metricObserver.observe(box);
        });

        // Section Title Animation
        const sectionTitles = document.querySelectorAll('.content-section h2');
        sectionTitles.forEach(title => {
            const titleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'section-title-entrance 1s ease-out';
                        titleObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            titleObserver.observe(title);
        });

        // ============================================
        // PERSONA IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Persona image zoom state
        const personaZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const personaDragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const personaMinZoom = 0.5;
        const personaMaxZoom = 3;
        const personaZoomStep = 0.2;
        
        // Helper function to calculate distance between two touches
        function getDistance(touch1, touch2) {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        // Persona zoom functions
        function zoomInPersona() {
            if (personaZoomState.zoom < personaMaxZoom) {
                personaZoomState.zoom += personaZoomStep;
                applyPersonaZoom();
            }
        }
        
        function zoomOutPersona() {
            if (personaZoomState.zoom > personaMinZoom) {
                personaZoomState.zoom -= personaZoomStep;
                applyPersonaZoom();
            }
        }
        
        function resetZoomPersona() {
            personaZoomState.zoom = 1;
            personaZoomState.translateX = 0;
            personaZoomState.translateY = 0;
            personaZoomState.lastTranslateX = 0;
            personaZoomState.lastTranslateY = 0;
            applyPersonaZoom();
        }
        
        function applyPersonaZoom() {
            const image = document.getElementById('persona-image');
            if (image) {
                const state = personaZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize persona image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const personaImage = document.getElementById('persona-image');
            if (!personaImage) return;
            
            // Find the container by traversing up from the image
            const personaContainer = personaImage.closest('.persona-image-container');
            
            if (personaImage && personaContainer) {
                // Mouse wheel zoom - always work when over container
                personaContainer.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInPersona();
                    } else {
                        zoomOutPersona();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                personaImage.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInPersona();
                    } else {
                        zoomOutPersona();
                    }
                }, { passive: false });
                
                // Mouse drag events
                personaImage.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        personaDragState.isDragging = true;
                        personaDragState.startX = e.clientX - personaZoomState.translateX;
                        personaDragState.startY = e.clientY - personaZoomState.translateY;
                        personaImage.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (personaDragState.isDragging) {
                        personaZoomState.translateX = e.clientX - personaDragState.startX;
                        personaZoomState.translateY = e.clientY - personaDragState.startY;
                        
                        // Apply boundaries
                        const containerRect = personaContainer.getBoundingClientRect();
                        const imageRect = personaImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * personaZoomState.zoom;
                        const scaledHeight = imageRect.height * personaZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        personaZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, personaZoomState.translateX));
                        personaZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, personaZoomState.translateY));
                        
                        applyPersonaZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (personaDragState.isDragging) {
                        personaDragState.isDragging = false;
                        personaZoomState.lastTranslateX = personaZoomState.translateX;
                        personaZoomState.lastTranslateY = personaZoomState.translateY;
                        personaImage.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                personaImage.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                personaImage.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - personaZoomState.translateX;
                        touchStartY = e.touches[0].clientY - personaZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = personaZoomState.zoom;
                        initialTranslateX = personaZoomState.translateX;
                        initialTranslateY = personaZoomState.translateY;
                    }
                });
                
                personaImage.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        personaZoomState.translateX = e.touches[0].clientX - touchStartX;
                        personaZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = personaContainer.getBoundingClientRect();
                        const imageRect = personaImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * personaZoomState.zoom;
                        const scaledHeight = imageRect.height * personaZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        personaZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, personaZoomState.translateX));
                        personaZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, personaZoomState.translateY));
                        
                        applyPersonaZoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= personaMinZoom && newZoom <= personaMaxZoom) {
                            personaZoomState.zoom = newZoom;
                            applyPersonaZoom();
                        }
                    }
                });
            }
        });

        // ============================================
        // EMPATI IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Empati image zoom state
        const empatiZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const empatiDragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const empatiMinZoom = 0.5;
        const empatiMaxZoom = 3;
        const empatiZoomStep = 0.2;
        
        // Empati zoom functions
        function zoomInEmpati() {
            if (empatiZoomState.zoom < empatiMaxZoom) {
                empatiZoomState.zoom += empatiZoomStep;
                applyEmpatiZoom();
            }
        }
        
        function zoomOutEmpati() {
            if (empatiZoomState.zoom > empatiMinZoom) {
                empatiZoomState.zoom -= empatiZoomStep;
                applyEmpatiZoom();
            }
        }
        
        function resetZoomEmpati() {
            empatiZoomState.zoom = 1;
            empatiZoomState.translateX = 0;
            empatiZoomState.translateY = 0;
            empatiZoomState.lastTranslateX = 0;
            empatiZoomState.lastTranslateY = 0;
            applyEmpatiZoom();
        }
        
        function applyEmpatiZoom() {
            const image = document.getElementById('empati-image');
            if (image) {
                const state = empatiZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize empati image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const empatiImage = document.getElementById('empati-image');
            if (!empatiImage) return;
            
            // Find the container by traversing up from the image
            const empatiContainer = empatiImage.closest('.persona-image-container');
            
            if (empatiImage && empatiContainer) {
                // Mouse wheel zoom - always work when over container or image
                empatiContainer.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInEmpati();
                    } else {
                        zoomOutEmpati();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                empatiImage.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInEmpati();
                    } else {
                        zoomOutEmpati();
                    }
                }, { passive: false });
                
                // Mouse drag events
                empatiImage.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        empatiDragState.isDragging = true;
                        empatiDragState.startX = e.clientX - empatiZoomState.translateX;
                        empatiDragState.startY = e.clientY - empatiZoomState.translateY;
                        empatiImage.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (empatiDragState.isDragging) {
                        empatiZoomState.translateX = e.clientX - empatiDragState.startX;
                        empatiZoomState.translateY = e.clientY - empatiDragState.startY;
                        
                        // Apply boundaries
                        const containerRect = empatiContainer.getBoundingClientRect();
                        const imageRect = empatiImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * empatiZoomState.zoom;
                        const scaledHeight = imageRect.height * empatiZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        empatiZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, empatiZoomState.translateX));
                        empatiZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, empatiZoomState.translateY));
                        
                        applyEmpatiZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (empatiDragState.isDragging) {
                        empatiDragState.isDragging = false;
                        empatiZoomState.lastTranslateX = empatiZoomState.translateX;
                        empatiZoomState.lastTranslateY = empatiZoomState.translateY;
                        empatiImage.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                empatiImage.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                empatiImage.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - empatiZoomState.translateX;
                        touchStartY = e.touches[0].clientY - empatiZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = empatiZoomState.zoom;
                        initialTranslateX = empatiZoomState.translateX;
                        initialTranslateY = empatiZoomState.translateY;
                    }
                });
                
                empatiImage.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        empatiZoomState.translateX = e.touches[0].clientX - touchStartX;
                        empatiZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = empatiContainer.getBoundingClientRect();
                        const imageRect = empatiImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * empatiZoomState.zoom;
                        const scaledHeight = imageRect.height * empatiZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        empatiZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, empatiZoomState.translateX));
                        empatiZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, empatiZoomState.translateY));
                        
                        applyEmpatiZoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= empatiMinZoom && newZoom <= empatiMaxZoom) {
                            empatiZoomState.zoom = newZoom;
                            applyEmpatiZoom();
                        }
                    }
                });
            }
        });

        // ============================================
        // PIRAMIT IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Piramit image zoom state
        const piramitZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const piramitDragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const piramitMinZoom = 0.5;
        const piramitMaxZoom = 3;
        const piramitZoomStep = 0.2;
        
        // Piramit zoom functions
        function zoomInPiramit() {
            if (piramitZoomState.zoom < piramitMaxZoom) {
                piramitZoomState.zoom += piramitZoomStep;
                applyPiramitZoom();
            }
        }
        
        function zoomOutPiramit() {
            if (piramitZoomState.zoom > piramitMinZoom) {
                piramitZoomState.zoom -= piramitZoomStep;
                applyPiramitZoom();
            }
        }
        
        function resetZoomPiramit() {
            piramitZoomState.zoom = 1;
            piramitZoomState.translateX = 0;
            piramitZoomState.translateY = 0;
            piramitZoomState.lastTranslateX = 0;
            piramitZoomState.lastTranslateY = 0;
            applyPiramitZoom();
        }
        
        function applyPiramitZoom() {
            const image = document.getElementById('piramit-image');
            if (image) {
                const state = piramitZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize piramit image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const piramitImage = document.getElementById('piramit-image');
            if (!piramitImage) return;
            
            // Find the container by traversing up from the image
            const piramitContainer = piramitImage.closest('.persona-image-container');
            
            if (piramitImage && piramitContainer) {
                // Mouse wheel zoom - always work when over container
                piramitContainer.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInPiramit();
                    } else {
                        zoomOutPiramit();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                piramitImage.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInPiramit();
                    } else {
                        zoomOutPiramit();
                    }
                }, { passive: false });
                
                // Mouse drag events
                piramitImage.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        piramitDragState.isDragging = true;
                        piramitDragState.startX = e.clientX - piramitZoomState.translateX;
                        piramitDragState.startY = e.clientY - piramitZoomState.translateY;
                        piramitImage.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (piramitDragState.isDragging) {
                        piramitZoomState.translateX = e.clientX - piramitDragState.startX;
                        piramitZoomState.translateY = e.clientY - piramitDragState.startY;
                        
                        // Apply boundaries
                        const containerRect = piramitContainer.getBoundingClientRect();
                        const imageRect = piramitImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * piramitZoomState.zoom;
                        const scaledHeight = imageRect.height * piramitZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        piramitZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, piramitZoomState.translateX));
                        piramitZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, piramitZoomState.translateY));
                        
                        applyPiramitZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (piramitDragState.isDragging) {
                        piramitDragState.isDragging = false;
                        piramitZoomState.lastTranslateX = piramitZoomState.translateX;
                        piramitZoomState.lastTranslateY = piramitZoomState.translateY;
                        piramitImage.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                piramitImage.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                piramitImage.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - piramitZoomState.translateX;
                        touchStartY = e.touches[0].clientY - piramitZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = piramitZoomState.zoom;
                        initialTranslateX = piramitZoomState.translateX;
                        initialTranslateY = piramitZoomState.translateY;
                    }
                });
                
                piramitImage.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        piramitZoomState.translateX = e.touches[0].clientX - touchStartX;
                        piramitZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = piramitContainer.getBoundingClientRect();
                        const imageRect = piramitImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * piramitZoomState.zoom;
                        const scaledHeight = imageRect.height * piramitZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        piramitZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, piramitZoomState.translateX));
                        piramitZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, piramitZoomState.translateY));
                        
                        applyPiramitZoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= piramitMinZoom && newZoom <= piramitMaxZoom) {
                            piramitZoomState.zoom = newZoom;
                            applyPiramitZoom();
                        }
                    }
                });
            }
        });

        // ============================================
        // KANO IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Kano image zoom state
        const kanoZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const kanoDragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const kanoMinZoom = 0.5;
        const kanoMaxZoom = 3;
        const kanoZoomStep = 0.2;
        
        // Kano zoom functions
        function zoomInKano() {
            if (kanoZoomState.zoom < kanoMaxZoom) {
                kanoZoomState.zoom += kanoZoomStep;
                applyKanoZoom();
            }
        }
        
        function zoomOutKano() {
            if (kanoZoomState.zoom > kanoMinZoom) {
                kanoZoomState.zoom -= kanoZoomStep;
                applyKanoZoom();
            }
        }
        
        function resetZoomKano() {
            kanoZoomState.zoom = 1;
            kanoZoomState.translateX = 0;
            kanoZoomState.translateY = 0;
            kanoZoomState.lastTranslateX = 0;
            kanoZoomState.lastTranslateY = 0;
            applyKanoZoom();
        }
        
        function applyKanoZoom() {
            const image = document.getElementById('kano-image');
            if (image) {
                const state = kanoZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize kano image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const kanoImage = document.getElementById('kano-image');
            if (!kanoImage) return;
            
            // Find the container by traversing up from the image
            const kanoContainer = kanoImage.closest('.persona-image-container');
            
            if (kanoImage && kanoContainer) {
                // Mouse wheel zoom - always work when over container
                kanoContainer.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInKano();
                    } else {
                        zoomOutKano();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                kanoImage.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInKano();
                    } else {
                        zoomOutKano();
                    }
                }, { passive: false });
                
                // Mouse drag events
                kanoImage.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        kanoDragState.isDragging = true;
                        kanoDragState.startX = e.clientX - kanoZoomState.translateX;
                        kanoDragState.startY = e.clientY - kanoZoomState.translateY;
                        kanoImage.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (kanoDragState.isDragging) {
                        kanoZoomState.translateX = e.clientX - kanoDragState.startX;
                        kanoZoomState.translateY = e.clientY - kanoDragState.startY;
                        
                        // Apply boundaries
                        const containerRect = kanoContainer.getBoundingClientRect();
                        const imageRect = kanoImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * kanoZoomState.zoom;
                        const scaledHeight = imageRect.height * kanoZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        kanoZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, kanoZoomState.translateX));
                        kanoZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, kanoZoomState.translateY));
                        
                        applyKanoZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (kanoDragState.isDragging) {
                        kanoDragState.isDragging = false;
                        kanoZoomState.lastTranslateX = kanoZoomState.translateX;
                        kanoZoomState.lastTranslateY = kanoZoomState.translateY;
                        kanoImage.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                kanoImage.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                kanoImage.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - kanoZoomState.translateX;
                        touchStartY = e.touches[0].clientY - kanoZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = kanoZoomState.zoom;
                        initialTranslateX = kanoZoomState.translateX;
                        initialTranslateY = kanoZoomState.translateY;
                    }
                });
                
                kanoImage.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        kanoZoomState.translateX = e.touches[0].clientX - touchStartX;
                        kanoZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = kanoContainer.getBoundingClientRect();
                        const imageRect = kanoImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * kanoZoomState.zoom;
                        const scaledHeight = imageRect.height * kanoZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        kanoZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, kanoZoomState.translateX));
                        kanoZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, kanoZoomState.translateY));
                        
                        applyKanoZoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= kanoMinZoom && newZoom <= kanoMaxZoom) {
                            kanoZoomState.zoom = newZoom;
                            applyKanoZoom();
                        }
                    }
                });
            }
        });

        // ============================================
        // SENARYO IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Senaryo image zoom state
        const senaryoZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const senaryoDragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const senaryoMinZoom = 0.5;
        const senaryoMaxZoom = 3;
        const senaryoZoomStep = 0.2;
        
        // Senaryo zoom functions
        function zoomInSenaryo() {
            if (senaryoZoomState.zoom < senaryoMaxZoom) {
                senaryoZoomState.zoom += senaryoZoomStep;
                applySenaryoZoom();
            }
        }
        
        function zoomOutSenaryo() {
            if (senaryoZoomState.zoom > senaryoMinZoom) {
                senaryoZoomState.zoom -= senaryoZoomStep;
                applySenaryoZoom();
            }
        }
        
        function resetZoomSenaryo() {
            senaryoZoomState.zoom = 1;
            senaryoZoomState.translateX = 0;
            senaryoZoomState.translateY = 0;
            senaryoZoomState.lastTranslateX = 0;
            senaryoZoomState.lastTranslateY = 0;
            applySenaryoZoom();
        }
        
        function applySenaryoZoom() {
            const image = document.getElementById('senaryo-image');
            if (image) {
                const state = senaryoZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize senaryo image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const senaryoImage = document.getElementById('senaryo-image');
            if (!senaryoImage) return;
            
            // Find the container by traversing up from the image
            const senaryoContainer = senaryoImage.closest('.persona-image-container');
            
            if (senaryoImage && senaryoContainer) {
                // Mouse wheel zoom - always work when over container
                senaryoContainer.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInSenaryo();
                    } else {
                        zoomOutSenaryo();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                senaryoImage.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInSenaryo();
                    } else {
                        zoomOutSenaryo();
                    }
                }, { passive: false });
                
                // Mouse drag events
                senaryoImage.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        senaryoDragState.isDragging = true;
                        senaryoDragState.startX = e.clientX - senaryoZoomState.translateX;
                        senaryoDragState.startY = e.clientY - senaryoZoomState.translateY;
                        senaryoImage.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (senaryoDragState.isDragging) {
                        senaryoZoomState.translateX = e.clientX - senaryoDragState.startX;
                        senaryoZoomState.translateY = e.clientY - senaryoDragState.startY;
                        
                        // Apply boundaries
                        const containerRect = senaryoContainer.getBoundingClientRect();
                        const imageRect = senaryoImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * senaryoZoomState.zoom;
                        const scaledHeight = imageRect.height * senaryoZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        senaryoZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, senaryoZoomState.translateX));
                        senaryoZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, senaryoZoomState.translateY));
                        
                        applySenaryoZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (senaryoDragState.isDragging) {
                        senaryoDragState.isDragging = false;
                        senaryoZoomState.lastTranslateX = senaryoZoomState.translateX;
                        senaryoZoomState.lastTranslateY = senaryoZoomState.translateY;
                        senaryoImage.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                senaryoImage.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                senaryoImage.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - senaryoZoomState.translateX;
                        touchStartY = e.touches[0].clientY - senaryoZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = senaryoZoomState.zoom;
                        initialTranslateX = senaryoZoomState.translateX;
                        initialTranslateY = senaryoZoomState.translateY;
                    }
                });
                
                senaryoImage.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        senaryoZoomState.translateX = e.touches[0].clientX - touchStartX;
                        senaryoZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = senaryoContainer.getBoundingClientRect();
                        const imageRect = senaryoImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * senaryoZoomState.zoom;
                        const scaledHeight = imageRect.height * senaryoZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        senaryoZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, senaryoZoomState.translateX));
                        senaryoZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, senaryoZoomState.translateY));
                        
                        applySenaryoZoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= senaryoMinZoom && newZoom <= senaryoMaxZoom) {
                            senaryoZoomState.zoom = newZoom;
                            applySenaryoZoom();
                        }
                    }
                });
            }
        });

        // ============================================
        // ILISKI IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // Iliski image zoom state
        const iliskiZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const iliskiDragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const iliskiMinZoom = 0.5;
        const iliskiMaxZoom = 3;
        const iliskiZoomStep = 0.2;
        
        // Iliski zoom functions
        function zoomInIliski() {
            if (iliskiZoomState.zoom < iliskiMaxZoom) {
                iliskiZoomState.zoom += iliskiZoomStep;
                applyIliskiZoom();
            }
        }
        
        function zoomOutIliski() {
            if (iliskiZoomState.zoom > iliskiMinZoom) {
                iliskiZoomState.zoom -= iliskiZoomStep;
                applyIliskiZoom();
            }
        }
        
        function resetZoomIliski() {
            iliskiZoomState.zoom = 1;
            iliskiZoomState.translateX = 0;
            iliskiZoomState.translateY = 0;
            iliskiZoomState.lastTranslateX = 0;
            iliskiZoomState.lastTranslateY = 0;
            applyIliskiZoom();
        }
        
        function applyIliskiZoom() {
            const image = document.getElementById('iliski-image');
            if (image) {
                const state = iliskiZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize iliski image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const iliskiImage = document.getElementById('iliski-image');
            if (!iliskiImage) return;
            
            // Find the container by traversing up from the image
            const iliskiContainer = iliskiImage.closest('.persona-image-container');
            
            if (iliskiImage && iliskiContainer) {
                // Mouse wheel zoom - always work when over container
                iliskiContainer.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInIliski();
                    } else {
                        zoomOutIliski();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                iliskiImage.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInIliski();
                    } else {
                        zoomOutIliski();
                    }
                }, { passive: false });
                
                // Mouse drag events
                iliskiImage.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        iliskiDragState.isDragging = true;
                        iliskiDragState.startX = e.clientX - iliskiZoomState.translateX;
                        iliskiDragState.startY = e.clientY - iliskiZoomState.translateY;
                        iliskiImage.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (iliskiDragState.isDragging) {
                        iliskiZoomState.translateX = e.clientX - iliskiDragState.startX;
                        iliskiZoomState.translateY = e.clientY - iliskiDragState.startY;
                        
                        // Apply boundaries
                        const containerRect = iliskiContainer.getBoundingClientRect();
                        const imageRect = iliskiImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * iliskiZoomState.zoom;
                        const scaledHeight = imageRect.height * iliskiZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        iliskiZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, iliskiZoomState.translateX));
                        iliskiZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, iliskiZoomState.translateY));
                        
                        applyIliskiZoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (iliskiDragState.isDragging) {
                        iliskiDragState.isDragging = false;
                        iliskiZoomState.lastTranslateX = iliskiZoomState.translateX;
                        iliskiZoomState.lastTranslateY = iliskiZoomState.translateY;
                        iliskiImage.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                iliskiImage.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                iliskiImage.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - iliskiZoomState.translateX;
                        touchStartY = e.touches[0].clientY - iliskiZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = iliskiZoomState.zoom;
                        initialTranslateX = iliskiZoomState.translateX;
                        initialTranslateY = iliskiZoomState.translateY;
                    }
                });
                
                iliskiImage.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        iliskiZoomState.translateX = e.touches[0].clientX - touchStartX;
                        iliskiZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = iliskiContainer.getBoundingClientRect();
                        const imageRect = iliskiImage.getBoundingClientRect();
                        const scaledWidth = imageRect.width * iliskiZoomState.zoom;
                        const scaledHeight = imageRect.height * iliskiZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        iliskiZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, iliskiZoomState.translateX));
                        iliskiZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, iliskiZoomState.translateY));
                        
                        applyIliskiZoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= iliskiMinZoom && newZoom <= iliskiMaxZoom) {
                            iliskiZoomState.zoom = newZoom;
                            applyIliskiZoom();
                        }
                    }
                });
            }
        });

        // ============================================
        // BPM2 IMAGE ZOOM & DRAG FUNCTIONALITY
        // ============================================
        
        // BPM2 image zoom state
        const bpm2ZoomState = {
            zoom: 1,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };
        
        const bpm2DragState = {
            isDragging: false,
            startX: 0,
            startY: 0
        };
        
        const bpm2MinZoom = 0.5;
        const bpm2MaxZoom = 3;
        const bpm2ZoomStep = 0.2;
        
        // BPM2 zoom functions
        function zoomInBpm2() {
            if (bpm2ZoomState.zoom < bpm2MaxZoom) {
                bpm2ZoomState.zoom += bpm2ZoomStep;
                applyBpm2Zoom();
            }
        }
        
        function zoomOutBpm2() {
            if (bpm2ZoomState.zoom > bpm2MinZoom) {
                bpm2ZoomState.zoom -= bpm2ZoomStep;
                applyBpm2Zoom();
            }
        }
        
        function resetZoomBpm2() {
            bpm2ZoomState.zoom = 1;
            bpm2ZoomState.translateX = 0;
            bpm2ZoomState.translateY = 0;
            bpm2ZoomState.lastTranslateX = 0;
            bpm2ZoomState.lastTranslateY = 0;
            applyBpm2Zoom();
        }
        
        function applyBpm2Zoom() {
            const image = document.getElementById('bpm2-image');
            if (image) {
                const state = bpm2ZoomState;
                image.style.transform = `scale(${state.zoom}) translate(${state.translateX}px, ${state.translateY}px)`;
            }
        }
        
        // Initialize bpm2 image functionality
        document.addEventListener('DOMContentLoaded', function() {
            const bpm2Image = document.getElementById('bpm2-image');
            if (!bpm2Image) return;
            
            // Find the container by traversing up from the image
            const bpm2Container = bpm2Image.closest('.persona-image-container');
            
            if (bpm2Image && bpm2Container) {
                // Mouse wheel zoom - always work when over container
                bpm2Container.addEventListener('wheel', function(e) {
                    // Always allow zoom when over the container
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInBpm2();
                    } else {
                        zoomOutBpm2();
                    }
                }, { passive: false });
                
                // Also add wheel listener directly to image for better control
                bpm2Image.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        zoomInBpm2();
                    } else {
                        zoomOutBpm2();
                    }
                }, { passive: false });
                
                // Mouse drag events
                bpm2Image.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // Left mouse button
                        bpm2DragState.isDragging = true;
                        bpm2DragState.startX = e.clientX - bpm2ZoomState.translateX;
                        bpm2DragState.startY = e.clientY - bpm2ZoomState.translateY;
                        bpm2Image.classList.add('dragging');
                        e.preventDefault();
                    }
                });
                
                document.addEventListener('mousemove', function(e) {
                    if (bpm2DragState.isDragging) {
                        bpm2ZoomState.translateX = e.clientX - bpm2DragState.startX;
                        bpm2ZoomState.translateY = e.clientY - bpm2DragState.startY;
                        
                        // Apply boundaries
                        const containerRect = bpm2Container.getBoundingClientRect();
                        const imageRect = bpm2Image.getBoundingClientRect();
                        const scaledWidth = imageRect.width * bpm2ZoomState.zoom;
                        const scaledHeight = imageRect.height * bpm2ZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        bpm2ZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, bpm2ZoomState.translateX));
                        bpm2ZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, bpm2ZoomState.translateY));
                        
                        applyBpm2Zoom();
                    }
                });
                
                document.addEventListener('mouseup', function() {
                    if (bpm2DragState.isDragging) {
                        bpm2DragState.isDragging = false;
                        bpm2ZoomState.lastTranslateX = bpm2ZoomState.translateX;
                        bpm2ZoomState.lastTranslateY = bpm2ZoomState.translateY;
                        bpm2Image.classList.remove('dragging');
                    }
                });
                
                // Context menu prevention
                bpm2Image.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
                
                // Touch zoom and drag support
                let initialDistance = 0;
                let initialZoom = 1;
                let initialTranslateX = 0;
                let initialTranslateY = 0;
                let touchStartX = 0;
                let touchStartY = 0;
                
                bpm2Image.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        touchStartX = e.touches[0].clientX - bpm2ZoomState.translateX;
                        touchStartY = e.touches[0].clientY - bpm2ZoomState.translateY;
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        initialDistance = getDistance(e.touches[0], e.touches[1]);
                        initialZoom = bpm2ZoomState.zoom;
                        initialTranslateX = bpm2ZoomState.translateX;
                        initialTranslateY = bpm2ZoomState.translateY;
                    }
                });
                
                bpm2Image.addEventListener('touchmove', function(e) {
                    if (e.touches.length === 1) {
                        // Single touch - drag
                        e.preventDefault();
                        bpm2ZoomState.translateX = e.touches[0].clientX - touchStartX;
                        bpm2ZoomState.translateY = e.touches[0].clientY - touchStartY;
                        
                        // Apply boundaries
                        const containerRect = bpm2Container.getBoundingClientRect();
                        const imageRect = bpm2Image.getBoundingClientRect();
                        const scaledWidth = imageRect.width * bpm2ZoomState.zoom;
                        const scaledHeight = imageRect.height * bpm2ZoomState.zoom;
                        
                        const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2);
                        const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2);
                        
                        bpm2ZoomState.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, bpm2ZoomState.translateX));
                        bpm2ZoomState.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, bpm2ZoomState.translateY));
                        
                        applyBpm2Zoom();
                    } else if (e.touches.length === 2) {
                        // Two touches - zoom
                        e.preventDefault();
                        const currentDistance = getDistance(e.touches[0], e.touches[1]);
                        const scale = currentDistance / initialDistance;
                        const newZoom = initialZoom * scale;
                        
                        if (newZoom >= bpm2MinZoom && newZoom <= bpm2MaxZoom) {
                            bpm2ZoomState.zoom = newZoom;
                            applyBpm2Zoom();
                        }
                    }
                });
            }
        });

        // Add title animation keyframes
        const titleAnimationStyle = document.createElement('style');
        titleAnimationStyle.textContent = `
            @keyframes section-title-entrance {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(titleAnimationStyle);

        // ============================================
        // WIREFRAME INTERACTIVE FUNCTIONALITY
        // ============================================
        
        // Kiralama gün sayısı kontrolü
        function increaseDays() {
            const daysInput = document.getElementById('rental-days');
            if (daysInput) {
                const currentValue = parseInt(daysInput.value) || 1;
                daysInput.value = currentValue + 1;
            }
        }
        
        function decreaseDays() {
            const daysInput = document.getElementById('rental-days');
            if (daysInput) {
                const currentValue = parseInt(daysInput.value) || 1;
                if (currentValue > 1) {
                    daysInput.value = currentValue - 1;
                }
            }
        }
        
        // Sözleşme oluşturma simülasyonu
        function createContract() {
            const daysInput = document.getElementById('rental-days');
            const days = daysInput ? parseInt(daysInput.value) || 3 : 3;
            
            // Basit bir bildirim göster
            alert(`✅ Dijital sözleşme başarıyla oluşturuldu!\n\nKiralama süresi: ${days} gün\nRisk skoru: 85 (Güvenli)\n\nSözleşme PDF formatında hazır.`);
        }
        
        // Müşteriye yansıtma simülasyonu
        function reflectToCustomer() {
            // Basit bir bildirim göster
            alert('✅ Ceza başarıyla müşteriye yansıtıldı!\n\nCeza tutarı müşterinin cari hesabına borç olarak kaydedildi.\nMüşteriye bildirim gönderildi.');
        }

        // ============================================
        // WIREFRAME NAVIGATION SYSTEM
        // ============================================
        
        // Wireframe sayfa geçişi - İlk container için
        function navigateToWireframePage(pageName) {
            const containerId = 'wireframe-main';
            const sidebarId = 'wireframe-sidebar';
            
            // Sadece ilgili container içindeki sayfaları gizle
            const mainContainer = document.getElementById(containerId);
            if (!mainContainer) return;
            
            const allPages = mainContainer.querySelectorAll('.wireframe-page');
            allPages.forEach(page => {
                page.style.display = 'none';
            });
            
            // Seçilen sayfayı göster
            const targetPage = mainContainer.querySelector(`.wireframe-page[data-page="${pageName}"]`);
            if (targetPage) {
                // Sayfa tipine göre display özelliğini ayarla
                if (targetPage.querySelector('iframe')) {
                    // Iframe içeren sayfalar için block
                    targetPage.style.display = 'block';
                    targetPage.style.overflow = 'hidden';
                } else {
                    // Direkt HTML içeren sayfalar için block (içerik flex kullanabilir)
                    targetPage.style.display = 'block';
                    // Scroll edilebilir içerik için overflow-y-auto
                    targetPage.style.overflow = '';
                }
                // Container'ın yüksekliğini ve genişliğini koru
                targetPage.style.height = '100%';
                targetPage.style.width = '100%';
            }
            
            // Navigasyon menüsündeki aktif durumu güncelle - sadece ilgili sidebar
            const sidebar = document.getElementById(sidebarId);
            if (sidebar) {
                const allNavItems = sidebar.querySelectorAll('.wireframe-nav-item');
                allNavItems.forEach(item => {
                    item.classList.remove('bg-primary/10', 'text-primary', 'border', 'border-primary/20');
                    item.classList.add('text-text-sub');
                });
                
                const activeNavItem = sidebar.querySelector(`.wireframe-nav-item[data-page="${pageName}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.remove('text-text-sub');
                    activeNavItem.classList.add('bg-primary/10', 'text-primary', 'border', 'border-primary/20');
                }
            }
        }
        
        // Wireframe sayfasını dinamik olarak yükle
        async function loadWireframePage(pageName, targetPage) {
            try {
                const response = await fetch(`wireframe/${pageName}.html`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${pageName}.html`);
                }
                const html = await response.text();
                
                // HTML'i parse et ve main içeriğini al
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Body içindeki ana container'ı bul (flex h-screen olan div)
                const bodyContent = doc.body;
                let mainContainer = bodyContent.querySelector('div.flex.h-screen') || 
                                    bodyContent.querySelector('div.flex') || 
                                    bodyContent.querySelector('body > div');
                
                if (!mainContainer && bodyContent.children.length > 0) {
                    // İlk div'i al veya main içeren div'i bul
                    mainContainer = Array.from(bodyContent.children).find(child => 
                        child.tagName === 'DIV' && (child.querySelector('main') || child.querySelector('aside'))
                    ) || bodyContent.children[0];
                }
                
                if (mainContainer) {
                    // Wireframe'in kendi sidebar'ını kaldır
                    const sidebar = mainContainer.querySelector('aside');
                    if (sidebar) sidebar.remove();
                    
                    // Main içeriğini bul
                    let mainContent = mainContainer.querySelector('main');
                    if (!mainContent) {
                        // Eğer main yoksa, container'ın kendisini kullan ama layout class'larını kaldır
                        mainContent = mainContainer;
                    }
                    
                    // MainContent'i clone et (DOM'dan çıkarmadan önce)
                    const clonedContent = mainContent.cloneNode(true);
                    
                    // Clone'un layout class'larını kaldır
                    const layoutClasses = ['flex', 'flex-1', 'flex-col', 'h-screen', 'w-full', 'min-h-screen', 'overflow-hidden', 'overflow-x-hidden', 'antialiased', 'min-w-0'];
                    layoutClasses.forEach(cls => {
                        if (clonedContent.classList) {
                            clonedContent.classList.remove(cls);
                        }
                    });
                    
                    // Clone'un style'ını ayarla - sidebar'ın yanında görünmesi için
                    clonedContent.style.cssText = 'width: 100% !important; max-width: 100% !important; height: auto !important; min-height: 100% !important; display: block !important; position: relative !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; float: none !important; margin-left: 0 !important; margin-right: 0 !important;';
                    
                    // Clone içindeki tüm flex h-screen yapılarını da düzelt
                    const allFlexScreens = clonedContent.querySelectorAll('.flex.h-screen, .flex.h-screen.w-full');
                    allFlexScreens.forEach(el => {
                        el.classList.remove('flex', 'h-screen', 'w-full');
                        el.style.cssText = 'display: block !important; width: 100% !important; height: auto !important; min-height: 100% !important;';
                    });
                    
                    // İçeriği wrapper div'e koy
                    const wrapper = document.createElement('div');
                    wrapper.className = 'wireframe-content-wrapper';
                    wrapper.style.cssText = 'width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative;';
                    wrapper.appendChild(clonedContent);
                    
                    // İçeriği güncelle
                    targetPage.innerHTML = '';
                    targetPage.appendChild(wrapper);
                    targetPage.style.display = 'block';
                } else {
                    targetPage.innerHTML = '<div class="p-8 text-center text-text-sub"><p>Sayfa içeriği yüklenemedi.</p></div>';
                }
            } catch (error) {
                console.error(`Error loading wireframe page ${pageName}:`, error);
                targetPage.innerHTML = `<div class="p-8 text-center text-text-sub"><p>Sayfa yüklenirken bir hata oluştu: ${error.message}</p></div>`;
            }
        }
        
        // Wireframe sayfa geçişi - İkinci container için
        function navigateToWireframePage2(pageName) {
            const containerId = 'wireframe-main-2';
            const sidebarId = 'wireframe-sidebar-2';
            
            // Sadece ilgili container içindeki sayfaları gizle
            const mainContainer = document.getElementById(containerId);
            if (!mainContainer) return;
            
            const allPages = mainContainer.querySelectorAll('.wireframe-page');
            allPages.forEach(page => {
                page.style.display = 'none';
            });
            
            // Seçilen sayfayı göster
            const targetPage = mainContainer.querySelector(`.wireframe-page[data-page="${pageName}"]`);
            if (targetPage) {
                // Sayfa tipine göre display özelliğini ayarla
                if (targetPage.querySelector('iframe')) {
                    // Iframe içeren sayfalar için block
                    targetPage.style.display = 'block';
                    targetPage.style.overflow = 'hidden';
                } else {
                    // Direkt HTML içeren sayfalar için block (içerik flex kullanabilir)
                    targetPage.style.display = 'block';
                    // Scroll edilebilir içerik için overflow-y-auto
                    targetPage.style.overflow = '';
                }
                // Container'ın yüksekliğini ve genişliğini koru
                targetPage.style.height = '100%';
                targetPage.style.width = '100%';
            }
            
            // Navigasyon menüsündeki aktif durumu güncelle - sadece ilgili sidebar
            const sidebar = document.getElementById(sidebarId);
            if (sidebar) {
                const allNavItems = sidebar.querySelectorAll('.wireframe-nav-item');
                allNavItems.forEach(item => {
                    item.classList.remove('bg-primary/10', 'text-primary', 'border', 'border-primary/20');
                    item.classList.add('text-text-sub');
                });
                
                const activeNavItem = sidebar.querySelector(`.wireframe-nav-item[data-page="${pageName}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.remove('text-text-sub');
                    activeNavItem.classList.add('bg-primary/10', 'text-primary', 'border', 'border-primary/20');
                }
            }
        }
        
        // Wireframe sayfasını dinamik olarak yükle - İkinci container için
        async function loadWireframePage2(pageName, targetPage) {
            try {
                const response = await fetch(`wireframe/${pageName}.html`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${pageName}.html`);
                }
                const html = await response.text();
                
                // HTML'i parse et ve main içeriğini al
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Body içindeki ana container'ı bul
                const bodyContent = doc.body;
                let mainContainer = bodyContent.querySelector('div.flex.h-screen') || 
                                    bodyContent.querySelector('div.flex') || 
                                    bodyContent.querySelector('body > div');
                
                if (!mainContainer && bodyContent.children.length > 0) {
                    mainContainer = Array.from(bodyContent.children).find(child => 
                        child.tagName === 'DIV' && (child.querySelector('main') || child.querySelector('aside'))
                    ) || bodyContent.children[0];
                }
                
                if (mainContainer) {
                    // Wireframe'in kendi sidebar'ını kaldır
                    const sidebar = mainContainer.querySelector('aside');
                    if (sidebar) sidebar.remove();
                    
                    // Main içeriğini bul
                    let mainContent = mainContainer.querySelector('main');
                    if (!mainContent) {
                        mainContent = mainContainer;
                    }
                    
                    // MainContent'i clone et
                    const clonedContent = mainContent.cloneNode(true);
                    
                    // Clone'un layout class'larını kaldır
                    const layoutClasses = ['flex', 'flex-1', 'flex-col', 'h-screen', 'w-full', 'min-h-screen', 'overflow-hidden', 'overflow-x-hidden', 'antialiased', 'min-w-0'];
                    layoutClasses.forEach(cls => {
                        if (clonedContent.classList) {
                            clonedContent.classList.remove(cls);
                        }
                    });
                    
                    // Clone'un style'ını ayarla
                    clonedContent.style.cssText = 'width: 100% !important; max-width: 100% !important; height: auto !important; min-height: 100% !important; display: block !important; position: relative !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; float: none !important; margin-left: 0 !important; margin-right: 0 !important;';
                    
                    // Clone içindeki tüm flex h-screen yapılarını da düzelt
                    const allFlexScreens = clonedContent.querySelectorAll('.flex.h-screen, .flex.h-screen.w-full');
                    allFlexScreens.forEach(el => {
                        el.classList.remove('flex', 'h-screen', 'w-full');
                        el.style.cssText = 'display: block !important; width: 100% !important; height: auto !important; min-height: 100% !important;';
                    });
                    
                    // İçeriği wrapper div'e koy
                    const wrapper = document.createElement('div');
                    wrapper.className = 'wireframe-content-wrapper';
                    wrapper.style.cssText = 'width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative;';
                    wrapper.appendChild(clonedContent);
                    
                    // İçeriği güncelle
                    targetPage.innerHTML = '';
                    targetPage.appendChild(wrapper);
                    targetPage.style.display = 'block';
                } else {
                    targetPage.innerHTML = '<div class="p-8 text-center text-text-sub"><p>Sayfa içeriği yüklenemedi.</p></div>';
                }
            } catch (error) {
                console.error(`Error loading wireframe page ${pageName}:`, error);
                targetPage.innerHTML = `<div class="p-8 text-center text-text-sub"><p>Sayfa yüklenirken bir hata oluştu: ${error.message}</p></div>`;
            }
        }
        
        // Sayfa yüklendiğinde ilk sayfayı aktif yap
        document.addEventListener('DOMContentLoaded', function() {
            // İlk sayfayı aktif yap
            const firstNavItem = document.querySelector('.wireframe-nav-item[data-page="yeni-kiralama"]');
            if (firstNavItem) {
                firstNavItem.classList.add('bg-primary/10', 'text-primary', 'border', 'border-primary/20');
                firstNavItem.classList.remove('text-text-sub');
            }
        });