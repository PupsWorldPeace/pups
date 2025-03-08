// === Gallery JavaScript for Photo Gallery Page ===

// DOM Elements
const photoGallery = document.getElementById('photo-gallery');
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeLightbox = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.lightbox-controls .prev-btn');
const nextBtn = document.querySelector('.lightbox-controls .next-btn');
const downloadBtn = document.querySelector('.lightbox-controls .download-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Use real images from the assets/images folder
const imageFiles = [
    'assets/images/by_charlie69746042_post_03ec3b28_4350_4e19_acbe_4f495a269128.webp',
    'assets/images/by_charlie69746042_post_06bcd730_aa10_4ab7_9e3a_77cd5d405512.webp',
    'assets/images/by_charlie69746042_post_0d55ff7d_03ca_4d55_8466_b4977b5ce8c1.webp',
    'assets/images/by_charlie69746042_post_10a80810_55ee_4216_b849_8f7519974540.webp',
    'assets/images/by_charlie69746042_post_16727ba6_c770_4008_9725_5add4209c102.webp',
    'assets/images/by_charlie69746042_post_171387b6_3ca0_416d_9f9e_81c137fae53e.webp',
    'assets/images/by_charlie69746042_post_23f3887b_08ba_486d_a838_99586e632e55.webp',
    'assets/images/by_charlie69746042_post_276427ed_48cc_46a4_bde6_3d1132250228.webp',
    'assets/images/by_charlie69746042_post_297f60dc_2129_4046_8ba2_82cb6ce4574e.webp',
    'assets/images/by_charlie69746042_post_2fec18ef_f196_49d6_9f09_02e0344f90fb.webp',
    'assets/images/by_lordworldpeace_post_00da90fa_4116_4ac6_bbd5_d18b0b0d1414.webp',
    'assets/images/by_lordworldpeace_post_074fdb15_29a5_4260_a3e2_35aaa5683e0e.webp',
    'assets/images/by_lordworldpeace_post_19be5b12_4648_4f10_b0f8_ea35436a6eb2.webp',
    'assets/images/by_lordworldpeace_post_1b5a2529_6691_4147_9c30_65c3ef810bdd.webp',
    'assets/images/by_memedeckapp_post_023af0f9_bf65_4e52_8d9e_4eb2c898eef1.webp',
    'assets/images/by_memedeckapp_post_040cc60c_d1bd_4726_94e0_fd930e7bbd60.webp',
    'assets/images/by_memedeckapp_post_05302916_68b3_4333_ad85_25e73e44eb5a.webp',
    'assets/images/by_memedeckapp_post_084e5fb9_0f76_4c85_a0d3_f9dfc29b5aa6.webp',
    'assets/images/by_simmer__92_post_059e672b_ce28_4b19_8669_5c7866702e52.webp',
    'assets/images/by_simmer__92_post_169a241f_0776_4b83_a753_8babcd6c77a5.webp',
    'assets/images/by_simmer__92_post_82d708a4_38e4_4377_b116_036d322f81ab.webp',
    'assets/images/by_simmer__92_post_d2725d62_a27b_4e2f_a7d6_65a61f6b25d3.webp'
];

// Generate photo array from image files
const photos = imageFiles.map((imagePath, index) => {
    // Extract filename for title and category
    const filename = imagePath.split('/').pop();
    
    // Determine category based on filename
    let category = 'all';
    if (filename.includes('charlie')) {
        category = 'nature';
    } else if (filename.includes('lordworldpeace')) {
        category = 'portrait';
    } else if (filename.includes('memedeckapp') || filename.includes('simmer')) {
        category = 'architecture';
    }
    
    return {
        id: index + 1,
        src: imagePath,
        thumbnail: imagePath,
        title: filename,
        description: '',
        category: category,
        date: ''
    };
});

// Current photo index for lightbox navigation
let currentPhotoIndex = 0;
let filteredPhotos = [...photos];

// Display photos in the gallery
function displayPhotos(photoArray) {
    photoGallery.innerHTML = '';
    
    photoArray.forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${photo.category}`;
        galleryItem.setAttribute('data-id', photo.id);
        
        const template = `
            <div class="gallery-img-container">
                <img src="${photo.thumbnail}" alt="${photo.title}">
            </div>
            <div class="gallery-item-caption">
                <h3>${photo.title}</h3>
            </div>
        `;
        
        galleryItem.innerHTML = template;
        photoGallery.appendChild(galleryItem);
        
        // Add click event to open lightbox
        galleryItem.addEventListener('click', () => {
            openLightbox(photo.id);
        });
    });
}

// Filter photos by category
function filterPhotos(category) {
    if (category === 'all') {
        filteredPhotos = [...photos];
    } else {
        filteredPhotos = photos.filter(photo => photo.category === category);
    }
    
    displayPhotos(filteredPhotos);
}

// Initialize the gallery with all photos
displayPhotos(filteredPhotos);

// Filter button event listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Filter photos by the selected category
        const category = btn.getAttribute('data-filter');
        filterPhotos(category);
    });
});

// Open lightbox with the selected photo
function openLightbox(photoId) {
    const photoIndex = filteredPhotos.findIndex(photo => photo.id === photoId);
    if (photoIndex === -1) return;
    
    currentPhotoIndex = photoIndex;
    updateLightboxContent();
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

// Update lightbox content based on current photo index
function updateLightboxContent() {
    const photo = filteredPhotos[currentPhotoIndex];
    lightboxImg.src = photo.src;
    lightboxCaption.innerHTML = `
        <h3>${photo.title}</h3>
    `;
    
    // Update download button href
    downloadBtn.onclick = () => {
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = photo.src;
        link.download = photo.title;
        link.click();
    };
}

// Navigate to previous photo
function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxContent();
}

// Navigate to next photo
function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
    updateLightboxContent();
}

// Close lightbox
function closeLightboxFn() {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Event listeners for lightbox navigation
prevBtn.addEventListener('click', prevPhoto);
nextBtn.addEventListener('click', nextPhoto);
closeLightbox.addEventListener('click', closeLightboxFn);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            prevPhoto();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === 'Escape') {
            closeLightboxFn();
        }
    }
});
