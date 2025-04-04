// === Videos JavaScript for Video Gallery Page ===

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const videoGallery = document.getElementById('video-gallery');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const downloadLink = document.getElementById('download-link');
    const closeModalBtn = videoModal ? videoModal.querySelector('.modal-close') : null; // Check if modal exists
    const prevBtn = videoModal ? videoModal.querySelector('.modal-prev') : null; // Get nav buttons
    const nextBtn = videoModal ? videoModal.querySelector('.modal-next') : null; // Get nav buttons

    let videos = []; // Will hold video data from manifest
    let currentVideoIndex = -1; // Keep track using the index in the 'videos' array

    // Fetch media data and filter for videos
    async function loadVideoData() {
        // Show loading message
        if (videoGallery) {
            videoGallery.innerHTML = '<p id="loading-message">Loading videos...</p>';
        } else {
            console.error("Video gallery container not found!");
            return; // Exit if gallery container doesn't exist
        }

        try {
            const response = await fetch('media-manifest.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMedia = await response.json();
            // Filter for videos and assign a unique ID based on index within the filtered array
            videos = allMedia
                .filter(item => item.type === 'video')
                .map((item, index) => ({ ...item, id: index })); // Assign index as ID

            // Clear loading message / previous content first
            videoGallery.innerHTML = ''; 

            if (videos.length === 0) {
                 videoGallery.innerHTML = '<p id="loading-message">No videos found.</p>';
            } else {
                displayVideos(); // Create gallery now that loading message is cleared
                addFilterButtons(); // Add filters based on loaded data
            }
        } catch (error) {
            console.error("Could not load video data from media-manifest.json:", error); // More specific error
             if (videoGallery) {
                 // Display the actual error message for debugging
                videoGallery.innerHTML = `<p id="loading-message" style="color: red;">Error loading video gallery: ${error.message}. Check console.</p>`;
            }
        }
    }

    // Display videos in the gallery
    function displayVideos() {
        if (!videoGallery) return; // Safety check
        videoGallery.innerHTML = ''; // Clear loading message or previous items
        
        videos.forEach((video, index) => { // Use index from filtered data
            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item video-item';
            galleryItem.dataset.id = video.id; // Use the index-based ID
            galleryItem.dataset.category = (video.category || 'other').toLowerCase(); // Use category from JSON, default to 'other'
            
            // Create video preview container
            const videoPreview = document.createElement('div');
            videoPreview.className = 'video-preview';
            
            // Create video thumbnail using the 'thumbnail' property from JSON
            const thumbnail = document.createElement('img');
            // Use video.thumbnail if available, otherwise a default or leave blank
            thumbnail.src = video.thumbnail || 'assets/images/video-placeholder.jpg'; // Use placeholder if no thumbnail specified
            thumbnail.alt = video.title || 'Video Thumbnail'; // Use title from JSON for alt text
            thumbnail.loading = 'lazy'; // Add lazy loading for better performance
            
            // Create video play button overlay
            const playButton = document.createElement('div');
            playButton.className = 'play-button'; // Use existing CSS class
            playButton.innerHTML = '<i class="fas fa-play"></i>'; // Font Awesome play icon
            
            // Create item details
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            
            // Create title
            const itemTitle = document.createElement('h3');
            itemTitle.className = 'item-title';
            itemTitle.textContent = video.title || 'Untitled Video'; // Use title from JSON
            
            // Create category
            const itemCategory = document.createElement('p');
            itemCategory.className = 'item-category';
            itemCategory.textContent = capitalizeFirstLetter(video.category || 'Other'); // Use category from JSON
            
            // Append elements
            videoPreview.appendChild(thumbnail);
            videoPreview.appendChild(playButton);
            itemDetails.appendChild(itemTitle);
            itemDetails.appendChild(itemCategory);
            
            galleryItem.appendChild(videoPreview);
            galleryItem.appendChild(itemDetails);
            
            // Add click event listener - use the item's assigned ID
            galleryItem.addEventListener('click', () => {
                openVideoModal(video.id); // Pass the unique ID
            });
            
            videoGallery.appendChild(galleryItem);
            
            // Add animation delay for staggered appearance
            setTimeout(() => {
                galleryItem.classList.add('show');
            }, index * 100); // Use index from the loop
        });
    }

    // Open video modal with the selected video using its ID
    function openVideoModal(videoId) {
        // Find the index of the video with the matching ID
        const videoIndex = videos.findIndex(v => v.id === videoId);
        if (videoIndex === -1 || !videoModal || !modalVideo || !videoTitle || !videoDescription || !downloadLink) {
             console.error("Modal elements not found or video data missing.");
             return; // Exit if elements or video data are missing
        }
        
        currentVideoIndex = videoIndex; // Store the current index
        const video = videos[currentVideoIndex]; // Get video data using index
        
        // Update modal content
        modalVideo.src = video.src;
        videoTitle.textContent = video.title || 'Untitled Video';
        // Use a default description if none provided in JSON
        videoDescription.textContent = video.description || `A creative ${video.category || 'other'} video.`;
        
        // Set up download link
        downloadLink.href = video.src;
        // Generate download filename from title or use a default
        const downloadFilename = video.title ? `${video.title.toLowerCase().replace(/\s+/g, '-')}.mp4` : `video-${video.id}.mp4`;
        downloadLink.download = downloadFilename;
        
        // Show modal
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Load and play the video
        modalVideo.load(); // Ensure the video is loaded
        
        // Attempt to play the video
        // Use a promise to handle potential autoplay restrictions
        const playPromise = modalVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay was prevented:", error);
                // Optionally show a play button overlay inside the modal if autoplay fails
            });
        }
    }

    // Close video modal
    function closeVideoModal() {
        if (!videoModal || !modalVideo) return; // Safety check
        // Pause the video
        modalVideo.pause();
        
        // Hide modal
        videoModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear the source to free up resources
        modalVideo.src = '';
        modalVideo.removeAttribute('src'); // Ensure source is fully cleared
    }

    // Navigate to previous video
    function prevVideo() {
        if (videos.length === 0) return;
        currentVideoIndex = (currentVideoIndex === 0) ? videos.length - 1 : currentVideoIndex - 1;
        openVideoModal(videos[currentVideoIndex].id); // Open using the ID
    }
    
    // Navigate to next video
    function nextVideo() {
         if (videos.length === 0) return;
        currentVideoIndex = (currentVideoIndex === videos.length - 1) ? 0 : currentVideoIndex + 1;
        openVideoModal(videos[currentVideoIndex].id); // Open using the ID
    }

    // Event listener for close button (check if button exists)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeVideoModal);
    } else {
        console.warn("Close modal button not found.");
    }

    // Event listeners for nav buttons (check if buttons exist)
    if (prevBtn) {
        prevBtn.addEventListener('click', prevVideo);
    } else {
         console.warn("Previous button not found in video modal.");
    }
     if (nextBtn) {
        nextBtn.addEventListener('click', nextVideo);
    } else {
         console.warn("Next button not found in video modal.");
    }

    // Add keyboard navigation for modal (check if modal exists)
    document.addEventListener('keydown', (e) => {
        if (videoModal && videoModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeVideoModal();
            } else if (e.key === 'ArrowLeft') { // Add left arrow navigation
                prevVideo();
            } else if (e.key === 'ArrowRight') { // Add right arrow navigation
                nextVideo();
            }
        }
    });
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string = '') { // Add default value
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Add category filter buttons based on loaded video data
    function addFilterButtons() {
        if (videos.length === 0) return; // Don't add filters if no videos loaded

        // Get unique categories from the loaded video data
        const categories = ['All', ...new Set(videos.map(video => capitalizeFirstLetter(video.category || 'Other')))];
        
        // Check if filter container already exists, remove if it does to prevent duplicates
        let filterContainer = document.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.remove();
        }

        filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            // Use 'video-filter-btn' class as defined in CSS
            button.className = category === 'All' ? 'video-filter-btn active' : 'video-filter-btn'; 
            button.textContent = category;
            button.dataset.filter = category.toLowerCase(); // Store filter value

            button.addEventListener('click', () => {
                // Update active button state
                document.querySelectorAll('.video-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter videos based on data-category attribute
                const filterValue = button.dataset.filter;
                const galleryItems = document.querySelectorAll('.video-item');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block'; // Show matching items
                    } else {
                        item.style.display = 'none'; // Hide non-matching items
                    }
                });
            });
            
            filterContainer.appendChild(button);
        });
        
        // Insert filter container before the gallery (if gallery exists)
        if (videoGallery) {
             videoGallery.parentNode.insertBefore(filterContainer, videoGallery);
        } else {
            console.warn("Video gallery not found, cannot insert filters.");
        }
       
    }
    
    // Initialize the gallery by loading data
    if (videoGallery) { // Only load if the gallery element exists on the page
        loadVideoData();
    }
});
