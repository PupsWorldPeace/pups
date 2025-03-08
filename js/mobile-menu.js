// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get hamburger menu, overlay and all mobile nav links
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links li a');
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function() {
        // Toggle active class on hamburger (for animation)
        this.classList.toggle('active');
        
        // Toggle overlay
        mobileNavOverlay.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.classList.toggle('menu-open');
        
        if (document.body.classList.contains('menu-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside the menu
    mobileNavOverlay.addEventListener('click', function(event) {
        // Only close if clicking the overlay itself, not the menu items
        if (event.target === this) {
            hamburger.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
    
    // Additional optimization - don't show transition on page load
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.body.classList.add('transitions-enabled');
        }, 100);
    });
    
    // Handle orientation changes smoothly
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure dimensions are updated
        setTimeout(function() {
            // If menu is open on landscape, close it
            if (window.innerWidth > 768 && mobileNavOverlay.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        }, 200);
    });
});
