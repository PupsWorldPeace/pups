# Creative Portfolio Website

A beautiful and interactive multimedia showcase website for displaying photos, videos, and app demos with downloadable content.

## Features

- **Beautiful Homepage**: Dynamic image grid with randomly cycling images
- **Photo Gallery**: Filter photos by category, lightbox previews, and download functionality
- **Video Gallery**: Organized video collection with playback and download options
- **App Showcase**: Feature your app demos with technology details and video explanations
- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Modern UI**: Clean, animated interface with smooth transitions

## How to Use

### Adding Your Content

1. **Photos**: Place your images in the `assets/images` folder and update the `photos` array in `js/gallery.js`
2. **Videos**: Add your videos to `assets/videos` and update the `videos` array in `js/videos.js`
3. **App Demos**: Place app demo videos in `assets/apps` and update the `apps` array in `js/apps.js`

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
│   ├── videos/   # For your video content
│   └── apps/     # For app demo videos
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── gallery.js
│   ├── videos.js
│   └── apps.js
├── index.html    # Homepage
├── images.html   # Photo gallery page
├── videos.html   # Video collection page
└── apps.html     # App showcase page
```

Enjoy your new portfolio site!
