// Automatically initialize portfolio functionality once DOM is completely loaded
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    body.style.overflow = 'auto';
    
    // Initialize all portfolio functionality directly
    initPortfolio();
});

function initPortfolio() {
    // Check if elements exist before using them
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Initialize animation elements
    const animateElements = document.querySelectorAll('.animate-in');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const certificates = document.querySelectorAll('#certificates-tab .project-slider > div');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.project-dot');
    const toggleButton = document.getElementById('toggle-projects');
    const hiddenProjects = document.getElementById('hidden-projects');
    let currentIndex = 0;
    const totalCertificates = certificates.length;
    let isExpanded = false;

    // Toggle projects button
    if (toggleButton && hiddenProjects) {
        toggleButton.addEventListener('click', function() {
            if (isExpanded) {
                hiddenProjects.style.display = 'none';
                toggleButton.innerHTML = '<i class="fas fa-eye mr-2"></i>Show More Projects';
                
                setTimeout(() => {
                    const portfolioSection = document.getElementById('Portfolio');
                    if (portfolioSection) {
                        portfolioSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            } else {
                hiddenProjects.style.display = 'grid';
                toggleButton.innerHTML = '<i class="fas fa-eye-slash mr-2"></i>Show Less Projects';
                
                const hiddenProjectCards = hiddenProjects.querySelectorAll('.animate-in');
                hiddenProjectCards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('animate-in');
                });
            }
            isExpanded = !isExpanded;
        });
    }

    // Image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'Images/placeholder.jpg';
            this.alt = 'Image failed to load';
        });
    });

    // Certificate slider
    function updateSlider() {
        if (!certificates.length) return;
        
        certificates.forEach((cert, index) => {
            cert.style.display = index === currentIndex ? 'flex' : 'none';
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (totalCertificates > 0) {
                currentIndex = (currentIndex + 1) % totalCertificates;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (totalCertificates > 0) {
                currentIndex = (currentIndex - 1 + totalCertificates) % totalCertificates;
                updateSlider();
            }
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            if (!isNaN(slideIndex)) {
                currentIndex = slideIndex;
                updateSlider();
            }
        });
    });

    if (certificates.length > 0) {
        updateSlider();
    }

    // Viewport animation check
    function isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75
        );
    }
    
    function runAnimations() {
        // On mobile: immediately show all animated elements 
        if (window.innerWidth <= 768) {
            animateElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.style.animationPlayState = 'running';
            });
            // Also ensure all project cards inside animate-in containers are flat & visible
            document.querySelectorAll('.project-card').forEach(card => {
                card.style.transform = 'none';
                card.style.opacity = '1';
            });
            return;
        }
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Run animations
    if (animateElements.length) {
        runAnimations();
        window.addEventListener('scroll', runAnimations);
        window.addEventListener('resize', runAnimations);
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuButton && mobileMenu) {
        // Open menu
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
        
        // Close menu function
        function closeMobileMenu() {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        // Close with close button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }
        
        // Close when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close when clicking outside 
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Highlight the nav link for the section currently in view
    const navLinks = document.querySelectorAll('.navbar .flex a.nav-link');
    const spySections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        if (!navLinks.length || !spySections.length) return;

        let currentId = spySections[0].getAttribute('id');
        spySections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    if (navLinks.length && spySections.length) {
        window.addEventListener('scroll', updateActiveNavLink);
        updateActiveNavLink();
    }

    // Initialize typewriter
    initTypewriter();
}