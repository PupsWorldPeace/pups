// Raining Stickers Animation - Optimized

document.addEventListener('DOMContentLoaded', function() {
    // Detect device capabilities - reduce load on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Configuration - adjust based on device capabilities
    const config = {
        numStickers: isMobile ? 8 : 16,      // Fewer stickers on mobile
        maxSize: isMobile ? 50 : 80,         // Smaller stickers on mobile
        minSize: isMobile ? 20 : 30,         // Smaller min size on mobile
        minSpeed: 1,                         // Minimum fall speed
        maxSpeed: isMobile ? 2 : 3,          // Slower speed on mobile
        rotationSpeed: 0.5,                  // Rotation speed (degrees per frame)
        stickerCache: {},                    // For preloaded images
        stickerPaths: [                      // Paths to sticker images
            'stickers/0.png',
            'stickers/1.png', 
            'stickers/2.png',
            'stickers/3.png',
            'stickers/4.png',
            'stickers/5.png',
            'stickers/6.png',
            'stickers/7.png',
            'stickers/8.png',
            'stickers/9.png',
            'stickers/11.png',
            'stickers/glasses.png',
            'stickers/hat.png'
        ]
    };
    
    // Preload all sticker images to prevent flashing/missing images
    function preloadImages() {
        config.stickerPaths.forEach(path => {
            const img = new Image();
            img.src = path;
            config.stickerCache[path] = img;
        });
    }
    
    // Start preloading images
    preloadImages();
    
    // Create container for stickers with better performance hints
    const container = document.createElement('div');
    container.className = 'stickers-container';
    
    // Add container to the body
    document.body.appendChild(container);
    
    // Array to hold all active stickers
    const stickers = [];
    
    // Throttle control variables for better performance
    let lastFrameTime = 0;
    const frameBudget = isMobile ? 33 : 16; // 30fps on mobile, 60fps on desktop
    
    // Create initial stickers - staggered initialization for better load performance
    function initializeStickers() {
        // Create stickers gradually to avoid frame drops during load
        let count = 0;
        const interval = setInterval(() => {
            createSticker();
            count++;
            if (count >= config.numStickers) {
                clearInterval(interval);
            }
        }, 100); // Add a new sticker every 100ms
    }
    
    // Animation loop with performance optimizations
    function animate(timestamp) {
        // Throttle frame rate for smoother performance on lower-end devices
        if (timestamp - lastFrameTime < frameBudget) {
            requestAnimationFrame(animate);
            return;
        }
        
        lastFrameTime = timestamp;
        
        // Use a stable frame-independent update
        stickers.forEach(updateSticker);
        
        requestAnimationFrame(animate);
    }
    
    // Start animation with requestAnimationFrame
    requestAnimationFrame(animate);
    
    // Create a new sticker element - optimized
    function createSticker() {
        // Get a random sticker path
        const randomStickerPath = config.stickerPaths[Math.floor(Math.random() * config.stickerPaths.length)];
        
        // Create sticker element
        const sticker = document.createElement('img');
        
        // Set src to preloaded image or path
        if (config.stickerCache[randomStickerPath]) {
            sticker.src = config.stickerCache[randomStickerPath].src;
        } else {
            sticker.src = randomStickerPath;
        }
        
        // Add loading="lazy" and alt text for accessibility
        sticker.loading = "lazy";
        sticker.alt = "Falling sticker"; // Added alt text
        
        // Random size - constrained for better performance
        const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        sticker.style.width = `${size}px`;
        
        // Initial position (random x, off-screen y)
        const x = Math.random() * window.innerWidth;
        const y = -size - Math.random() * (window.innerHeight / 2); // Start above viewport
        
        // Set position - use transform for better performance
        sticker.style.position = 'fixed';
        sticker.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
        sticker.style.willChange = 'transform'; // Hint for browser optimization
        
        // Other styles
        sticker.style.pointerEvents = 'none'; // Don't interfere with clicks
        sticker.className = 'falling-sticker';
        
        // Random rotation and movement properties
        const stickerData = {
            element: sticker,
            x: x,
            y: y,
            speed: Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed,
            size: size,
            rotation: Math.random() * 360, // Initial rotation
            rotationSpeed: (Math.random() * 2 - 1) * config.rotationSpeed, // Random direction and speed
            horizontalMovement: Math.random() * 0.5 - 0.25 // Reduced horizontal drift for less jitter
        };
        
        // Add to DOM and to stickers array
        container.appendChild(sticker);
        stickers.push(stickerData);
    }
    
    // Update sticker position and rotation - optimized
    function updateSticker(sticker) {
        // Update position
        sticker.y += sticker.speed;
        sticker.x += sticker.horizontalMovement;
        
        // Update rotation
        sticker.rotation += sticker.rotationSpeed;
        
        // Apply updates with transform for better performance
        sticker.element.style.transform = `translate(${sticker.x}px, ${sticker.y}px) rotate(${sticker.rotation}deg)`;
        
        // If off screen, reset
        if (sticker.y > window.innerHeight) {
            // Remove from DOM
            container.removeChild(sticker.element);
            
            // Remove from array using optimized method
            const index = stickers.indexOf(sticker);
            if (index > -1) {
                stickers.splice(index, 1);
            }
            
            // Create new sticker
            createSticker();
        }
    }
    
    // Handle window resize - debounced for better performance
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle stickers that might be off-screen after resize
            stickers.forEach(sticker => {
                if (sticker.x > window.innerWidth) {
                    sticker.x = Math.random() * window.innerWidth;
                    sticker.element.style.transform = `translate(${sticker.x}px, ${sticker.y}px) rotate(${sticker.rotation}deg)`;
                }
            });
        }, 100);
    });
    
    // Start creating stickers after a short delay to allow page to render first
    setTimeout(initializeStickers, 300);
});
