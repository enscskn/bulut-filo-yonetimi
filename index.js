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
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    if (!prefersReducedMotion) {
                        updateScrollEffects();
                    }
                    scrollTimeout = null;
                }, 16); // ~60fps
            }
        }, { passive: true });

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
        function handleParallax() {
            const parallaxElements = document.querySelectorAll('.parallax');
            const scrolled = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }

        window.addEventListener('scroll', handleParallax);

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
        // PROGRESS BAR
        // ============================================
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            document.getElementById('progress-bar').style.width = scrolled + '%';
        });



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

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
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
        });

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
            '👥 İnsan': {
                color: '#3b82f6',
                items: ['Yetersiz eğitim', 'Yüksek personel devri', 'Manuel veri girişi hataları', 'İletişim problemleri']
            },
            '⚙️ Süreç': {
                color: '#10b981',
                items: ['Karmaşık onay mekanizması', 'Standardize edilmemiş adımlar', 'Gereksiz bekleme süreleri', 'Çoklu kontrol noktaları']
            },
            '💻 Teknoloji': {
                color: '#8b5cf6',
                items: ['Eski yazılım sistemleri', 'Entegrasyon eksikliği', 'Yetersiz otomasyon', 'Mobil erişim sınırlılığı']
            },
            '📋 Materyal': {
                color: '#f59e0b',
                items: ['Kağıt bazlı belgeler', 'Güncel olmayan formlar', 'Dağınık veri kaynakları', 'Tutarsız şablonlar']
            },
            '🌍 Çevre': {
                color: '#06b6d4',
                items: ['Fiziksel ofis bağımlılığı', 'Sınırlı çalışma saatleri', 'Bölgesel kısıtlamalar', 'Değişken talep yoğunluğu']
            },
            '📏 Ölçüm': {
                color: '#ef4444',
                items: ['Yetersiz KPI takibi', 'Manuel raporlama', 'Gerçek zamanlı veri eksikliği', 'Analitik araçlar yetersiz']
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
        // APEXCHARTS - COMPARISON CHARTS
        // ============================================

        // AS-IS vs TO-BE Comparison Chart
        function createComparisonChart() {
            const container = document.createElement('div');
            container.id = 'comparison-chart';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '300');
                    chartCard.innerHTML = '<h3>📊 AS-IS vs TO-BE Karşılaştırması</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const comparisonOptions = {
                        series: [{
                            name: 'Mevcut Durum (AS-IS)',
                            data: [45, 12, 4, 500]
                        }, {
                            name: 'Hedef Durum (TO-BE)',
                            data: [15, 2, 1, 100]
                        }],
                        chart: {
                            type: 'bar',
                            height: 350,
                            fontFamily: 'Inter, sans-serif',
                            toolbar: {
                                show: true,
                                tools: {
                                    download: '<svg>...</svg>',
                                    selection: false,
                                    zoom: true,
                                    zoomin: true,
                                    zoomout: true,
                                    pan: false,
                                    reset: true
                                },
                                export: {
                                    csv: {
                                        filename: 'bulut-filo-karsilastirma',
                                        headerCategory: 'Metrik',
                                        headerValue: 'Değer'
                                    },
                                    svg: {
                                        filename: 'bulut-filo-karsilastirma'
                                    },
                                    png: {
                                        filename: 'bulut-filo-karsilastirma'
                                    }
                                }
                            },
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 800
                            }
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '55%',
                                endingShape: 'rounded',
                                dataLabels: {
                                    position: 'top'
                                }
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            offsetY: -20,
                            style: {
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }
                        },
                        stroke: {
                            show: true,
                            width: 2,
                            colors: ['transparent']
                        },
                        xaxis: {
                            categories: ['İşlem Süresi (dk)', 'Hata Oranı (%)', 'Tekrar İşlem', 'Maliyet (K₺)'],
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        yaxis: {
                            title: {
                                text: 'Değer',
                                style: {
                                    color: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            },
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        colors: ['#ef4444', '#10b981'],
                        fill: {
                            opacity: 1,
                            type: 'gradient',
                            gradient: {
                                shade: 'dark',
                                type: 'vertical',
                                shadeIntensity: 0.3,
                                gradientToColors: ['#dc2626', '#059669'],
                                inverseColors: false,
                                opacityFrom: 1,
                                opacityTo: 0.9,
                                stops: [0, 100]
                            }
                        },
                        tooltip: {
                            y: {
                                formatter: function(val, opts) {
                                    const category = opts.w.globals.labels[opts.dataPointIndex];
                                    if (category.includes('Maliyet')) {
                                        return val + '.000 ₺';
                                    } else if (category.includes('Süre')) {
                                        return val + ' dakika';
                                    } else if (category.includes('Hata')) {
                                        return '%' + val;
                                    } else {
                                        return val + 'x';
                                    }
                                }
                            },
                            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'center',
                            fontSize: '14px',
                            labels: {
                                colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                            }
                        },
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const comparisonChart = new ApexCharts(container, comparisonOptions);
                    comparisonChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(comparisonChart);
                }
            }
        }

        // Create comparison chart when section is visible
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !document.getElementById('comparison-chart')) {
                    createComparisonChart();
                    createRadialProgressChart();
                    createPerformanceTrendChart();
                    createProcessHeatmap();
                    createMixedMetricsChart();
                    createCostTreemap();
                    createPolarComparisonChart();
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const metricsSection = document.getElementById('metrics');
        if (metricsSection) {
            metricsObserver.observe(metricsSection);
        }

        // ============================================
        // RADIAL PROGRESS CHART - İyileştirme Hedefleri
        // ============================================
        function createRadialProgressChart() {
            const container = document.createElement('div');
            container.id = 'radial-progress-chart';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '400');
                    chartCard.innerHTML = '<h3>🎯 İyileştirme Hedefleri</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const radialOptions = {
                        series: [67, 84, 91, 75],
                        chart: {
                            height: 380,
                            type: 'radialBar',
                            fontFamily: 'Inter, sans-serif',
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 1200,
                                animateGradually: {
                                    enabled: true,
                                    delay: 150
                                }
                            }
                        },
                        plotOptions: {
                            radialBar: {
                                offsetY: 0,
                                startAngle: 0,
                                endAngle: 270,
                                hollow: {
                                    margin: 5,
                                    size: '30%',
                                    background: 'transparent',
                                },
                                dataLabels: {
                                    name: {
                                        show: true,
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                    },
                                    value: {
                                        show: true,
                                        fontSize: '24px',
                                        fontWeight: 700,
                                        color: document.body.classList.contains('light-theme') ? '#000' : '#fff',
                                        formatter: function (val) {
                                            return parseInt(val) + '%';
                                        }
                                    },
                                    total: {
                                        show: true,
                                        label: 'Ortalama',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: document.body.classList.contains('light-theme') ? '#666' : '#999',
                                        formatter: function (w) {
                                            const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                            return parseInt(total / w.globals.series.length) + '%';
                                        }
                                    }
                                },
                                track: {
                                    background: 'rgba(255,255,255,0.1)',
                                    strokeWidth: '97%'
                                }
                            }
                        },
                        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
                        labels: ['Otomasyon', 'Entegrasyon', 'Eğitim', 'Analitik'],
                        legend: {
                            show: true,
                            floating: true,
                            fontSize: '14px',
                            position: 'left',
                            offsetX: 0,
                            offsetY: 15,
                            labels: {
                                colors: document.body.classList.contains('light-theme') ? '#000' : '#fff',
                                useSeriesColors: false
                            },
                            markers: {
                                size: 6
                            },
                            formatter: function(seriesName, opts) {
                                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + '%';
                            },
                            itemMargin: {
                                vertical: 3
                            }
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                legend: {
                                    show: false
                                }
                            }
                        }],
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const radialChart = new ApexCharts(container, radialOptions);
                    radialChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(radialChart);
                }
            }
        }

        // ============================================
        // PERFORMANCE TREND CHART - Performans Trendi
        // ============================================
        function createPerformanceTrendChart() {
            const container = document.createElement('div');
            container.id = 'performance-trend-chart';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '500');
                    chartCard.innerHTML = '<h3>📈 6 Aylık Performans Trendi</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const trendOptions = {
                        series: [{
                            name: 'İşlem Süresi (dk)',
                            data: [48, 47, 46, 44, 45, 42]
                        }, {
                            name: 'Müşteri Memnuniyeti (%)',
                            data: [85, 87, 89, 91, 95, 98]
                        }, {
                            name: 'Hata Oranı (%)',
                            data: [15, 14, 13, 13, 12, 12]
                        }],
                        chart: {
                            type: 'area',
                            height: 350,
                            fontFamily: 'Inter, sans-serif',
                            toolbar: {
                                show: true,
                                tools: {
                                    download: true,
                                    zoom: true,
                                    zoomin: true,
                                    zoomout: true,
                                    pan: false,
                                    reset: true
                                }
                            },
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 800,
                                animateGradually: {
                                    enabled: true,
                                    delay: 150
                                }
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 3
                        },
                        xaxis: {
                            categories: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        yaxis: {
                            title: {
                                text: 'Değer',
                                style: {
                                    color: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            },
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        colors: ['#ef4444', '#10b981', '#f59e0b'],
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.7,
                                opacityTo: 0.3,
                                stops: [0, 90, 100]
                            }
                        },
                        tooltip: {
                            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
                            x: {
                                format: 'dd/MM/yy'
                            }
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'left',
                            fontSize: '14px',
                            labels: {
                                colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                            }
                        },
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const trendChart = new ApexCharts(container, trendOptions);
                    trendChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(trendChart);
                }
            }
        }

        // ============================================
        // PROCESS HEATMAP - Süreç Yoğunluk Analizi
        // ============================================
        function createProcessHeatmap() {
            const container = document.createElement('div');
            container.id = 'process-heatmap';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '600');
                    chartCard.innerHTML = '<h3>🔥 Haftalık Süreç Yoğunluk Haritası</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const heatmapData = [
                        {
                            name: 'Pazartesi',
                            data: [
                                { x: '09:00', y: 45 },
                                { x: '12:00', y: 67 },
                                { x: '15:00', y: 52 },
                                { x: '18:00', y: 38 }
                            ]
                        },
                        {
                            name: 'Salı',
                            data: [
                                { x: '09:00', y: 42 },
                                { x: '12:00', y: 71 },
                                { x: '15:00', y: 48 },
                                { x: '18:00', y: 35 }
                            ]
                        },
                        {
                            name: 'Çarşamba',
                            data: [
                                { x: '09:00', y: 51 },
                                { x: '12:00', y: 85 },
                                { x: '15:00', y: 63 },
                                { x: '18:00', y: 44 }
                            ]
                        },
                        {
                            name: 'Perşembe',
                            data: [
                                { x: '09:00', y: 48 },
                                { x: '12:00', y: 78 },
                                { x: '15:00', y: 58 },
                                { x: '18:00', y: 41 }
                            ]
                        },
                        {
                            name: 'Cuma',
                            data: [
                                { x: '09:00', y: 55 },
                                { x: '12:00', y: 92 },
                                { x: '15:00', y: 74 },
                                { x: '18:00', y: 52 }
                            ]
                        }
                    ];

                    const heatmapOptions = {
                        series: heatmapData,
                        chart: {
                            height: 350,
                            type: 'heatmap',
                            fontFamily: 'Inter, sans-serif',
                            toolbar: {
                                show: true
                            },
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 800
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            style: {
                                colors: ['#fff']
                            }
                        },
                        colors: ['#10b981'],
                        title: {
                            text: 'İşlem Sayısı',
                            align: 'left',
                            style: {
                                color: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                            }
                        },
                        xaxis: {
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        yaxis: {
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        tooltip: {
                            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
                            y: {
                                formatter: function(val) {
                                    return val + ' işlem';
                                }
                            }
                        },
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const heatmapChart = new ApexCharts(container, heatmapOptions);
                    heatmapChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(heatmapChart);
                }
            }
        }

        // ============================================
        // MIXED METRICS CHART - Kombinasyon Grafik
        // ============================================
        function createMixedMetricsChart() {
            const container = document.createElement('div');
            container.id = 'mixed-metrics-chart';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '700');
                    chartCard.innerHTML = '<h3>📊 Kombine Metrik Analizi</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const mixedOptions = {
                        series: [{
                            name: 'İşlem Hacmi',
                            type: 'column',
                            data: [440, 505, 414, 671, 227, 413]
                        }, {
                            name: 'Verimlilik (%)',
                            type: 'line',
                            data: [23, 42, 35, 27, 43, 22]
                        }, {
                            name: 'Tasarruf (K₺)',
                            type: 'line',
                            data: [35, 41, 36, 26, 45, 48]
                        }],
                        chart: {
                            height: 350,
                            type: 'line',
                            fontFamily: 'Inter, sans-serif',
                            stacked: false,
                            toolbar: {
                                show: true
                            },
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 800
                            }
                        },
                        stroke: {
                            width: [0, 4, 4],
                            curve: 'smooth'
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: '50%'
                            }
                        },
                        fill: {
                            opacity: [0.85, 1, 1],
                            gradient: {
                                inverseColors: false,
                                shade: 'light',
                                type: 'vertical',
                                opacityFrom: 0.85,
                                opacityTo: 0.55,
                                stops: [0, 100, 100, 100]
                            }
                        },
                        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                        markers: {
                            size: 0
                        },
                        xaxis: {
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        yaxis: [
                            {
                                seriesName: 'İşlem Hacmi',
                                title: {
                                    text: 'İşlem Sayısı',
                                    style: {
                                        color: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                    }
                                },
                                labels: {
                                    style: {
                                        colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                    }
                                }
                            },
                            {
                                seriesName: 'Verimlilik (%)',
                                opposite: true,
                                title: {
                                    text: 'Verimlilik & Tasarruf',
                                    style: {
                                        color: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                    }
                                },
                                labels: {
                                    style: {
                                        colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                    }
                                }
                            }
                        ],
                        colors: ['#3b82f6', '#10b981', '#f59e0b'],
                        tooltip: {
                            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
                            shared: true,
                            intersect: false,
                            y: {
                                formatter: function (y, opts) {
                                    if (typeof y !== 'undefined') {
                                        if (opts.seriesIndex === 1) {
                                            return y.toFixed(0) + '%';
                                        } else if (opts.seriesIndex === 2) {
                                            return y.toFixed(0) + 'K ₺';
                                        }
                                        return y.toFixed(0);
                                    }
                                    return y;
                                }
                            }
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'center',
                            fontSize: '14px',
                            labels: {
                                colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                            }
                        },
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const mixedChart = new ApexCharts(container, mixedOptions);
                    mixedChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(mixedChart);
                }
            }
        }

        // ============================================
        // COST TREEMAP - Maliyet Dağılımı
        // ============================================
        function createCostTreemap() {
            const container = document.createElement('div');
            container.id = 'cost-treemap';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '800');
                    chartCard.innerHTML = '<h3>🗺️ Detaylı Maliyet Dağılımı</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const treemapOptions = {
                        series: [
                            {
                                name: 'Manuel İşlem',
                                data: [
                                    { x: 'Veri Girişi', y: 125 },
                                    { x: 'Form Kontrolü', y: 87 },
                                    { x: 'Belge Hazırlama', y: 63 }
                                ]
                            },
                            {
                                name: 'Hatalar',
                                data: [
                                    { x: 'Yeniden İşleme', y: 78 },
                                    { x: 'Düzeltme', y: 52 },
                                    { x: 'Kontrol', y: 36 }
                                ]
                            },
                            {
                                name: 'Bekleme',
                                data: [
                                    { x: 'Onay Süreci', y: 45 },
                                    { x: 'Sıra Bekleme', y: 28 }
                                ]
                            }
                        ],
                        chart: {
                            height: 380,
                            type: 'treemap',
                            fontFamily: 'Inter, sans-serif',
                            toolbar: {
                                show: true
                            },
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 800
                            }
                        },
                        plotOptions: {
                            treemap: {
                                distributed: true,
                                enableShades: false
                            }
                        },
                        colors: [
                            '#ef4444',
                            '#f59e0b',
                            '#3b82f6',
                            '#10b981',
                            '#8b5cf6',
                            '#ec4899',
                            '#06b6d4',
                            '#84cc16'
                        ],
                        legend: {
                            show: true,
                            position: 'bottom',
                            fontSize: '14px',
                            labels: {
                                colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                            }
                        },
                        tooltip: {
                            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
                            y: {
                                formatter: function(val) {
                                    return val + '.000 ₺';
                                }
                            }
                        },
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const treemapChart = new ApexCharts(container, treemapOptions);
                    treemapChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(treemapChart);
                }
            }
        }

        // ============================================
        // POLAR COMPARISON CHART - Kategori Karşılaştırması
        // ============================================
        function createPolarComparisonChart() {
            const container = document.createElement('div');
            container.id = 'polar-comparison-chart';
            container.style.cssText = 'margin-top: 50px;';
            
            const metricsSection = document.getElementById('metrics');
            if (metricsSection && typeof ApexCharts !== 'undefined') {
                const chartContainer = metricsSection.querySelector('.container');
                if (chartContainer) {
                    const chartCard = document.createElement('div');
                    chartCard.className = 'glass-card metric-card';
                    chartCard.setAttribute('data-aos', 'fade-up');
                    chartCard.setAttribute('data-aos-delay', '900');
                    chartCard.innerHTML = '<h3>🎯 Performans Kategorileri</h3>';
                    chartCard.appendChild(container);
                    chartContainer.appendChild(chartCard);

                    const polarOptions = {
                        series: [42, 47, 52, 58, 65],
                        chart: {
                            height: 380,
                            type: 'polarArea',
                            fontFamily: 'Inter, sans-serif',
                            animations: {
                                enabled: true,
                                easing: 'easeinout',
                                speed: 800,
                                animateGradually: {
                                    enabled: true,
                                    delay: 150
                                }
                            }
                        },
                        labels: ['Hız', 'Doğruluk', 'Verimlilik', 'Maliyet', 'Memnuniyet'],
                        fill: {
                            opacity: 0.8
                        },
                        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                        stroke: {
                            width: 2,
                            colors: document.body.classList.contains('light-theme') ? ['#fff'] : ['#1e293b']
                        },
                        yaxis: {
                            show: true,
                            labels: {
                                style: {
                                    colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                                }
                            }
                        },
                        legend: {
                            position: 'bottom',
                            fontSize: '14px',
                            labels: {
                                colors: document.body.classList.contains('light-theme') ? '#000' : '#fff'
                            }
                        },
                        plotOptions: {
                            polarArea: {
                                rings: {
                                    strokeWidth: 1,
                                    strokeColor: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                                },
                                spokes: {
                                    strokeWidth: 1,
                                    connectorColors: document.body.classList.contains('light-theme') ? '#e2e8f0' : '#334155'
                                }
                            }
                        },
                        tooltip: {
                            theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
                            y: {
                                formatter: function(val) {
                                    return val + ' puan';
                                }
                            }
                        },
                        theme: {
                            mode: document.body.classList.contains('light-theme') ? 'light' : 'dark'
                        }
                    };

                    const polarChart = new ApexCharts(container, polarOptions);
                    polarChart.render();
                    
                    if (!window.chartInstances) window.chartInstances = [];
                    window.chartInstances.push(polarChart);
                }
            }
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

        // SIPOC Kutularına Click Event
        document.querySelectorAll('.sipoc-box').forEach(box => {
            box.addEventListener('click', () => {
                const sipocId = box.getAttribute('data-sipoc-id');
                if (sipocId) {
                    showSIPOCDetails(sipocId);
                }
            });
        });

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

        // Overlay'e tıklayınca kapat
        document.getElementById('improvement-modal').addEventListener('click', (e) => {
            if (e.target.id === 'improvement-modal') {
                closeImprovementModal();
            }
        });

        // ESC tuşu ile kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeImprovementModal();
            }
        });

        console.log('🚀 Bulut Filo Yönetimi - BPM Analiz Sunumu Yüklendi');