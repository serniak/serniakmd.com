#!/bin/bash

# Enhanced Image optimization script for serniakmd.com
# Generates better progressive loading placeholders and optimizes images

echo "Starting enhanced image optimization..."
cd images

# Count total image files
total_files=$(ls *.jpg 2>/dev/null | wc -l)
echo "Found $total_files image files to optimize"

converted=0
total_savings=0

# Generate better quality low-res placeholders (50px width instead of 20px)
generate_placeholder() {
    local input="$1"
    local base="$2"
    local size="50"
    
    # Generate 50px wide placeholder with blur
    if command -v magick >/dev/null 2>&1; then
        # ImageMagick 7
        magick "$input" -resize "${size}x" -blur 0x1 -quality 60 "${base}placeholder.jpg"
        magick "$input" -resize "${size}x" -blur 0x1 -quality 60 "${base}placeholder.webp"
    elif command -v convert >/dev/null 2>&1; then
        # ImageMagick 6
        convert "$input" -resize "${size}x" -blur 0x1 -quality 60 "${base}placeholder.jpg"
        convert "$input" -resize "${size}x" -blur 0x1 -quality 60 "${base}placeholder.webp"
    else
        echo "Warning: ImageMagick not found. Skipping placeholder generation."
        return 1
    fi
}

# Optimize and create placeholders
for img in *.jpg; do
    if [[ ! $img =~ ^(placeholder|resize|empty) ]] && [[ -f "$img" ]]; then
        base=$(echo "$img" | sed 's/\.jpg$//')
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        
        echo "Processing $img ($(echo "scale=1; $original_size / 1024" | bc -l) KB)..."
        
        # Generate better quality placeholder
        generate_placeholder "$img" "${base}-"
        
        # Optimize original if not already done
        if [[ ! -f "${base}.webp" ]] || [[ "$img" -nt "${base}.webp" ]]; then
            if command -v magick >/dev/null 2>&1; then
                # ImageMagick 7 - better optimization
                magick "$img" -strip -interlace Plane -quality 85 "${base}.webp"
                magick "$img" -strip -interlace Plane -quality 85 "${base}.avif" 2>/dev/null || true
            elif command -v convert >/dev/null 2>&1; then
                # ImageMagick 6
                convert "$img" -strip -interlace Plane -quality 85 "${base}.webp"
                convert "$img" -strip -interlace Plane -quality 85 "${base}.avif" 2>/dev/null || true
            fi
            
            # Calculate savings
            if [[ -f "${base}.webp" ]]; then
                webp_size=$(stat -f%z "${base}.webp" 2>/dev/null || stat -c%s "${base}.webp" 2>/dev/null)
                savings=$((original_size - webp_size))
                total_savings=$((total_savings + savings))
                echo "  → WebP: $(echo "scale=1; $webp_size / 1024" | bc -l) KB ($(echo "scale=1; $savings * 100 / $original_size" | bc -l)% savings)"
            fi
        fi
        
        converted=$((converted + 1))
    fi
done

echo ""
echo "Optimization complete!"
echo "Processed: $converted images"
echo "Total space saved: $(echo "scale=1; $total_savings / 1024 / 1024" | bc -l) MB"
echo ""
echo "Generated placeholders with better quality (50px width with slight blur)"
echo "Use the new progressive-loader.js script for optimal loading experience."