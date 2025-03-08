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
        
        // Enable image preloading
        preloadVisibleImages();
        
        // Set up intersection observer for lazy loading
        setupLazyLoading();
        
        // Frame rate throttling for animations
        setupFrameThrottling();
        
        // Add resource hints for faster connections
        addResourceHints();
    });
    
    // Apply hardware acceleration hints to key elements
    function applyHardwareAcceleration() {
        // Elements that benefit from hardware acceleration
        const acceleratedElements = [
            '.gallery-item',
            '.thumbnail',
            '.modal',
            '.modal-content',
            'video',
            'header',
            '.menu-toggle',
            '.mobile-menu',
            '.sticker'
        ];
        
        // Apply will-change property intelligently
        acceleratedElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    // Only apply to visible elements to prevent excessive memory usage
                    if (isElementVisible(el)) {
                        if (selector.includes('gallery') || selector.includes('thumbnail')) {
                            el.style.willChange = 'transform';
                        } else if (selector.includes('modal')) {
                            el.style.willChange = 'opacity, transform';
                        } else if (selector === 'video') {
                            el.style.willChange = 'transform';
                            
                            // Apply playback optimizations for videos
                            if (el.tagName === 'VIDEO') {
                                el.preload = isMobile ? 'metadata' : 'auto';
                                el.muted = true;
                                el.playsInline = true;
                                
                                // For low-power devices, lower resolution via CSS
                                if (isLowPowerDevice) {
                                    el.style.transform = 'scale(0.8)';
                                    el.style.maxWidth = '95%';
                                }
                            }
                        }
                    }
                });
            }
        });
        
        // Enable smooth scrolling only on non-low-power devices
        if (!isLowPowerDevice) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }
    
    // Check if element is currently visible in viewport
    function isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Preload images that are visible or near visible
    function preloadVisibleImages() {
        // Get all image elements
        const images = document.querySelectorAll('img[src]:not([loading="lazy"])');
        
        // Set total image count for progress tracking
        window.perfSettings.totalImages = images.length;
        
        // Create image preloader
        images.forEach((img, index) => {
            // Skip already loaded images
            if (img.complete) {
                window.perfSettings.imagesLoaded++;
                return;
            }
            
            // Stagger the loading of images to reduce initial burden
            setTimeout(() => {
                // Create a new image to preload
                const preloadImg = new Image();
                
                // When image loads, update counter
                preloadImg.onload = function() {
                    window.perfSettings.imagesLoaded++;
                    
                    // Check if all images have been preloaded
                    if (window.perfSettings.imagesLoaded >= window.perfSettings.totalImages) {
                        window.perfSettings.preloadComplete = true;
                        
                        // Dispatch event that preloading is complete
                        document.dispatchEvent(new CustomEvent('preloadComplete'));
                    }
                };
                
                // Set source to begin loading
                preloadImg.src = img.src;
            }, isMobile ? index * 100 : index * 50); // Stagger more on mobile
        });
    }
    
    // Setup advanced lazy loading with Intersection Observer
    function setupLazyLoading() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        // Handle different element types
                        if (lazyImage.tagName === 'IMG') {
                            if (lazyImage.dataset.src) {
                                lazyImage.src = lazyImage.dataset.src;
                                lazyImage.removeAttribute('data-src');
                            }
                        } else if (lazyImage.tagName === 'VIDEO') {
                            if (lazyImage.dataset.src) {
                                lazyImage.src = lazyImage.dataset.src;
                                lazyImage.removeAttribute('data-src');
                            }
                            
                            // Only autoplay videos if not a low-power device
                            if (!isLowPowerDevice && !isMobile) {
                                lazyImage.play().catch(e => console.log("Autoplay prevented:", e));
                            }
                        }
                        
                        // Show element with animation
                        lazyImage.style.opacity = 1;
                        
                        // Stop observing this element
                        observer.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '200px', // Load when within 200px of viewport
                threshold: 0.01      // Trigger when 1% visible
            });
            
            // Start observing elements with data-src attribute
            document.querySelectorAll('img[data-src], video[data-src]').forEach(lazyElement => {
                lazyImageObserver.observe(lazyElement);
            });
            
            // Observe regular images and videos too for hardware acceleration
            document.querySelectorAll('img[src], video').forEach(mediaElement => {
                lazyImageObserver.observe(mediaElement);
            });
        }
    }
    
    // Set up frame throttling for animations to improve performance
    function setupFrameThrottling() {
        // Only throttle on low-power devices
        if (!isLowPowerDevice) return;
        
        // Polyfill for requestAnimationFrame
        const raf = window.requestAnimationFrame || 
                    window.webkitRequestAnimationFrame || 
                    window.mozRequestAnimationFrame;
        
        if (raf) {
            let frameCounter = 0;
            const throttleAmount = window.perfSettings.frameThrottleAmount;
            
            // Override requestAnimationFrame to throttle frames
            window.requestAnimationFrame = function(callback) {
                frameCounter++;
                
                // Only execute animation frame callbacks every N frames
                if (frameCounter % throttleAmount === 0) {
                    return raf(callback);
                }
                
                // Skip this frame
                return raf(function() {
                    // Empty callback to maintain timing
                });
            };
        }
    }
    
    // Add resource hints for faster page loading
    function addResourceHints() {
        // Add DNS prefetch for external resources
        const domains = [
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        // Create hint elements
        domains.forEach(domain => {
            // DNS prefetch
            let dns = document.createElement('link');
            dns.rel = 'dns-prefetch';
            dns.href = domain;
            document.head.appendChild(dns);
            
            // Preconnect (faster but more resource intensive)
            let preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            document.head.appendChild(preconnect);
        });
    }
    
    // Initialize memory management
    window.addEventListener('load', function() {
        // Clear hardware acceleration for off-screen elements to save memory
        window.addEventListener('scroll', function() {
            // Throttle to run only every 500ms
            if (!window.scrollThrottleTimer) {
                window.scrollThrottleTimer = setTimeout(function() {
                    // Find elements with will-change property
                    document.querySelectorAll('[style*="will-change"]').forEach(el => {
                        if (!isElementVisible(el)) {
                            el.style.willChange = 'auto'; // Reset will-change
                        } else {
                            // Restore will-change for visible elements
                            if (el.classList.contains('gallery-item') || 
                                el.classList.contains('thumbnail')) {
                                el.style.willChange = 'transform';
                            } else if (el.classList.contains('modal') || 
                                      el.classList.contains('modal-content')) {
                                el.style.willChange = 'opacity, transform';
                            }
                        }
                    });
                    
                    window.scrollThrottleTimer = null;
                }, 500);
            }
        }, { passive: true });
    });
})();
