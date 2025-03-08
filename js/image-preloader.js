/**
 * Image Preloader for Stickers and Gallery
 * Enhances performance by preloading key visual elements
 */

(function() {
    // List of sticker paths to preload
    const stickerPaths = [
        'stickers/sticker1.png',
        'stickers/sticker2.png',
        'stickers/sticker3.png',
        'stickers/sticker4.png',
        'stickers/sticker5.png',
        'stickers/sticker6.png',
        'stickers/sticker7.png',
        'stickers/sticker8.png',
        'stickers/sticker9.png',
        'stickers/sticker10.png',
        'stickers/sticker11.png',
        'stickers/sticker12.png',
        'stickers/sticker13.png'
    ];
    
    // Device detection to determine preload strategy
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Lightweight image cache
    const imageCache = {};
    
    // Preload stickers with priority
    window.addEventListener('DOMContentLoaded', function() {
        // For mobile devices, load fewer stickers to conserve memory and bandwidth
        const stickersToLoad = isMobile ? stickerPaths.slice(0, 5) : stickerPaths;
        
        // Create a loading queue for staggered loading
        const loadQueue = [];
        
        // Fill queue with stickers to preload
        stickersToLoad.forEach(path => {
            loadQueue.push(path);
        });
        
        // Process the queue with staggered timing for smoother loading
        let currentIndex = 0;
        
        function processNextImage() {
            if (currentIndex >= loadQueue.length) {
                // All images preloaded, dispatch event
                document.dispatchEvent(new CustomEvent('stickersPreloaded'));
                return;
            }
            
            const path = loadQueue[currentIndex++];
            const img = new Image();
            
            img.onload = function() {
                // Add to cache
                imageCache[path] = img;
                
                // Process next image with delay
                setTimeout(processNextImage, isMobile ? 200 : 50);
            };
            
            img.onerror = function() {
                // Skip failed images but continue loading others
                console.warn('Failed to preload image:', path);
                setTimeout(processNextImage, 10);
            };
            
            // Set source to begin loading
            img.src = path;
        }
        
        // Start loading process
        setTimeout(processNextImage, 100);
    });
    
    // Expose API for other scripts to use
    window.ImagePreloader = {
        // Check if an image is preloaded
        isImagePreloaded: function(path) {
            return !!imageCache[path];
        },
        
        // Get a preloaded image if available
        getPreloadedImage: function(path) {
            return imageCache[path];
        },
        
        // Manually preload an image and return a promise
        preloadImage: function(path) {
            return new Promise((resolve, reject) => {
                if (imageCache[path]) {
                    resolve(imageCache[path]);
                    return;
                }
                
                const img = new Image();
                
                img.onload = function() {
                    imageCache[path] = img;
                    resolve(img);
                };
                
                img.onerror = function() {
                    reject(new Error(`Failed to preload image: ${path}`));
                };
                
                img.src = path;
            });
        }
    };
})();
