# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for Dr. Serniak Yuriy Petrovich, a urologist in Kyiv, Ukraine. The website is hosted using GitHub Pages with a custom domain (serniakmd.com).

## Architecture

- **Static HTML Site**: No build process or package manager required
- **Frontend Framework**: Plain HTML/CSS/JavaScript with jQuery
- **Hosting**: GitHub Pages with CNAME configuration
- **Analytics**: Google Tag Manager and Umami analytics integration
- **Structure**:
  - `index.html` - Main landing page (large file with embedded content)
  - `health.html` - Simple health check endpoint
  - `thankyou.html` - Thank you page for form submissions
  - `sitemap.xml` - SEO sitemap
  - `css/` - Minified stylesheets for layout, animations, forms
  - `js/` - JavaScript libraries including jQuery and custom scripts
  - `images/` - Medical professional photos and clinic images
  - `icons/` - Website icons and favicons

## Development

Since this is a static site with no build process:
- Edit HTML/CSS/JS files directly
- Test by opening HTML files in browser or using a local server
- No package.json, build commands, or dependency management

## Key Features

- Responsive medical website design
- Google Tag Manager integration for analytics
- Umami analytics tracking (`script.js`)
- Multi-language support (Ukrainian/Russian)
- Contact forms and appointment booking
- SEO optimization with meta tags and sitemap

## File Naming Convention

Images use a hash-based naming system with descriptive suffixes and size variants (e.g., `resizeb20x`, `resize504x`, `empty` prefixes).

## Domain Configuration

- Primary domain: serniakmd.com (configured via CNAME file)
- Health check endpoint available at `/health.html`