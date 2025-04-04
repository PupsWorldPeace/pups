// === Main JavaScript for Creative Portfolio ===

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageGridContainer = document.querySelector('.image-grid-container');
    
    // Home page image grid (if on index page)
    if (imageGridContainer) {
        
        let allMedia = []; // To store media data from JSON
        
        // Fetch media data from JSON manifest
        async function loadMediaData() {
            try {
                const response = await fetch('media-manifest.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                allMedia = await response.json();
                // Once data is loaded, create the grid
                createGrid(); 
            } catch (error) {
                console.error("Could not load media manifest:", error);
                imageGridContainer.innerHTML = '<p style="color: white; text-align: center; padding: 20px;">Error loading media gallery.</p>';
            }
        }
        
        // Shuffle array for random distribution
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        // Create grid items 
        function createGridItem(mediaItem) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            if (mediaItem.type === 'image') {
                const img = document.createElement('img');
                img.src = mediaItem.src;
                // Use title for alt text, provide default if missing
                img.alt = mediaItem.title || 'Creative Image'; 
                img.loading = 'lazy';
                gridItem.appendChild(img);
            } else if (mediaItem.type === 'video') { // Check type explicitly
                const video = document.createElement('video');
                video.src = mediaItem.src;
                video.muted = true;
                video.autoplay = true;
                video.loop = true;
                video.playsInline = true; // Important for iOS inline playback
                video.controls = false; // Hide default controls
                gridItem.appendChild(video);
            }
            
            return gridItem;
        }
        
        // Create the grid with true infinite scroll
        function createGrid() {
            // Ensure media data is loaded before creating grid
            if (allMedia.length === 0) {
                console.log("Media data not loaded yet, skipping grid creation.");
                return; 
            }

            // Clear the container
            imageGridContainer.innerHTML = '';
            
            // Create the main scrolling element
            const imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            
            // Calculate layout for responsive design
            const viewportWidth = window.innerWidth;
            const itemWidth = 220; // Width of each grid item
            const gap = 8; // Gap between items
            const columns = Math.max(1, Math.floor(viewportWidth / (itemWidth + gap)));
            
            // For perfect infinite scroll, we need a specific pattern
            // Create two identical sections, second is a copy of first
            // Animation moves exactly 50% of total height
            
            // Create a large enough pattern to fill more than the screen
            // This ensures there's no empty space during scrolling
            const viewportHeight = window.innerHeight;
            const itemsPerColumn = Math.ceil((viewportHeight * 1.5) / (itemWidth + gap)); // Ensure enough items vertically
            const totalItemsPerSection = Math.max(columns * itemsPerColumn, allMedia.length * 2); // Ensure enough items to avoid gaps if few media items exist
            
            // Create first grid section
            const section1 = document.createElement('div');
            section1.className = 'grid-section';
            
            // Shuffle media before filling sections
            const shuffledMedia = shuffleArray([...allMedia]);
            
            // Fill first section
            for (let i = 0; i < totalItemsPerSection; i++) {
                const mediaIndex = i % shuffledMedia.length;
                if (!shuffledMedia[mediaIndex]) continue; // Skip if index is out of bounds (safety check)
                const gridItem = createGridItem(shuffledMedia[mediaIndex]);
                section1.appendChild(gridItem);
            }
            
            // Add first section to grid
            imageGrid.appendChild(section1);
            
            // Create identical second section
            // Must be exact duplicate for seamless infinite scroll
            const section2 = section1.cloneNode(true);
            imageGrid.appendChild(section2);
            
            // Add to container
            imageGridContainer.appendChild(imageGrid);
            
            // Start videos playing (use Intersection Observer for better performance later)
            // For now, attempt to play all
            document.querySelectorAll('.image-grid video').forEach(video => {
                video.play().catch((e) => {
                    // console.log('Autoplay prevented for a video:', e); 
                    // Autoplay might be blocked by browser, which is expected.
                }); 
            });
        }
        
        // Load media data first, then create grid
        loadMediaData();
        
        // Update grid on window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(createGrid, 300);
        });
    }
    
    // For all pages - handle navigation
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Remove active class from all buttons
            document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
});
