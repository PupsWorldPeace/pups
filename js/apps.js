// === Apps JavaScript for App Showcase Page ===

// DOM Elements
const appGallery = document.getElementById('app-gallery');
const appModal = document.getElementById('app-modal');
const modalAppVideo = document.getElementById('modal-app-video');
const appModalTitle = document.querySelector('.app-modal-title');
const appModalDesc = document.querySelector('.app-modal-description');
const appModalTech = document.querySelector('.app-modal-tech');
const closeAppModal = document.querySelector('.close-app-modal');
const downloadAppVideoBtn = document.querySelector('.app-modal-controls .download-btn');
const techFilterBtns = document.querySelectorAll('.tech-filter-btn');

// Check for videos in the assets/apps folder
// Currently, the apps folder is empty, so we'll provide a message
// This structure will still work when apps are added
const appVideoFiles = [];

// Generate apps array from app video files
const apps = appVideoFiles.map((videoPath, index) => {
    // Extract filename for title
    const filename = videoPath.split('/').pop();
    
    // For future implementation: determine technologies based on filename or folder structure
    const technologies = ['javascript', 'css'];
    
    return {
        id: index + 1,
        videoSrc: videoPath,
        thumbnail: videoPath, // Use first frame as thumbnail
        title: filename,
        description: 'App demonstration',
        technologies: technologies
    };
});

// Empty state message for when there are no apps yet
function showEmptyState() {
    if (appGallery) {
        appGallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-message">
                    <h2>App demos coming soon!</h2>
                    <p>Check back later for demonstrations of various applications and projects.</p>
                </div>
            </div>
        `;
    }
}

// If no apps are available, show empty state
if (apps.length === 0) {
    showEmptyState();
} else {
    // Display app items
    displayApps(apps);
}

// Function to display app items when they become available
function displayApps(appArray) {
    if (!appGallery) return;
    
    appGallery.innerHTML = '';
    
    appArray.forEach(app => {
        const appItem = document.createElement('div');
        appItem.className = `app-item ${app.technologies.join(' ')}`;
        appItem.setAttribute('data-id', app.id);
        
        const techTags = app.technologies.map(tech => `
            <span class="tech-tag">${tech}</span>
        `).join('');
        
        const template = `
            <div class="app-thumbnail">
                <img src="${app.thumbnail}" alt="${app.title}">
                <div class="play-icon">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="app-caption">
                <h3>${app.title}</h3>
                <div class="tech-tags">
                    ${techTags}
                </div>
            </div>
        `;
        
        appItem.innerHTML = template;
        appGallery.appendChild(appItem);
        
        // Add click event to open app modal
        appItem.addEventListener('click', () => {
            openAppModal(app.id);
        });
    });
}

// Filter apps by technology
function filterAppsByTech(tech) {
    if (apps.length === 0) return;
    
    if (tech === 'all') {
        displayApps(apps);
    } else {
        const filteredApps = apps.filter(app => app.technologies.includes(tech));
        displayApps(filteredApps);
    }
}

// Filter button event listeners
techFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // If no apps are available, don't filter
        if (apps.length === 0) return;
        
        // Remove active class from all buttons
        techFilterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Filter apps by the selected technology
        const tech = btn.getAttribute('data-filter');
        filterAppsByTech(tech);
    });
});

// Open app modal with the selected app
function openAppModal(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    
    // Update modal content
    modalAppVideo.src = app.videoSrc;
    appModalTitle.textContent = app.title;
    appModalDesc.textContent = app.description;
    
    // Create tech tags
    appModalTech.innerHTML = '';
    app.technologies.forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag';
        techTag.textContent = tech;
        appModalTech.appendChild(techTag);
    });
    
    // Set up download button
    downloadAppVideoBtn.onclick = () => {
        // Create a temporary link to download the video
        const link = document.createElement('a');
        link.href = app.videoSrc;
        link.download = app.title;
        link.click();
    };
    
    // Show modal
    appModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Load and play the video
    modalAppVideo.load();
    modalAppVideo.play();
}

// Close app modal
function closeAppModal() {
    // Pause the video
    modalAppVideo.pause();
    
    // Hide modal
    appModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clear the source
    modalAppVideo.src = '';
}

// Event listener for close button
closeAppModal.addEventListener('click', closeAppModal);

// Add keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (appModal.style.display === 'block' && e.key === 'Escape') {
        closeAppModal();
    }
});
