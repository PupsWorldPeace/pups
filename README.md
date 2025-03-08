# PUPSfolio - Creative Portfolio Website

A beautiful and performance-optimized multimedia showcase website for displaying photos and videos with a smooth, responsive design.

## Features

- **Beautiful Homepage**: Dynamic image grid with randomly cycling images
- **Photo Gallery**: Smooth image browsing with lightbox previews and download functionality
- **Video Gallery**: Organized video collection with playback and download options
- **Performance Optimized**: Lazy loading, hardware acceleration, and resource hints for faster loading
- **Mobile First Design**: Looks great on all devices with special optimizations for mobile
- **Modern UI**: Clean, animated interface with smooth transitions and stickers rain effect

## Performance Optimizations

- **Lazy Loading**: Images and videos load only when they enter the viewport
- **Hardware Acceleration**: Smooth animations and scrolling using CSS will-change and transform properties
- **Device Detection**: Adaptive experiences based on device capabilities
- **Image Preloading**: Strategic preloading of critical images for a smoother experience
- **Resource Hints**: Faster loading of external resources like fonts
- **Frame Rate Throttling**: Better performance on low-power devices

## How to Use

### Adding Your Content

1. **Photos**: Place your images in the `assets/images` folder
2. **Videos**: Add your videos to `assets/videos` folder

### Running the Site

You can run this site locally using any simple web server. Here's how to start one with Python:

```
# If you have Python 3 installed:
python -m http.server

# Or with Python 2:
python -m SimpleHTTPServer
```

Or simply open the index.html file in your browser.

## Customization

- Edit `css/styles.css` to change colors, fonts, and styles
- Modify the HTML files to adjust layout and content structure
- Update JavaScript files to change behavior and animations

## Structure

```
site/
├── assets/
│   ├── images/   # For all your photos
│   └── videos/   # For your video content
├── css/
│   └── styles.css
├── js/
│   ├── image-preloader.js   # Image preloading system
│   ├── main.js              # Core site functionality
│   ├── mobile-menu.js       # Mobile navigation handling
│   ├── performance-boost.js # Performance optimizations
│   └── stickers-rain.js     # Interactive stickers animation
├── stickers/                # Sticker images for animation
├── index.html               # Homepage
├── images.html              # Image gallery
└── videos.html              # Video gallery
```

## Credits

A project by PUPSWorldPeace.
