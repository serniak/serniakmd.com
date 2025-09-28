#!/bin/bash

# Image conversion script for serniakmd.com
# Converts all JPEG images to WebP and AVIF formats

echo "Starting image conversion..."
cd images

# Count total JPEG files
total_files=$(ls *.jpg 2>/dev/null | wc -l)
echo "Found $total_files JPEG files to convert"

converted=0
total_original_size=0
total_webp_size=0
total_avif_size=0

for img in *.jpg; do
  if [[ ! $img =~ \.(webp|avif)$ ]] && [[ ! $img =~ ^empty ]]; then
    base=$(basename "$img" .jpg)
    original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)

    echo "Converting $img (${original_size} bytes)..."

    # WebP conversion (good compression, wide support)
    convert "$img" -quality 80 "${base}.webp"
    webp_size=$(stat -f%z "${base}.webp" 2>/dev/null || stat -c%s "${base}.webp" 2>/dev/null)

    # AVIF conversion (best compression, newer format)
    convert "$img" -quality 80 "${base}.avif"
    avif_size=$(stat -f%z "${base}.avif" 2>/dev/null || stat -c%s "${base}.avif" 2>/dev/null)

    echo "  → WebP: ${webp_size} bytes ($(echo "scale=1; ($original_size - $webp_size) * 100 / $original_size" | bc)% savings)"
    echo "  → AVIF: ${avif_size} bytes ($(echo "scale=1; ($original_size - $avif_size) * 100 / $original_size" | bc)% savings)"

    total_original_size=$((total_original_size + original_size))
    total_webp_size=$((total_webp_size + webp_size))
    total_avif_size=$((total_avif_size + avif_size))
    converted=$((converted + 1))
  fi
done

echo ""
echo "Conversion complete!"
echo "Converted: $converted files"
echo "Original size: $(echo "scale=1; $total_original_size / 1024 / 1024" | bc) MB"
echo "WebP total: $(echo "scale=1; $total_webp_size / 1024 / 1024" | bc) MB ($(echo "scale=1; ($total_original_size - $total_webp_size) * 100 / $total_original_size" | bc)% savings)"
echo "AVIF total: $(echo "scale=1; $total_avif_size / 1024 / 1024" | bc) MB ($(echo "scale=1; ($total_original_size - $total_avif_size) * 100 / $total_original_size" | bc)% savings)"