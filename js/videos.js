// === Videos JavaScript for Video Gallery Page ===

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const videoGallery = document.getElementById('video-gallery');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const downloadLink = document.getElementById('download-link');
    const closeModal = document.querySelector('.close-modal');

    // Use real videos from the assets/videos folder
    const videoFiles = [
        'assets/videos/corn.mp4',
        'assets/videos/couch.mp4',
        'assets/videos/couch2.mp4',
        'assets/videos/trump.mp4',
        'assets/videos/trump2.mp4',
        'assets/videos/trump3.mp4',
        'assets/videos/trump4.mp4',
        'assets/videos/trump5.mp4'
    ];

    // Use real images for thumbnails
    const thumbnailImages = [
        'assets/images/by_charlie69746042_post_03ec3b28_4350_4e19_acbe_4f495a269128.webp',
        'assets/images/by_lordworldpeace_post_00da90fa_4116_4ac6_bbd5_d18b0b0d1414.webp',
        'assets/images/by_memedeckapp_post_023af0f9_bf65_4e52_8d9e_4eb2c898eef1.webp',
        'assets/images/by_charlie69746042_post_06bcd730_aa10_4ab7_9e3a_77cd5d405512.webp',
        'assets/images/by_lordworldpeace_post_074fdb15_29a5_4260_a3e2_35aaa5683e0e.webp',
        'assets/images/by_memedeckapp_post_084e5fb9_0f76_4c85_a0d3_f9dfc29b5aa6.webp',
        'assets/images/by_charlie69746042_post_0d55ff7d_03ca_4d55_8466_b4977b5ce8c1.webp',
        'assets/images/by_lordworldpeace_post_19be5b12_4648_4f10_b0f8_ea35436a6eb2.webp'
    ];

    // Generate videos array from video files
    const videos = videoFiles.map((videoPath, index) => {
        // Extract filename for title and make it more presentable
        const filename = videoPath.split('/').pop().replace('.mp4', '');
        const formattedTitle = filename.charAt(0).toUpperCase() + filename.slice(1);
        
        // Determine category based on filename
        let category = 'Other';
        if (filename.includes('trump')) {
            category = 'Projects';
        } else if (filename.includes('couch')) {
            category = 'Tutorials';
        } else if (filename.includes('corn')) {
            category = 'Travel';
        }
        
        return {
            id: index + 1,
            src: videoPath,
            title: formattedTitle,
            description: `A creative video in the ${category.toLowerCase()} category.`,
            category: category,
            thumbnail: thumbnailImages[index] // Assign a unique thumbnail to each video
        };
    });

    // Current video being played
    let currentVideoId = null;

    // Display videos in the gallery
    function displayVideos() {
        videoGallery.innerHTML = '';
        
        videos.forEach((video, index) => {
            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item video-item';
            galleryItem.dataset.id = video.id;
            galleryItem.dataset.category = video.category.toLowerCase();
            
            // Create video preview container
            const videoPreview = document.createElement('div');
            videoPreview.className = 'video-preview';
            
            // Create video thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.src = video.thumbnail;
            thumbnail.alt = video.title;
            thumbnail.loading = 'lazy'; // Add lazy loading for better performance
            
            // Create video play button overlay
            const playButton = document.createElement('div');
            playButton.className = 'play-button';
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            
            // Create item details
            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            
            // Create title
            const itemTitle = document.createElement('h3');
            itemTitle.className = 'item-title';
            itemTitle.textContent = video.title;
            
            // Create category
            const itemCategory = document.createElement('p');
            itemCategory.className = 'item-category';
            itemCategory.textContent = video.category;
            
            // Append elements
            videoPreview.appendChild(thumbnail);
            videoPreview.appendChild(playButton);
            itemDetails.appendChild(itemTitle);
            itemDetails.appendChild(itemCategory);
            
            galleryItem.appendChild(videoPreview);
            galleryItem.appendChild(itemDetails);
            
            // Add click event listener
            galleryItem.addEventListener('click', () => {
                openVideoModal(video.id);
            });
            
            videoGallery.appendChild(galleryItem);
            
            // Add animation delay for staggered appearance
            setTimeout(() => {
                galleryItem.classList.add('show');
            }, index * 100);
        });
    }

    // Open video modal with the selected video
    function openVideoModal(videoId) {
        const video = videos.find(v => v.id === videoId);
        if (!video) return;
        
        currentVideoId = videoId;
        
        // Update modal content
        modalVideo.src = video.src;
        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
        
        // Set up download link
        downloadLink.href = video.src;
        downloadLink.download = `${video.title.toLowerCase().replace(/\s+/g, '-')}.mp4`;
        
        // Show modal
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Load and play the video
        modalVideo.load();
        
        // Play the video after a brief delay to allow the modal transition
        setTimeout(() => {
            try {
                modalVideo.play();
            } catch (error) {
                console.error('Error playing video:', error);
            }
        }, 300);
    }

    // Close video modal
    function closeVideoModal() {
        // Pause the video
        modalVideo.pause();
        
        // Hide modal
        videoModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear the source
        modalVideo.src = '';
    }

    // Event listener for close button
    closeModal.addEventListener('click', closeVideoModal);

    // Add keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (videoModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeVideoModal();
            }
        }
    });
    
    // Add category filter buttons
    function addFilterButtons() {
        const categories = ['All', ...new Set(videos.map(video => video.category))];
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = category === 'All' ? 'filter-btn active' : 'filter-btn';
            button.textContent = category;
            button.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter videos
                const galleryItems = document.querySelectorAll('.video-item');
                if (category === 'All') {
                    galleryItems.forEach(item => {
                        item.style.display = 'block';
                    });
                } else {
                    galleryItems.forEach(item => {
                        if (item.dataset.category === category.toLowerCase()) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
            
            filterContainer.appendChild(button);
        });
        
        // Insert filter container before the gallery
        const contentHeader = document.querySelector('.content-header');
        contentHeader.after(filterContainer);
    }
    
    // Initialize the gallery and filters
    displayVideos();
    addFilterButtons();
});
