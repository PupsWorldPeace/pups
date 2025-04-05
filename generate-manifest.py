import os
import json
import random

IMAGE_DIR = 'assets/images'
VIDEO_DIR = 'assets/videos'
MEME_DIR = 'assets/memes' # Added memes directory
MANIFEST_FILE = 'media-manifest.json'
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg'] # Add more if needed
# Memes are likely images, use the same extensions
MEME_EXTENSIONS = IMAGE_EXTENSIONS 

def format_title(filename):
    """Creates a more readable title from a filename."""
    name_part = os.path.splitext(filename)[0]
    # Replace underscores/hyphens with spaces, capitalize words
    title = name_part.replace('_', ' ').replace('-', ' ')
    # Basic capitalization (can be improved)
    title = ' '.join(word.capitalize() for word in title.split())
    # Remove common prefixes if desired (optional)
    if title.startswith("By "): 
        title = title[3:]
    if title.startswith("Post "):
        title = title[5:]
    # Remove potential UUIDs or long hashes (optional heuristic)
    parts = title.split()
    if len(parts) > 1 and len(parts[-1]) > 10 and parts[-1].isalnum():
         title = ' '.join(parts[:-1])

    # Handle simple cases like 'couch2' -> 'Couch 2'
    if title[-1].isdigit() and not title[-2].isdigit() and not title[-2].isspace():
         title = title[:-1] + ' ' + title[-1]
         
    return title.strip()

def get_category(filename):
    """Infers a category based on filename keywords."""
    filename_lower = filename.lower()
    if 'charlie' in filename_lower:
        return 'abstract'
    if 'lordworldpeace' in filename_lower:
        return 'nature'
    if 'memedeck' in filename_lower:
        return 'urban'
    if 'simmer' in filename_lower:
        return 'landscape'
    if 'trump' in filename_lower:
        return 'projects' # Example category
    if 'couch' in filename_lower:
        return 'tutorials' # Example category
    if 'corn' in filename_lower:
        return 'travel' # Example category
    # Add meme category check if needed, otherwise handled below
    return 'other' # Default category

def main():
    media_list = []
    image_files = [] # Keep track of images for potential video thumbnails

    print(f"Scanning '{IMAGE_DIR}' for images...")
    if os.path.isdir(IMAGE_DIR):
        for filename in sorted(os.listdir(IMAGE_DIR)):
            if any(filename.lower().endswith(ext) for ext in IMAGE_EXTENSIONS):
                 # Ignore files ending with ' - Copy'
                 if ' - copy' in filename.lower():
                     print(f"  Skipping copy file: {filename}")
                     continue
                 # Ignore placeholder
                 if filename.lower() == 'video-placeholder.jpg':
                     print(f"  Skipping placeholder: {filename}")
                     continue
                     
                 filepath = os.path.join(IMAGE_DIR, filename).replace("\\", "/") # Ensure forward slashes
                 image_files.append(filepath) # Store for potential video thumbnails
                 media_list.append({
                     "type": "image",
                     "src": filepath, # Add src back
                     "title": format_title(filename), # Add title back
                     "category": get_category(filename)
                 })
        print(f"  Found {len(image_files)} valid images.")
    else:
        print(f"Warning: Image directory '{IMAGE_DIR}' not found.")

    print(f"Scanning '{MEME_DIR}' for memes...")
    meme_count = 0
    if os.path.isdir(MEME_DIR):
        for filename in sorted(os.listdir(MEME_DIR)):
            if any(filename.lower().endswith(ext) for ext in MEME_EXTENSIONS):
                 filepath = os.path.join(MEME_DIR, filename).replace("\\", "/") 
                 # Treat memes as images for gallery purposes, assign specific category
                 media_list.append({
                     "type": "image", # Treat as image type for display
                     "src": filepath,
                     "title": format_title(filename),
                     "category": "meme" # Assign specific category
                 })
                 meme_count += 1
        print(f"  Found {meme_count} valid memes.")
    else:
        print(f"Warning: Meme directory '{MEME_DIR}' not found.")


    print(f"Scanning '{VIDEO_DIR}' for videos...")
    video_count = 0
    if os.path.isdir(VIDEO_DIR):
        for filename in sorted(os.listdir(VIDEO_DIR)):
            if any(filename.lower().endswith(ext) for ext in VIDEO_EXTENSIONS):
                filepath = os.path.join(VIDEO_DIR, filename).replace("\\", "/") # Ensure forward slashes
                
                # Assign a thumbnail - use a random image or a placeholder
                thumbnail_path = "assets/images/video-placeholder.jpg" # Default placeholder
                if image_files:
                    # Try to find a related image or just pick one semi-randomly based on index
                    # This is a basic heuristic, could be improved
                    related_index = video_count % len(image_files)
                    thumbnail_path = image_files[related_index]
                    
                media_list.append({
                    "type": "video",
                    "src": filepath,
                    "title": format_title(filename),
                    "category": get_category(filename),
                    "thumbnail": thumbnail_path 
                })
                video_count += 1
        print(f"  Found {video_count} valid videos.")
    else:
         print(f"Warning: Video directory '{VIDEO_DIR}' not found.")

    # Shuffle the list for randomness in the homepage grid
    random.shuffle(media_list)

    print(f"Writing {len(media_list)} items to '{MANIFEST_FILE}'...")
    try:
        with open(MANIFEST_FILE, 'w') as f:
            json.dump(media_list, f, indent=2)
        print("Manifest file generated successfully.")
    except IOError as e:
        print(f"Error writing manifest file: {e}")

if __name__ == "__main__":
    main()
