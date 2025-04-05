// JavaScript for the Meme gallery
document.addEventListener('DOMContentLoaded', function() {
    console.log("memes.js: DOMContentLoaded event fired.");
    const memeGallery = document.getElementById('memes-gallery'); 
    const memeModal = document.getElementById('meme-modal'); 

    if (!memeGallery || !memeModal) {
        console.error("memes.js: Gallery or Modal element not found!");
        return;
    }

    let galleryData = []; // Holds the filtered meme data
    let currentMemeIndex = -1; // Track modal index

    // --- Modal Element References ---
    const modalImg = memeModal.querySelector('#modal-meme-image'); 
    const downloadWebpBtn = memeModal.querySelector('#download-meme-webp');
    const downloadPngBtn = memeModal.querySelector('#download-meme-png'); 
    const closeBtn = memeModal.querySelector('.modal-close');
    const prevBtn = memeModal.querySelector('.modal-prev');
    const nextBtn = memeModal.querySelector('.modal-next');

    // --- Fetch and Process Manifest ---
    async function loadMemeGallery() {
        memeGallery.innerHTML = '<p id="loading-message">Loading memes...</p>';
        console.log("memes.js: Loading message set.");
        
        try {
            const response = await fetch('media-manifest.json');
            console.log(`memes.js: Fetch status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMedia = await response.json();
            console.log("memes.js: Manifest parsed.");

            if (!Array.isArray(allMedia)) {
                 throw new Error("Manifest data is not an array.");
            }

            // Filter specifically for category "meme" (which are type "image") and assign ID
            galleryData = allMedia
                .filter(item => item && item.type === 'image' && item.category === 'meme') // Only memes
                .map((item, index) => ({ ...item, id: index })); // Assign index as ID
            console.log(`memes.js: Found ${galleryData.length} memes.`);

            renderGallery();

        } catch (error) {
            console.error("memes.js: Error loading meme gallery:", error);
            // Use CSS class for error message
            memeGallery.innerHTML = `<p id="loading-message" class="loading-error">Error loading memes: ${error.message}.</p>`; 
        }
    }

    // --- Render Gallery Items ---
    function renderGallery() {
        memeGallery.innerHTML = ''; // Clear loading message
        if (galleryData.length === 0) {
            memeGallery.innerHTML = '<p>No memes found.</p>';
            return;
        }
        
        console.log("memes.js: Rendering gallery items...");
        galleryData.forEach((item, index) => {
            if (!item || !item.src) {
                console.warn(`memes.js: Skipping meme item at index ${index}, missing data.`);
                return; 
            }
            try {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item'; // Use same gallery item class
                galleryItem.dataset.index = index; // Store index for modal navigation

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.title || 'Meme Image'; 
                img.loading = 'lazy';
                
                img.onerror = () => {
                    console.error(`memes.js: Failed to load image: ${img.src}`);
                    // Use CSS class for error message
                    galleryItem.innerHTML = `<p class="image-load-error">Load Error</p>`; 
                };

                galleryItem.appendChild(img);
                
                // Add click listener for modal
                galleryItem.addEventListener('click', () => {
                    openModal(index);
                });

                memeGallery.appendChild(galleryItem);
            } catch(e) {
                 console.error(`memes.js: Error creating gallery item ${index}:`, e);
            }
        });
        console.log("memes.js: Finished rendering gallery items.");
        setupModalNavListeners(); // Setup listeners after items are rendered
    }

    // --- Modal Logic ---
    function openModal(index) {
        if (index < 0 || index >= galleryData.length || !memeModal || !modalImg || !downloadWebpBtn) {
            console.error("memes.js: Cannot open modal - invalid index or modal elements missing.");
            return;
        }
        
        currentMemeIndex = index;
        const meme = galleryData[currentMemeIndex];

        modalImg.src = meme.src;
        modalImg.alt = meme.title || 'Meme Image';

        const filenameBase = (meme.title || `meme-${index}`).toLowerCase().replace(/\s+/g, '-');
        const extension = meme.src.split('.').pop() || 'webp'; 
        downloadWebpBtn.onclick = () => downloadFile(meme.src, `${filenameBase}.${extension}`); 
        // if (downloadPngBtn) downloadPngBtn.onclick = () => downloadFile(meme.src, `${filenameBase}.png`); // Optional

        memeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!memeModal) return;
        memeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function navigateModal(direction) {
        if (galleryData.length === 0) return;
        let newIndex = currentMemeIndex + direction;
        if (newIndex < 0) newIndex = galleryData.length - 1;
        else if (newIndex >= galleryData.length) newIndex = 0;
        openModal(newIndex);
    }

    function setupModalNavListeners() {
         if (closeBtn) closeBtn.addEventListener('click', closeModal);
         if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1)); 
         if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1)); 

         document.addEventListener('keydown', (e) => {
             if (memeModal && getComputedStyle(memeModal).display === 'flex') { 
                 if (e.key === 'Escape') closeModal();
                 else if (e.key === 'ArrowLeft') navigateModal(-1);
                 else if (e.key === 'ArrowRight') navigateModal(1);
             }
         });

         memeModal.addEventListener('click', (e) => {
             if (e.target === memeModal) closeModal();
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
    loadMemeGallery();

});
