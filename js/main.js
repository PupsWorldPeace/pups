// === Main JavaScript for Creative Portfolio ===

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageGridContainer = document.querySelector('.image-grid-container');
    
    // Home page image grid (if on index page)
    if (imageGridContainer) {
        // Image files
        const imageFiles = [
            'assets/images/by_charlie69746042_post_03ec3b28_4350_4e19_acbe_4f495a269128.webp',
            'assets/images/by_lordworldpeace_post_00da90fa_4116_4ac6_bbd5_d18b0b0d1414.webp',
            'assets/images/by_memedeckapp_post_023af0f9_bf65_4e52_8d9e_4eb2c898eef1.webp',
            'assets/images/by_charlie69746042_post_06bcd730_aa10_4ab7_9e3a_77cd5d405512.webp',
            'assets/images/by_lordworldpeace_post_074fdb15_29a5_4260_a3e2_35aaa5683e0e.webp',
            'assets/images/by_memedeckapp_post_084e5fb9_0f76_4c85_a0d3_f9dfc29b5aa6.webp',
            'assets/images/by_charlie69746042_post_0d55ff7d_03ca_4d55_8466_b4977b5ce8c1.webp',
            'assets/images/by_lordworldpeace_post_19be5b12_4648_4f10_b0f8_ea35436a6eb2.webp',
            'assets/images/by_memedeckapp_post_091735f2_42b1_4f4f_ad51_950a694d9b4f.webp'
        ];
        
        // Video files
        const videoFiles = [
            'assets/videos/corn.mp4',
            'assets/videos/couch.mp4',
            'assets/videos/trump.mp4'
        ];
        
        // Combine all media
        const allMedia = [];
        
        // Add images
        imageFiles.forEach(img => {
            allMedia.push({type: 'image', src: img});
        });
        
        // Add videos
        videoFiles.forEach(vid => {
            allMedia.push({type: 'video', src: vid});
        });
        
        // Shuffle array for random distribution
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        const shuffledMedia = shuffleArray([...allMedia]);
        
        // Create grid items 
        function createGridItem(mediaItem) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            if (mediaItem.type === 'image') {
                const img = document.createElement('img');
                img.src = mediaItem.src;
                img.alt = 'Creative Image';
                img.loading = 'lazy';
                gridItem.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.src = mediaItem.src;
                video.muted = true;
                video.autoplay = true;
                video.loop = true;
                video.playsinline = true;
                video.controls = false;
                gridItem.appendChild(video);
            }
            
            return gridItem;
        }
        
        // Create the grid with true infinite scroll
        function createGrid() {
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
            const itemsPerColumn = Math.ceil((viewportHeight * 1.5) / (itemWidth + gap));
            const totalItemsPerSection = columns * itemsPerColumn;
            
            // Create first grid section
            const section1 = document.createElement('div');
            section1.className = 'grid-section';
            
            // Fill first section
            for (let i = 0; i < totalItemsPerSection; i++) {
                const mediaIndex = i % shuffledMedia.length;
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
            
            // Start videos playing
            document.querySelectorAll('video').forEach(video => {
                video.play().catch(() => {}); // Silent catch
            });
        }
        
        // Create initial grid
        createGrid();
        
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
