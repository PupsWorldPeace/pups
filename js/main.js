// Rewritten Main Homepage Logic (using Manifest)
document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js: DOMContentLoaded");
    const imageGridContainer = document.querySelector('.image-grid-container');
    
    if (!imageGridContainer) {
        console.log("main.js: No .image-grid-container found, assuming not homepage.");
        setupNavButtons(); // Still setup nav buttons on other pages
        return;
    }

    let allMedia = []; // Holds data from manifest

    // --- Fetch and Process Manifest ---
    async function loadHomepageGrid() {
        imageGridContainer.innerHTML = '<p style="color: white; padding: 20px;">Loading slideshow...</p>';
        console.log("main.js: Loading message set.");

        try {
            const response = await fetch('media-manifest.json');
            console.log(`main.js: Fetch status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allMedia = await response.json();
            console.log("main.js: Manifest parsed.");

            if (!Array.isArray(allMedia)) {
                 throw new Error("Manifest data is not an array.");
            }
            console.log(`main.js: Found ${allMedia.length} media items.`);

            createGrid(); // Create grid once data is loaded

        } catch (error) {
            console.error("main.js: Error loading homepage grid:", error);
            // Use CSS class for error message
            imageGridContainer.innerHTML = `<p class="loading-error">Error loading slideshow: ${error.message}.</p>`; 
        }
    }

    // --- Grid Creation Logic ---
    function createGrid() {
        if (allMedia.length === 0) {
            console.log("main.js: No media data available to create grid.");
            // Use CSS class for no media message
            imageGridContainer.innerHTML = '<p class="no-media-message">No media found.</p>'; 
            return;
        }

        imageGridContainer.innerHTML = ''; // Clear loading message
        const imageGrid = document.createElement('div');
        imageGrid.className = 'image-grid';

        // Calculate layout based on viewport and item size
        const viewportWidth = window.innerWidth;
        const isMobileView = viewportWidth <= 768; // Match CSS media query
        const itemWidth = isMobileView ? 120 : 220; 
        const gap = 8; 
        const columns = Math.max(1, Math.floor(viewportWidth / (itemWidth + gap)));
        
        // Calculate items needed for seamless scroll (increased buffer)
        const viewportHeight = window.innerHeight;
        // Increase buffer slightly for smoother scrolling with lazy loading
        const itemsPerColumn = Math.ceil((viewportHeight * 3) / (itemWidth + gap)); 
        // Create only enough items for viewport + buffer, not duplicating the entire manifest
        const totalItemsPerSection = columns * itemsPerColumn; 
        console.log(`main.js: Grid params - cols: ${columns}, itemW: ${itemWidth}, itemsPerCol: ${itemsPerColumn}, totalItemsPerSection: ${totalItemsPerSection}`);

        // Create two identical sections
        const section1 = document.createElement('div');
        section1.className = 'grid-section';
        const section2 = document.createElement('div');
        section2.className = 'grid-section';

        const shuffledMedia = shuffleArray([...allMedia]); // Shuffle a copy

        // Populate sections
        for (let i = 0; i < totalItemsPerSection; i++) {
            const mediaIndex = i % shuffledMedia.length;
            if (!shuffledMedia[mediaIndex]) continue; 
            
            const gridItem1 = createGridItem(shuffledMedia[mediaIndex]);
            const gridItem2 = createGridItem(shuffledMedia[mediaIndex]); // Create identical item for second section
            
            if (gridItem1) section1.appendChild(gridItem1);
            if (gridItem2) section2.appendChild(gridItem2);
        }

        imageGrid.appendChild(section1);
        imageGrid.appendChild(section2);
        imageGridContainer.appendChild(imageGrid);
        console.log("main.js: Grid sections created and appended.");

        // REMOVED: Explicit video play loop. IntersectionObserver in performance-boost.js handles this.
    }

    // --- Create Single Grid Item ---
    function createGridItem(mediaItem) {
        if (!mediaItem || !mediaItem.src) return null; // Basic validation

        try {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            if (mediaItem.type === 'image') {
                const img = document.createElement('img');
                // Use data-src for IntersectionObserver lazy loading
                img.dataset.src = mediaItem.src; 
                // Optional: Add a placeholder src (e.g., tiny transparent gif) or rely on CSS sizing
                // img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; 
                img.alt = mediaItem.title || 'Slideshow Image'; 
                // Remove native lazy loading; observer handles it
                // img.loading = 'lazy'; 
                img.onerror = () => console.error(`main.js: Failed to load image ${img.dataset.src}`); // Log data-src on error
                gridItem.appendChild(img);
            } else if (mediaItem.type === 'video') {
                const video = document.createElement('video');
                video.src = mediaItem.src;
                video.muted = true;
                // Remove autoplay; IntersectionObserver handles playback
                // video.autoplay = true; 
                video.loop = true;
                video.playsInline = true; 
                video.controls = false; 
                video.onerror = () => console.error(`main.js: Failed to load video ${video.src}`);
                gridItem.appendChild(video);
            } else {
                console.warn(`main.js: Unknown media type for item:`, mediaItem);
                return null; // Skip unknown types
            }
            return gridItem;
        } catch (e) {
            console.error(`main.js: Error creating grid item for:`, mediaItem, e);
            return null;
        }
    }

    // --- Helper: Shuffle Array ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Resize Handling ---
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createGrid, 300); // Recreate grid on resize
    });

    // --- Initialize ---
    loadHomepageGrid(); 
    setupNavButtons(); // Setup nav buttons regardless of page

    // --- Navigation Button Active State ---
    function setupNavButtons() {
         // This part handles the 'active' class on nav buttons based on current page
         const currentPage = window.location.pathname.split('/').pop() || 'index.html';
         document.querySelectorAll('.nav-links .nav-button').forEach(btn => {
             const btnPage = btn.getAttribute('href').split('/').pop() || 'index.html';
             if (btnPage === currentPage) {
                 btn.classList.add('active');
             } else {
                 btn.classList.remove('active');
             }
             // Keep simple click listener to visually update (though page reload happens)
             btn.addEventListener('click', function() {
                 document.querySelectorAll('.nav-links .nav-button').forEach(b => b.classList.remove('active'));
                 this.classList.add('active');
             });
         });
         console.log("main.js: Nav button states set.");
    }

});
