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
    
    // Get all available images from our assets (this would normally be from a backend API)
    // Using actual image files from assets/images directory
    const imageFiles = [
        'assets/images/by_charlie69746042_post_03ec3b28_4350_4e19_acbe_4f495a269128.webp',
        'assets/images/by_lordworldpeace_post_00da90fa_4116_4ac6_bbd5_d18b0b0d1414.webp',
        'assets/images/by_memedeckapp_post_023af0f9_bf65_4e52_8d9e_4eb2c898eef1.webp',
        'assets/images/by_charlie69746042_post_06bcd730_aa10_4ab7_9e3a_77cd5d405512.webp',
        'assets/images/by_lordworldpeace_post_074fdb15_29a5_4260_a3e2_35aaa5683e0e.webp',
        'assets/images/by_memedeckapp_post_084e5fb9_0f76_4c85_a0d3_f9dfc29b5aa6.webp',
        'assets/images/by_charlie69746042_post_0d55ff7d_03ca_4d55_8466_b4977b5ce8c1.webp',
        'assets/images/by_lordworldpeace_post_19be5b12_4648_4f10_b0f8_ea35436a6eb2.webp',
        'assets/images/by_memedeckapp_post_091735f2_42b1_4f4f_ad51_950a694d9b4f.webp',
        'assets/images/by_charlie69746042_post_10a80810_55ee_4216_b849_8f7519974540.webp',
        'assets/images/by_lordworldpeace_post_1b5a2529_6691_4147_9c30_65c3ef810bdd.webp',
        'assets/images/by_memedeckapp_post_0a7f8502_6374_42a7_bb12_d7b421cd976d.webp'
    ];
    
    // Generate gallery data from image files
    const galleryData = imageFiles.map((imagePath, index) => {
        // Extract filename as title (without path and extension)
        const filename = imagePath.split('/').pop().replace('.webp', '');
        
        // Determine category based on filename
        let category = 'other';
        if (filename.includes('charlie')) {
            category = 'abstract';
        } else if (filename.includes('lordworldpeace')) {
            category = 'nature';
        } else if (filename.includes('memedeck')) {
            category = 'urban';
        } else if (filename.includes('simmer')) {
            category = 'landscape';
        }
        
        // Create a more readable title from the filename
        const titleParts = filename.split('_');
        let title = titleParts[0].replace('by', 'By');
        
        if (titleParts.length > 2) {
            title += ' - ' + titleParts[2].charAt(0).toUpperCase() + titleParts[2].slice(1);
        }
        
        return {
            id: index + 1,
            title: title,
            description: `A creative ${category} image from our collection.`,
            src: imagePath,
            category: category
        };
    });
    
    let currentImageIndex = 0;
    
    // Create gallery items
    function createGalleryItems() {
        photoGallery.innerHTML = '';
        
        galleryData.forEach((item, index) => {
            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.id = item.id;
            galleryItem.dataset.category = item.category;
            
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'item-image';
            
            // Create image
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title;
            img.loading = 'lazy'; // Add lazy loading for better performance
            
            // Create item details
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            
            // Create title
            const itemTitle = document.createElement('h3');
            itemTitle.className = 'item-title';
            itemTitle.textContent = item.title;
            
            // Create category
            const itemCategory = document.createElement('p');
            itemCategory.className = 'item-category';
            itemCategory.textContent = capitalizeFirstLetter(item.category);
            
            // Append elements
            imageContainer.appendChild(img);
            itemDetails.appendChild(itemTitle);
            itemDetails.appendChild(itemCategory);
            
            galleryItem.appendChild(imageContainer);
            galleryItem.appendChild(itemDetails);
            
            // Add click event listener
            galleryItem.addEventListener('click', () => {
                openModal(index);
            });
            
            photoGallery.appendChild(galleryItem);
            
            // Add animation delay for staggered appearance
            setTimeout(() => {
                galleryItem.classList.add('show');
            }, index * 100);
        });
    }
    
    // Open modal with image
    function openModal(index) {
        currentImageIndex = index;
        const image = galleryData[index];
        
        modalImg.src = image.src;
        imageTitle.textContent = image.title;
        imageDescription.textContent = image.description;
        downloadLink.href = image.src;
        downloadLink.download = `${image.title.toLowerCase().replace(/\s+/g, '-')}.webp`;
        
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
        currentImageIndex = (currentImageIndex === 0) ? galleryData.length - 1 : currentImageIndex - 1;
        openModal(currentImageIndex);
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex === galleryData.length - 1) ? 0 : currentImageIndex + 1;
        openModal(currentImageIndex);
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Close modal when clicking outside content
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (photoModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
    
    // Initialize gallery
    createGalleryItems();
});
