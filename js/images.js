// Rewritten Image Gallery Logic (using Manifest)
document.addEventListener('DOMContentLoaded', function() {
    console.log("images.js: DOMContentLoaded");
    const photoGallery = document.getElementById('images-gallery');
    const photoModal = document.getElementById('image-modal'); 

    if (!photoGallery || !photoModal) {
        console.error("images.js: Gallery or Modal element not found!");
        return;
    }

    let galleryData = []; // Holds the filtered image data
    let currentImageIndex = -1; // Track modal index

    // --- Modal Element References ---
    const modalImg = photoModal.querySelector('#modal-image');
    const downloadWebpBtn = photoModal.querySelector('#download-image-webp');
    const downloadPngBtn = photoModal.querySelector('#download-image-png'); 
    const closeBtn = photoModal.querySelector('.modal-close');
    const prevBtn = photoModal.querySelector('.modal-prev');
    const nextBtn = photoModal.querySelector('.modal-next');

    // --- Fetch and Process Manifest ---
    async function loadImageGallery() {
        photoGallery.innerHTML = '<p id="loading-message">Loading images...</p>';
        console.log("images.js: Loading message set.");
        
        try {
            const response = await fetch('media-manifest.json');
            console.log(`images.js: Fetch status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMedia = await response.json();
            console.log("images.js: Manifest parsed.");

            if (!Array.isArray(allMedia)) {
                 throw new Error("Manifest data is not an array.");
            }

            // Filter for images EXCLUDING category "meme" and assign unique ID
            galleryData = allMedia
                .filter(item => item && item.type === 'image' && item.category !== 'meme') // Exclude memes
                .map((item, index) => ({ ...item, id: index })); // Assign index as ID
            console.log(`images.js: Found ${galleryData.length} images (excluding memes).`);

            renderGallery();

        } catch (error) {
            console.error("images.js: Error loading image gallery:", error);
            // Use CSS class for error message
            photoGallery.innerHTML = `<p id="loading-message" class="loading-error">Error loading images: ${error.message}.</p>`; 
        }
    }

    // --- Render Gallery Items ---
    function renderGallery() {
        photoGallery.innerHTML = ''; // Clear loading message
        if (galleryData.length === 0) {
            photoGallery.innerHTML = '<p>No images found.</p>';
            return;
        }
        
        console.log("images.js: Rendering gallery items...");
        galleryData.forEach((item, index) => {
            if (!item || !item.src) {
                console.warn(`images.js: Skipping image item at index ${index}, missing data.`);
                return; 
            }
            try {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item'; 
                galleryItem.dataset.index = index; // Store index for modal navigation

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.title || 'Gallery Image'; 
                img.loading = 'lazy';
                
                img.onerror = () => {
                    console.error(`images.js: Failed to load image: ${img.src}`);
                    // Use CSS class for error message
                    galleryItem.innerHTML = `<p class="image-load-error">Load Error</p>`; 
                };

                galleryItem.appendChild(img);
                
                // Add click listener for modal
                galleryItem.addEventListener('click', () => {
                    openModal(index);
                });

                photoGallery.appendChild(galleryItem);
            } catch(e) {
                 console.error(`images.js: Error creating gallery item ${index}:`, e);
            }
        });
        console.log("images.js: Finished rendering gallery items.");
        setupModalNavListeners(); // Setup listeners after items are rendered
    }

    // --- Modal Logic ---
    function openModal(index) {
        if (index < 0 || index >= galleryData.length || !photoModal || !modalImg || !downloadWebpBtn) {
            console.error("images.js: Cannot open modal - invalid index or modal elements missing.");
            return;
        }
        
        currentImageIndex = index;
        const image = galleryData[currentImageIndex];

        modalImg.src = image.src;
        modalImg.alt = image.title || 'Gallery Image';

        const filenameBase = (image.title || `image-${index}`).toLowerCase().replace(/\s+/g, '-');
        downloadWebpBtn.onclick = () => downloadFile(image.src, `${filenameBase}.webp`);
        // if (downloadPngBtn) downloadPngBtn.onclick = () => downloadFile(image.src, `${filenameBase}.png`); // Optional

        photoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!photoModal) return;
        photoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function navigateModal(direction) {
        if (galleryData.length === 0) return;
        let newIndex = currentImageIndex + direction;
        if (newIndex < 0) newIndex = galleryData.length - 1;
        else if (newIndex >= galleryData.length) newIndex = 0;
        openModal(newIndex);
    }

    function setupModalNavListeners() {
         if (closeBtn) closeBtn.addEventListener('click', closeModal);
         if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1)); 
         if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1)); 

         document.addEventListener('keydown', (e) => {
             if (photoModal && getComputedStyle(photoModal).display === 'flex') { 
                 if (e.key === 'Escape') closeModal();
                 else if (e.key === 'ArrowLeft') navigateModal(-1);
                 else if (e.key === 'ArrowRight') navigateModal(1);
             }
         });

         photoModal.addEventListener('click', (e) => {
             if (e.target === photoModal) closeModal();
         });
    }
    
    // --- Helper ---
    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 100);
    }

    // --- Initialize ---
    loadImageGallery();

});
