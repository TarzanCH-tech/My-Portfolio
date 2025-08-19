// Loading screen and animations
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after page loads
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove loading screen from DOM after animation
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000); // Show loading for 1 second minimum
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle staggered animations for skill tags and portfolio items
                if (entry.target.classList.contains('skill-tags') || 
                    entry.target.classList.contains('portfolio-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('stagger-animation', 'visible');
                        }, index * 100);
                    });
                }
            } else {
                // Remove visible class when element leaves viewport
                entry.target.classList.remove('visible');
                
                // Reset staggered animations
                if (entry.target.classList.contains('skill-tags') || 
                    entry.target.classList.contains('portfolio-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach(child => {
                        child.classList.remove('stagger-animation', 'visible');
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .slide-up, .fade-up, .zoom-up');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Special handling for skill tags and portfolio items
    const skillTags = document.querySelector('.skill-tags');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (skillTags) observer.observe(skillTags);
    if (portfolioGrid) observer.observe(portfolioGrid);

    // Hamburger menu toggle functionality
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link (for mobile) and add smooth scrolling
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        }
    });
    
    // Header scroll behavior - hide name and Let's Talk button when scrolled
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const logoImg = document.querySelector('.logo-img');
    const letsTalk = document.querySelector('.lets-talk');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            // User has scrolled down
            header.classList.add('scrolled');
            // Force-close mobile nav and disable hamburger while scrolled
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
            hamburger.setAttribute('aria-disabled', 'true');
            hamburger.style.pointerEvents = 'none';
        } else {
            // User is at the top
            header.classList.remove('scrolled');
            // Re-enable hamburger at top
            hamburger.removeAttribute('aria-disabled');
            hamburger.style.pointerEvents = '';
        }
        
        lastScrollTop = scrollTop;
    });

    // Lightbox for portfolio images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const bodyEl = document.body;
    
    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Project preview';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        bodyEl.classList.add('no-scroll');
    }
    function closeLightbox() {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        bodyEl.classList.remove('no-scroll');
        // Defer clearing src to avoid flash
        setTimeout(() => { lightboxImg.src = ''; }, 200);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }
    
    document.querySelectorAll('.portfolio-img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
});
