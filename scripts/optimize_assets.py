#!/usr/bin/env python3
"""
Production Asset Optimizer for BRNDNUR Advisory LLP.
Executes safe, format-aware conversions and optimizations:
- Converts large opaque photographic PNGs to high-fidelity WebP (quality 86) + optimized PNG fallback.
- Preserves full RGBA alpha transparency for brand logos.
- Generates responsive mobile/tablet variants for hero images.
- Optimizes heavy photographic JPEGs to modern WebP derivatives.
- Records exact before/after bytes for CSV/reporting.
"""

import os
import json
import csv
from PIL import Image

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(WORKSPACE_ROOT, "public")
PLANNING_DIR = os.path.join(WORKSPACE_ROOT, ".planning")

results = []

def optimize_image(rel_path, target_formats=None, generate_mobile=False, mobile_width=768, quality=86):
    src_path = os.path.join(PUBLIC_DIR, rel_path.lstrip("/")).replace("\\", "/")
    if not os.path.exists(src_path):
        print(f"Skipping non-existent: {src_path}")
        return None
        
    orig_size = os.path.getsize(src_path)
    base_name, ext = os.path.splitext(src_path)
    ext_lower = ext.lower()
    
    with Image.open(src_path) as img:
        orig_width, orig_height = img.size
        orig_mode = img.mode
        has_alpha = orig_mode in ("RGBA", "LA") or (orig_mode == "P" and "transparency" in img.info)
        
        # 1. If PNG without alpha (photographic image), convert to WebP
        if ext_lower == ".png" and not has_alpha:
            webp_path = f"{base_name}.webp"
            img_rgb = img.convert("RGB") if orig_mode != "RGB" else img
            img_rgb.save(webp_path, format="WEBP", quality=quality, method=6)
            webp_size = os.path.getsize(webp_path)
            
            # Also optimize the PNG fallback
            opt_png_path = f"{base_name}.png"
            img.save(opt_png_path, format="PNG", optimize=True)
            new_png_size = os.path.getsize(opt_png_path)
            
            # Responsive mobile variant if requested
            if generate_mobile and orig_width > mobile_width:
                mobile_height = int(orig_height * (mobile_width / orig_width))
                img_mobile = img_rgb.resize((mobile_width, mobile_height), Image.Resampling.LANCZOS)
                mobile_webp_path = f"{base_name}-mobile.webp"
                img_mobile.save(mobile_webp_path, format="WEBP", quality=quality, method=6)
                mobile_size = os.path.getsize(mobile_webp_path)
            else:
                mobile_size = None
                
            savings = orig_size - webp_size
            pct = round((savings / orig_size) * 100, 1)
            
            res = {
                "asset": rel_path,
                "original_format": "PNG",
                "original_size_kb": round(orig_size / 1024, 2),
                "optimized_format": "WEBP",
                "optimized_size_kb": round(webp_size / 1024, 2),
                "png_fallback_kb": round(new_png_size / 1024, 2),
                "mobile_variant_kb": round(mobile_size / 1024, 2) if mobile_size else "N/A",
                "savings_kb": round(savings / 1024, 2),
                "savings_pct": pct,
                "dimensions": f"{orig_width}x{orig_height}",
                "alpha_preserved": "N/A (Opaque)",
                "status": "CONVERTED_WEBP"
            }
            results.append(res)
            print(f"[PNG->WEBP] {rel_path}: {res['original_size_kb']} KB -> {res['optimized_size_kb']} KB ({pct}% saved)")
            return res
            
        # 2. Transparent Logo PNG (preserve alpha)
        elif ext_lower == ".png" and has_alpha:
            # Recompress PNG losslessly
            img.save(src_path, format="PNG", optimize=True)
            new_png_size = os.path.getsize(src_path)
            
            # High-fidelity alpha WebP derivative
            webp_path = f"{base_name}.webp"
            img.save(webp_path, format="WEBP", quality=90, method=6)
            webp_size = os.path.getsize(webp_path)
            
            savings = orig_size - webp_size
            pct = round((savings / orig_size) * 100, 1)
            
            res = {
                "asset": rel_path,
                "original_format": "PNG (RGBA)",
                "original_size_kb": round(orig_size / 1024, 2),
                "optimized_format": "WEBP (Alpha) / PNG",
                "optimized_size_kb": round(webp_size / 1024, 2),
                "png_fallback_kb": round(new_png_size / 1024, 2),
                "mobile_variant_kb": "N/A",
                "savings_kb": round(savings / 1024, 2),
                "savings_pct": pct,
                "dimensions": f"{orig_width}x{orig_height}",
                "alpha_preserved": "YES (100% Alpha Intact)",
                "status": "OPTIMIZED_RGBA"
            }
            results.append(res)
            print(f"[LOGO RGBA] {rel_path}: {res['original_size_kb']} KB -> {res['optimized_size_kb']} KB WebP / {res['png_fallback_kb']} KB PNG")
            return res

        # 3. Photographic JPEG -> Create WebP & optimize JPEG
        elif ext_lower in (".jpg", ".jpeg"):
            webp_path = f"{base_name}.webp"
            img_rgb = img.convert("RGB") if orig_mode != "RGB" else img
            img_rgb.save(webp_path, format="WEBP", quality=quality, method=6)
            webp_size = os.path.getsize(webp_path)
            
            # Recompress JPEG progressively
            img_rgb.save(src_path, format="JPEG", quality=85, progressive=True, optimize=True)
            new_jpg_size = os.path.getsize(src_path)
            
            savings = orig_size - webp_size
            pct = round((savings / orig_size) * 100, 1)
            
            res = {
                "asset": rel_path,
                "original_format": "JPEG",
                "original_size_kb": round(orig_size / 1024, 2),
                "optimized_format": "WEBP",
                "optimized_size_kb": round(webp_size / 1024, 2),
                "png_fallback_kb": round(new_jpg_size / 1024, 2),
                "mobile_variant_kb": "N/A",
                "savings_kb": round(savings / 1024, 2),
                "savings_pct": pct,
                "dimensions": f"{orig_width}x{orig_height}",
                "alpha_preserved": "N/A (Opaque)",
                "status": "CONVERTED_WEBP"
            }
            results.append(res)
            print(f"[JPG->WEBP] {rel_path}: {res['original_size_kb']} KB -> {res['optimized_size_kb']} KB ({pct}% saved)")
            return res

