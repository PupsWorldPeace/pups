// Rewritten Video Gallery Logic (using Manifest)
document.addEventListener('DOMContentLoaded', function() {
    console.log("videos.js: DOMContentLoaded");
    const videoGallery = document.getElementById('videos-gallery');
    const videoModal = document.getElementById('video-modal'); 

    if (!videoGallery || !videoModal) {
        console.error("videos.js: Gallery or Modal element not found!");
        return;
    }

    let galleryData = []; // Holds the filtered video data
    let currentVideoIndex = -1; // Track modal index

    // --- Modal Element References ---
    const modalVideoEl = videoModal.querySelector('#modal-video');
    const downloadMp4Btn = videoModal.querySelector('#download-video-mp4'); 
    const closeModalBtnEl = videoModal.querySelector('.modal-close');
    const prevBtnEl = videoModal.querySelector('.modal-prev');
    const nextBtnEl = videoModal.querySelector('.modal-next');
    // Optional title/description elements if needed later
    // const videoTitleEl = videoModal.querySelector('#video-title'); 
    // const videoDescriptionEl = videoModal.querySelector('#video-description');

    // --- Fetch and Process Manifest ---
    async function loadVideoGallery() {
        videoGallery.innerHTML = '<p id="loading-message">Loading videos...</p>';
        console.log("videos.js: Loading message set.");
        
        try {
            const response = await fetch('media-manifest.json');
            console.log(`videos.js: Fetch status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMedia = await response.json();
            console.log("videos.js: Manifest parsed.");

            if (!Array.isArray(allMedia)) {
                 throw new Error("Manifest data is not an array.");
            }

            galleryData = allMedia.filter(item => item && item.type === 'video');
            console.log(`videos.js: Found ${galleryData.length} videos.`);

            renderGallery();
            // addFilterButtons(); // Add filters after data is loaded - Temporarily disabled

        } catch (error) {
            console.error("videos.js: Error loading video gallery:", error);
            // Use CSS class for error message
            videoGallery.innerHTML = `<p id="loading-message" class="loading-error">Error loading videos: ${error.message}.</p>`; 
        }
    }

    // --- Render Gallery Items ---
    function renderGallery() {
        videoGallery.innerHTML = ''; // Clear loading message
        if (galleryData.length === 0) {
            videoGallery.innerHTML = '<p>No videos found.</p>';
            return;
        }
        
        console.log("videos.js: Rendering gallery items...");
        galleryData.forEach((item, index) => {
            if (!item || !item.src || !item.thumbnail) {
                console.warn(`videos.js: Skipping video item at index ${index}, missing src or thumbnail.`);
                return; 
            }
            try {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item video-item'; 
                galleryItem.dataset.index = index; // Store index
                galleryItem.dataset.category = (item.category || 'other').toLowerCase();

                const videoPreview = document.createElement('div');
                videoPreview.className = 'video-preview'; 

                // Create a video element for the thumbnail
                const videoThumb = document.createElement('video');
                videoThumb.src = item.src; // Use the actual video source
                videoThumb.alt = item.title || 'Video Preview'; // Use alt for video too
                videoThumb.preload = 'metadata'; // Load only first frame for thumbnail
                videoThumb.muted = true; // Mute thumbnail video
                videoThumb.playsInline = true; // Important for iOS
                videoThumb.className = 'video-thumbnail'; // Add class for styling if needed
                // Ensure it doesn't have controls
                videoThumb.controls = false; 

                videoThumb.onerror = () => {
                    console.error(`videos.js: Failed to load video for thumbnail: ${videoThumb.src}`);
                    // Add error class instead of inline style
                    videoPreview.innerHTML = '<p class="video-preview-error">Error loading preview</p>'; 
                };

                const playButton = document.createElement('div');
                playButton.className = 'play-button'; 
                playButton.innerHTML = '<i class="fas fa-play"></i>'; 

                // Append video thumbnail and play button
                videoPreview.appendChild(videoThumb); 
                videoPreview.appendChild(playButton);
                galleryItem.appendChild(videoPreview);
                
                // Add click listener for modal
                galleryItem.addEventListener('click', () => {
                    openModal(index);
                });

                videoGallery.appendChild(galleryItem);
            } catch(e) {
                 console.error(`videos.js: Error creating gallery item ${index}:`, e);
            }
        });
        console.log("videos.js: Finished rendering gallery items.");
        setupModalNavListeners(); // Setup listeners after items are rendered
    }
    
    // --- Modal Logic ---
    function openModal(index) {
         if (index < 0 || index >= galleryData.length || !videoModal || !modalVideoEl || !downloadMp4Btn) {
            console.error("videos.js: Cannot open modal - invalid index or modal elements missing.");
            return;
        }
        
        currentVideoIndex = index;
        const video = galleryData[currentVideoIndex];

        console.log(`videos.js: Opening modal for video index ${index}: ${video.src}`);
        modalVideoEl.src = video.src;
        
        const filenameBase = (video.title || `video-${index}`).toLowerCase().replace(/\s+/g, '-');
        downloadMp4Btn.onclick = () => downloadFile(video.src, `${filenameBase}.mp4`);

        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        modalVideoEl.load(); 
        const playPromise = modalVideoEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("videos.js: Autoplay was prevented:", error);
            });
        }
    }

    function closeModal() {
        if (!videoModal || !modalVideoEl) return;
        modalVideoEl.pause();
        modalVideoEl.src = ''; 
        modalVideoEl.removeAttribute('src'); 
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log("videos.js: Modal closed.");
    }

    function navigateModal(direction) {
        if (galleryData.length === 0) return;
        let newIndex = currentVideoIndex + direction;
        if (newIndex < 0) newIndex = galleryData.length - 1;
        else if (newIndex >= galleryData.length) newIndex = 0;
        openModal(newIndex);
    }

    function setupModalNavListeners() {
         if (closeModalBtnEl) closeModalBtnEl.addEventListener('click', closeModal);
         if (prevBtnEl) prevBtnEl.addEventListener('click', () => navigateModal(-1)); 
         if (nextBtnEl) nextBtnEl.addEventListener('click', () => navigateModal(1)); 

         document.addEventListener('keydown', (e) => {
             if (videoModal && getComputedStyle(videoModal).display === 'flex') { 
                 if (e.key === 'Escape') closeModal();
                 else if (e.key === 'ArrowLeft') navigateModal(-1);
                 else if (e.key === 'ArrowRight') navigateModal(1);
             }
         });

         videoModal.addEventListener('click', (e) => {
             if (e.target === videoModal) closeModal();
         });
    }

    // --- Filter Logic --- (Removed commented-out function)
    
    // --- Helpers ---
    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 100);
    }

    // Removed unused capitalizeFirstLetter helper function

    // --- Initialize ---
    loadVideoGallery();

});
