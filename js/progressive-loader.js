/**
 * Progressive Image Loader
 * Optimizes image loading with blur-up technique and modern format support
 */
(function() {
    'use strict';
    
    class ProgressiveImageLoader {
        constructor(options = {}) {
            this.options = {
                blurAmount: '5px',
                transitionDuration: '300ms',
                rootMargin: '50px',
                threshold: 0.1,
                ...options
            };
            
            this.observer = null;
            this.init();
        }
        
        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver(
                    this.handleIntersection.bind(this),
                    {
                        rootMargin: this.options.rootMargin,
                        threshold: this.options.threshold
                    }
                );
                
                this.findImages();
            } else {
                // Fallback for older browsers
                this.loadAllImages();
            }
        }
        
        findImages() {
            // Find all elements with progressive loading attributes
            const elements = document.querySelectorAll('[data-progressive]');
            elements.forEach(element => {
                this.setupElement(element);
                this.observer.observe(element);
            });
        }
        
        setupElement(element) {
            const lowSrc = element.dataset.progressiveLow;
            if (lowSrc) {
                // Apply blur to low quality image
                if (element.tagName === 'IMG') {
                    element.src = lowSrc;
                } else {
                    element.style.backgroundImage = `url(${lowSrc})`;
                }
                element.style.filter = `blur(${this.options.blurAmount})`;
                element.style.transition = `filter ${this.options.transitionDuration}`;
            }
        }
        
        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadHighQualityImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }
        
        loadHighQualityImage(element) {
            const highSrc = element.dataset.progressiveHigh;
            const webpSrc = element.dataset.progressiveWebp;
            const avifSrc = element.dataset.progressiveAvif;
            
            if (!highSrc) return;
            
            // Create image element to preload
            const img = new Image();
            
            img.onload = () => {
                this.replaceImage(element, img.src);
            };
            
            img.onerror = () => {
                // Fallback to JPEG if other formats fail
                if (img.src !== highSrc) {
                    img.src = highSrc;
                } else {
                    console.warn('Failed to load image:', highSrc);
                }
            };
            
            // Try modern formats first
            if (this.supportsAvif() && avifSrc) {
                img.src = avifSrc;
            } else if (this.supportsWebp() && webpSrc) {
                img.src = webpSrc;
            } else {
                img.src = highSrc;
            }
        }
        
        replaceImage(element, newSrc) {
            if (element.tagName === 'IMG') {
                element.src = newSrc;
            } else {
                element.style.backgroundImage = `url(${newSrc})`;
            }

            // Remove blur and add loaded class
            element.style.filter = 'none';
            element.classList.add('progressive-loaded');

            // Dispatch custom event
            element.dispatchEvent(new CustomEvent('progressiveLoaded', {
                detail: { src: newSrc }
            }));
        }
        
        supportsWebp() {
            if (this._webpSupported !== undefined) return this._webpSupported;
            
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            this._webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            return this._webpSupported;
        }
        
        supportsAvif() {
            if (this._avifSupported !== undefined) return this._avifSupported;
            
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            try {
                this._avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
            } catch (e) {
                this._avifSupported = false;
            }
            return this._avifSupported;
        }
        
        loadAllImages() {
            // Fallback for browsers without IntersectionObserver
            const elements = document.querySelectorAll('[data-progressive]');
            elements.forEach(element => {
                this.loadHighQualityImage(element);
            });
        }
        
        // Public method to manually load an image
        loadImage(element) {
            if (element.dataset.progressive) {
                this.loadHighQualityImage(element);
            }
        }
        
        // Public method to add new images after page load
        observeNewImages(selector = '[data-progressive]') {
            if (!this.observer) return;
            
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.classList.contains('progressive-loaded') && 
                    !element.dataset.progressiveObserved) {
                    this.setupElement(element);
                    this.observer.observe(element);
                    element.dataset.progressiveObserved = 'true';
                }
            });
        }
    }
    
    // Auto-initialize on DOM ready
    function initProgressiveLoader() {
        window.progressiveLoader = new ProgressiveImageLoader({
            blurAmount: '3px',
            transitionDuration: '400ms',
            rootMargin: '100px'
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProgressiveLoader);
    } else {
        initProgressiveLoader();
    }
    
    // Add CSS for progressive loading
    const style = document.createElement('style');
    style.textContent = `
        [data-progressive] {
            background-color: #f0f0f0;
            transition: filter 400ms ease;
        }
        
        [data-progressive].progressive-loaded {
            filter: none !important;
        }
        
        .progressive-placeholder {
            background-color: #e1e1e1;
            background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
    `;
    document.head.appendChild(style);
    
})();