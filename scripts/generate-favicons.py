#!/usr/bin/env python3
"""
Generate favicon variants from pfp.png

This script takes the pfp.png from the public directory and generates
all the favicon sizes needed for modern web applications.

Requires: Pillow (PIL)
Install: pip3 install Pillow

Generates:
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- favicon-192x192.png (Android)
- favicon-512x512.png (high-res Android)
"""

from PIL import Image
from pathlib import Path

# Configuration
PUBLIC_DIR = Path(__file__).parent.parent / "public"
SOURCE_IMAGE = PUBLIC_DIR / "pfp.png"

# Favicon sizes to generate
SIZES = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "apple-touch-icon.png": (180, 180),
    "favicon-192x192.png": (192, 192),
    "favicon-512x512.png": (512, 512),
}

def generate_favicons():
    """Generate all favicon variants from source image"""

    # Check if source exists
    if not SOURCE_IMAGE.exists():
        print(f"❌ Source image not found: {SOURCE_IMAGE}")
        print(f"   Please ensure pfp.png exists in {PUBLIC_DIR}")
        return False

    print(f"📸 Source image: {SOURCE_IMAGE.name}")
    print(f"📁 Output directory: {PUBLIC_DIR}\n")

    # Load source image
    try:
        img = Image.open(SOURCE_IMAGE)
        print(f"✅ Loaded image: {img.size[0]}×{img.size[1]} pixels")
        print(f"   Format: {img.format}")
        print(f"   Mode: {img.mode}\n")
    except Exception as e:
        print(f"❌ Error loading image: {e}")
        return False

    # Convert to RGBA if needed (to preserve transparency)
    if img.mode != 'RGBA':
        print(f"🔄 Converting to RGBA mode...")
        img = img.convert('RGBA')

    # Generate each size
    print("🎨 Generating favicon variants...\n")

    for filename, size in SIZES.items():
        output_path = PUBLIC_DIR / filename

        try:
            # Resize with high-quality resampling
            resized = img.resize(size, Image.Resampling.LANCZOS)

            # Save as PNG
            resized.save(output_path, 'PNG', optimize=True)

            # Get file size
            file_size = output_path.stat().st_size
            file_size_kb = file_size / 1024

            print(f"✅ {filename}")
            print(f"   Size: {size[0]}×{size[1]} pixels")
            print(f"   File: {file_size_kb:.1f} KB\n")

        except Exception as e:
            print(f"❌ Error generating {filename}: {e}\n")
            return False

    print("=" * 50)
    print("✨ All favicons generated successfully!")
    print("=" * 50)
    print(f"\nGenerated {len(SIZES)} favicon variants in {PUBLIC_DIR}")
    print("\nNext steps:")
    print("1. Create og-image.png (1200×630 pixels) for social sharing")
    print("2. Update URLs in index.html if needed (currently set to joshuavaage.com)")

    return True

def main():
    print("🎨 Favicon Generator\n")

    try:
        from PIL import Image
    except ImportError:
        print("❌ Pillow library not found")
        print("\nInstall with:")
        print("  pip3 install Pillow")
        print("\nOr:")
        print("  python3 -m pip install Pillow")
        return

    success = generate_favicons()

    if not success:
        exit(1)

if __name__ == "__main__":
    main()
