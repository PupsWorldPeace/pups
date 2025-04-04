// JavaScript for the image gallery
document.addEventListener('DOMContentLoaded', function() {
    const photoGallery = document.getElementById('photo-gallery');
    const photoModal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const imageTitle = document.getElementById('image-title');
    const imageDescription = document.getElementById('image-description');
    const downloadLink = document.getElementById('download-photo-link');
    const closeBtn = photoModal.querySelector('.close-modal');
    const prevBtn = photoModal.querySelector('.prev-btn');
    const nextBtn = photoModal.querySelector('.next-btn');
    
    let galleryData = []; // Will hold image data from manifest
    let currentImageIndex = 0;

    // Fetch media data and filter for images
    async function loadImageData() {
        // Show loading message
        if (photoGallery) {
            photoGallery.innerHTML = '<p id="loading-message">Loading images...</p>';
        } else {
            console.error("Photo gallery container not found!");
            return; // Exit if gallery container doesn't exist
        }

        try {
            const response = await fetch('media-manifest.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMedia = await response.json();
            // Filter for images and assign a unique ID based on index
            galleryData = allMedia
                .filter(item => item.type === 'image')
                .map((item, index) => ({ ...item, id: index })); // Assign index as ID
            
            // Clear loading message / previous content first
            photoGallery.innerHTML = ''; 

            if (galleryData.length === 0) {
                 photoGallery.innerHTML = '<p id="loading-message">No images found.</p>';
            } else {
                createGalleryItems(); // Create gallery now that loading message is cleared
            }
        } catch (error) {
            console.error("Could not load image data from media-manifest.json:", error); // More specific error
             if (photoGallery) {
                // Display the actual error message for debugging
                photoGallery.innerHTML = `<p id="loading-message" style="color: red;">Error loading image gallery: ${error.message}. Check console.</p>`;
            }
        }
    }
    
    // Create gallery items from the loaded galleryData
    function createGalleryItems() {
        if (!photoGallery) return; // Safety check
        photoGallery.innerHTML = ''; // Clear loading message or previous items
        
        galleryData.forEach((item, index) => { // Use index from filtered data
            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.id = item.id; // Use the index-based ID
            galleryItem.dataset.category = item.category || 'other'; // Use category from JSON, default to 'other'
            
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'item-image';
            
            // Create image
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title || 'Gallery Image'; // Use title from JSON for alt text
            img.loading = 'lazy'; // Add lazy loading for better performance
            
            // Create item details
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            
            // Create title
            const itemTitle = document.createElement('h3');
            itemTitle.className = 'item-title';
            itemTitle.textContent = item.title || 'Untitled Image'; // Use title from JSON
            
            // Create category
            const itemCategory = document.createElement('p');
            itemCategory.className = 'item-category';
            itemCategory.textContent = capitalizeFirstLetter(item.category || 'Other'); // Use category from JSON
            
            // Append elements
            imageContainer.appendChild(img);
            itemDetails.appendChild(itemTitle);
            itemDetails.appendChild(itemCategory);
            
            galleryItem.appendChild(imageContainer);
            galleryItem.appendChild(itemDetails);
            
            // Add click event listener - use the item's assigned ID
            galleryItem.addEventListener('click', () => {
                openModal(item.id); // Pass the unique ID
            });
            
            photoGallery.appendChild(galleryItem);
            
            // Add animation delay for staggered appearance
            setTimeout(() => {
                galleryItem.classList.add('show');
            }, index * 100); // Use index from the loop
        });
    }
    
    // Open modal with image using its ID
    function openModal(imageId) {
        // Find the index of the image with the matching ID
        const imageIndex = galleryData.findIndex(item => item.id === imageId);
        if (imageIndex === -1) return; // Image not found

        currentImageIndex = imageIndex; // Store the current index
        const image = galleryData[currentImageIndex];
        
        modalImg.src = image.src;
        imageTitle.textContent = image.title || 'Untitled Image';
        // Use a default description if none provided in JSON
        imageDescription.textContent = image.description || `A creative ${image.category || 'other'} image.`; 
        downloadLink.href = image.src;
        // Generate download filename from title or use a default
        const downloadFilename = image.title ? `${image.title.toLowerCase().replace(/\s+/g, '-')}.webp` : `image-${image.id}.webp`;
        downloadLink.download = downloadFilename;
        
        photoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        photoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Navigate to previous image
    function prevImage() {
        if (galleryData.length === 0) return;
        currentImageIndex = (currentImageIndex === 0) ? galleryData.length - 1 : currentImageIndex - 1;
        openModal(galleryData[currentImageIndex].id); // Open using the ID
    }
    
    // Navigate to next image
    function nextImage() {
         if (galleryData.length === 0) return;
        currentImageIndex = (currentImageIndex === galleryData.length - 1) ? 0 : currentImageIndex + 1;
        openModal(galleryData[currentImageIndex].id); // Open using the ID
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string = '') { // Add default value
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Event listeners (only add if elements exist)
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    
    // Close modal when clicking outside content
    if (photoModal) {
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                closeModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (photoModal && photoModal.style.display === 'block') { // Check if modal exists
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
    
    // Initialize gallery by loading data
    if (photoGallery) { // Only load if the gallery element exists on the page
       loadImageData();
    }
});
