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

Content for the galleries (images and videos) is managed through the `media-manifest.json` file located in the root directory.

1.  **Place Files**: Add your image files (e.g., `.webp`, `.jpg`, `.png`) to the `assets/images/` folder and video files (e.g., `.mp4`) to the `assets/videos/` folder.
2.  **Update Manifest**: Edit `media-manifest.json` to include entries for your new files. Each entry should be an object with the following properties:
    *   `type`: `"image"` or `"video"`
    *   `src`: The full path to the file (e.g., `"assets/images/your-image.webp"`).
    *   `title`: A display title for the item (e.g., `"My Awesome Photo"`).
    *   `category`: A category name (e.g., `"nature"`, `"abstract"`, `"projects"`). This is used for filtering on the video page.
    *   `thumbnail` (for videos only): The path to an image file to use as the video's thumbnail (e.g., `"assets/images/video-thumb.webp"`). If omitted, a default placeholder might be used.
    *   `description` (optional): A short description for the item, displayed in the modal view.

Example entry in `media-manifest.json`:
```json
{
  "type": "image",
  "src": "assets/images/by_charlie69746042_post_0d55ff7d_03ca_4d55_8466_b4977b5ce8c1.webp",
  "title": "By Charlie - Post 0d55ff7d",
  "category": "abstract",
  "description": "An abstract piece by Charlie."
}
```

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
│   ├── main.js              # Core site functionality & homepage grid
│   ├── images.js            # Image gallery page logic
│   ├── videos.js            # Video gallery page logic
│   ├── mobile-menu.js       # Mobile navigation handling
│   ├── performance-boost.js # Performance optimizations
│   └── stickers-rain.js     # Interactive stickers animation
├── stickers/                # Sticker images for animation
├── index.html               # Homepage
├── images.html              # Image gallery
├── videos.html              # Video gallery
└── media-manifest.json      # ** Defines all gallery content **
```

## Credits

A project by PUPSWorldPeace.
