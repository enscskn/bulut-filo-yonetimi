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
            { name: 'Otomasyon', reach: 200, impact: 8, confidence: 90, effort: 3, total: 480, winner: true },
            { name: 'Entegrasyon', reach: 180, impact: 7, confidence: 85, effort: 3, total: 357 },
            { name: 'Mobil App', reach: 150, impact: 9, confidence: 75, effort: 5, total: 203 },
            { name: 'Dashboard', reach: 100, impact: 6, confidence: 80, effort: 2, total: 240 },
            { name: 'Eğitim', reach: 80, impact: 5, confidence: 95, effort: 1, total: 380 }
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
            detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

        console.log('🚀 Bulut Filo Yönetimi - BPM Analiz Sunumu Yüklendi');