def run_all_optimizations():
    print("--- Starting Targeted High-Impact Image Optimizations ---")
    
    # 1. Homepage Hero LCP (The largest file on the site)
    optimize_image("assets/hero-brand-desk.png", generate_mobile=True, mobile_width=768)
    
    # 2. Key Service & Value PNGs
    optimize_image("services/assets/services-why-brndnur.png")
    optimize_image("assets/about-values-integrity.png")
    optimize_image("assets/classes-avoid-overfiling.png")
    
    # 3. Transparent Logos (Rule: NEVER convert transparent logo to JPEG)
    optimize_image("assets/brndnur-logo-transparent.png")
    optimize_image("assets/brndnur-logo-background.png")
    
    # 4. Heavy JPEGs (>130KB)
    heavy_jpegs = [
        "trademark-registration/assets/tm-process-path.jpg",
        "assets/guide-class-hero.jpg",
        "assets/fssai-hero-food-safety.jpg",
        "assets/wordmark-hero-typography.jpg",
        "trademark-registration/assets/tm-benefits-foundation.jpg",
        "packages/assets/pkg-gulf-commercial.jpg",
        "assets/resources-card-classes.jpg",
        "assets/guide-tm-reg-hero.jpg",
        "assets/resources-support-clarity.jpg",
        "packages/assets/pkg-food-compliance.jpg",
        "trademark-registration/assets/tm-hero-protection.jpg",
        "assets/udyam-hero-certificate.jpg",
        "trademark-registration/assets/tm-faq-advisory.jpg",
        "assets/logo-hero-branding.jpg",
        "assets/contact-hero-consultation.jpg",
        "assets/classes-hero-catalog.jpg",
        "assets/renewal-hero-timeline.jpg",
        "trademark-registration/assets/tm-support-steps.jpg",
        "assets/monitoring-hero-watch.jpg",
        "assets/setup-hero-foundations.jpg"
    ]
    for j in heavy_jpegs:
        optimize_image(j)
        
    print(f"\nCompleted {len(results)} image optimizations.")
    
    # Write ASSET_OPTIMIZATION_RESULTS.csv
    csv_path = os.path.join(PLANNING_DIR, "ASSET_OPTIMIZATION_RESULTS.csv")
    fieldnames = [
        "asset", "original_format", "original_size_kb", "optimized_format", 
        "optimized_size_kb", "png_fallback_kb", "mobile_variant_kb", 
        "savings_kb", "savings_pct", "dimensions", "alpha_preserved", "status"
    ]
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in results:
            writer.writerow(r)
            
    print(f"Results written to: {csv_path}")
    
    # Calculate total savings
    tot_orig = sum(r['original_size_kb'] for r in results)
    tot_opt = sum(r['optimized_size_kb'] for r in results)
    tot_saved = tot_orig - tot_opt
    tot_pct = round((tot_saved / tot_orig) * 100, 1)
    print(f"\nTOTAL SAVINGS ACROSS OPTIMIZED ASSETS:")
    print(f"Original: {round(tot_orig/1024, 2)} MB -> Optimized: {round(tot_opt/1024, 2)} MB")
    print(f"Net Bandwidth Saved: {round(tot_saved/1024, 2)} MB ({tot_pct}% reduction)")

if __name__ == "__main__":
    run_all_optimizations()
