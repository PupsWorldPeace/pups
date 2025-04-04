/**
 * Performance Optimization Script
 * Improves loading times, animations, and mobile experience
 */

(function() {
    // Device detection for adaptive performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPowerDevice = isMobile && 
        (navigator.deviceMemory < 4 || 
         navigator.hardwareConcurrency < 4);
    
    // Store performance settings globally
    window.perfSettings = {
        isMobile: isMobile,
        isLowPowerDevice: isLowPowerDevice,
        imagesLoaded: 0,
        totalImages: 0,
        preloadComplete: false,
        frameThrottleAmount: isLowPowerDevice ? 3 : 1
    };
    
    // Initialize performance optimizations when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Apply hardware acceleration hints
        applyHardwareAcceleration();
        
        // Set up intersection observer for lazy loading and other optimizations
        setupIntersectionObserver();
        
        // Frame rate throttling for animations
        setupFrameThrottling();
        
        // Add resource hints for faster connections
        addResourceHints();
    });
    
    // Apply hardware acceleration hints to key elements ONCE
    function applyHardwareAcceleration() {
        // Apply will-change to elements known to animate or transform
        const selectors = [
            '.gallery-item', // Transforms on hover
            '.modal',        // Opacity/transform for display
            '.falling-sticker' // Transform for animation
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (selector === '.modal') {
                    el.style.willChange = 'opacity, transform';
                } else {
                    el.style.willChange = 'transform';
                }
            });
        });

        // Apply video-specific attributes
        document.querySelectorAll('video').forEach(el => {
             el.preload = isMobile ? 'metadata' : 'auto'; // Load only metadata on mobile initially
             el.muted = true; // Ensure videos are muted for autoplay policies
             el.playsInline = true; // Crucial for iOS inline playback
        });

        // Enable smooth scrolling only on non-low-power devices
        if (!isLowPowerDevice) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }
    
    // Setup Intersection Observer for lazy loading images/videos and optimizing playback
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn("Intersection Observer not supported, lazy loading disabled.");
            // Fallback: maybe load all images? Or do nothing.
            return; 
        }

        const observerOptions = {
            rootMargin: '200px 0px 200px 0px', // Load when 200px below/above viewport
            threshold: 0.01 // Trigger when even a tiny part is visible
        };

        const mediaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const target = entry.target;

                if (entry.isIntersecting) {
                    // Load lazy images
                    if (target.tagName === 'IMG' && target.dataset.src) {
                        target.src = target.dataset.src;
                        target.removeAttribute('data-src');
                        target.style.opacity = 1; // Fade in
                        observer.unobserve(target); // Stop observing once loaded
                    } 
                    // Play videos when they become visible (if autoplay is desired/allowed)
                    else if (target.tagName === 'VIDEO') {
                         // Check if it's in the main grid or a gallery thumbnail preview
                        if (target.closest('.image-grid') || target.closest('.video-preview')) {
                             target.play().catch(e => { /* Autoplay might fail, ignore error */ });
                        }
                    }
                } else {
                     // Pause videos when they scroll out of view
                     if (target.tagName === 'VIDEO') {
                         target.pause();
                     }
                }
            });
        }, observerOptions);

        // Observe all images with data-src and all videos
        // Use requestIdleCallback or setTimeout to avoid blocking main thread
        requestIdleCallback(() => {
            document.querySelectorAll('img[data-src], video').forEach(el => {
                 // Set initial opacity for fade-in effect for lazy images
                 if (el.tagName === 'IMG' && el.dataset.src) {
                     el.style.opacity = 0;
                     el.style.transition = 'opacity 0.5s ease-in-out';
                 }
                 mediaObserver.observe(el);
            });
        });
    }
    
    // Set up frame throttling for animations (only if needed and on low power)
    function setupFrameThrottling() {
        // Only apply throttling if necessary (e.g., for sticker animation)
        // This implementation is aggressive and might break other animations.
        // Consider applying throttling selectively within the animation loop itself (like in stickers-rain.js)
        // if (!isLowPowerDevice) return; 
        // console.log("Frame throttling enabled for low power device.");
        // ... (Keep original throttling logic if deemed necessary, but test carefully) ...
    }
    
    // Add resource hints for faster page loading
    function addResourceHints() {
        // Add DNS prefetch and preconnect for external resources
        const domains = [
            'https://cdnjs.cloudflare.com', // FontAwesome
            'https://fonts.googleapis.com', // Google Fonts CSS
            'https://fonts.gstatic.com'     // Google Fonts files
        ];
        
        // Create hint elements
        domains.forEach(domain => {
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            preconnect.crossOrigin = "anonymous"; // Add crossorigin for font origins
            document.head.appendChild(preconnect);

            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = domain;
            document.head.appendChild(dnsPrefetch);
        });
    }

    // Removed the scroll-based will-change toggling as it's often detrimental.
    // Hardware acceleration hints are now applied once on load.
    
})();
