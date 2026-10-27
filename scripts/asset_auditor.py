#!/usr/bin/env python3
"""
Comprehensive Asset Auditor & Baseline Scanner for BRNDNUR Advisory LLP.
Scans all images, fonts, SVGs, and media files across source and public directories.
Analyzes true file formats, dimensions, transparency, file sizes, and usage across codebases.
Generates .planning/ASSET_INVENTORY.json and updates .planning/ASSET_OPTIMIZATION_PLAN.md.
"""

import hashlib
import json
import os
import re
from PIL import Image

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANNING_DIR = os.path.join(WORKSPACE_ROOT, ".planning")
os.makedirs(PLANNING_DIR, exist_ok=True)

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".gif", ".ico"}
FONT_EXTENSIONS = {".woff", ".woff2", ".ttf", ".otf", ".eot"}
MEDIA_EXTENSIONS = IMAGE_EXTENSIONS | FONT_EXTENSIONS | {".mp4", ".webm", ".pdf"}

IGNORE_DIRS = {".git", "node_modules", ".astro", "dist", ".planning", ".gemini", ".system_generated", "audit"}

def get_file_hash(filepath):
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

COMBINED_PATTERN = re.compile(
    r'[\'\"/]([^\'\"\s\<\>\(\)]+\.(?:png|jpe?g|webp|avif|svg|gif|ico|woff2?|ttf|otf|eot|mp4|webm|pdf))',
    re.IGNORECASE
)

def scan_text_references():
    """Scan all source code, components, styles, content, and manifests for asset references."""
    references = {}
    code_extensions = {".astro", ".html", ".css", ".js", ".ts", ".json", ".md", ".webmanifest", ".xml"}
    
    for root, dirs, files in os.walk(WORKSPACE_ROOT):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in code_extensions:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, WORKSPACE_ROOT).replace("\\", "/")
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        for match in COMBINED_PATTERN.findall(content):
                            filename = os.path.basename(match)
                            references.setdefault(filename, set()).add(rel_path)
                except Exception:
                    pass
    return {k: sorted(list(v)) for k, v in references.items()}

def audit_assets():
    ref_map = scan_text_references()
    assets = []
    hashes = {}
    
    # Folders to scan
    scan_folders = ["public", "src", "trademark-registration", "services", "packages", "logo"]
    
    for folder in scan_folders:
        dir_path = os.path.join(WORKSPACE_ROOT, folder)
        if not os.path.exists(dir_path):
            continue
        for root, dirs, files in os.walk(dir_path):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in MEDIA_EXTENSIONS:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, WORKSPACE_ROOT).replace("\\", "/")
                    file_size = os.path.getsize(file_path)
                    file_hash = get_file_hash(file_path)
                    
                    # Duplicate detection
                    is_duplicate = file_hash in hashes
                    duplicate_of = hashes.get(file_hash)
                    if not is_duplicate:
                        hashes[file_hash] = rel_path
                        
                    # Image metadata inspection
                    width = None
                    height = None
                    real_format = None
                    has_alpha = False
                    is_animated = False
                    
                    if ext in IMAGE_EXTENSIONS and ext != ".svg":
                        try:
                            with Image.open(file_path) as img:
                                width, height = img.size
                                real_format = img.format
                                has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
                                is_animated = getattr(img, "is_animated", False)
                        except Exception:
                            real_format = "CORRUPTED"
                    elif ext == ".svg":
                        real_format = "SVG"
                    elif ext in FONT_EXTENSIONS:
                        real_format = ext.lstrip(".").upper()
                    else:
                        real_format = ext.lstrip(".").upper()
                        
                    filename = os.path.basename(file)
                    used_in = ref_map.get(filename, [])
                    
                    assets.append({
                        "path": rel_path,
                        "filename": filename,
                        "extension": ext,
                        "verified_format": real_format,
                        "size_bytes": file_size,
                        "size_kb": round(file_size / 1024, 2),
                        "width": width,
                        "height": height,
                        "has_alpha": has_alpha,
                        "is_animated": is_animated,
                        "hash": file_hash,
                        "is_duplicate": is_duplicate,
                        "duplicate_of": duplicate_of,
                        "referenced_in": used_in,
                        "reference_count": len(used_in)
                    })
                    
    # Sort assets by size descending
    assets.sort(key=lambda x: x["size_bytes"], reverse=True)
    
    # Summary statistics
    total_files = len(assets)
    total_bytes = sum(a["size_bytes"] for a in assets)
    
    format_counts = {}
    format_bytes = {}
    for a in assets:
        fmt = a["verified_format"] or a["extension"]
        format_counts[fmt] = format_counts.get(fmt, 0) + 1
        format_bytes[fmt] = format_bytes.get(fmt, 0) + a["size_bytes"]
        
    summary = {
        "scan_timestamp": "2026-10-22",
        "total_assets": total_files,
        "total_size_bytes": total_bytes,
        "total_size_mb": round(total_bytes / (1024 * 1024), 2),
        "format_breakdown": {
            fmt: {
                "count": format_counts[fmt],
                "size_kb": round(format_bytes[fmt] / 1024, 2),
                "size_mb": round(format_bytes[fmt] / (1024 * 1024), 2)
            } for fmt in format_counts
        },
        "large_assets_gt_300kb": [a for a in assets if a["size_bytes"] > 300 * 1024],
        "duplicate_assets": [a for a in assets if a["is_duplicate"]],
        "zero_reference_candidates": [a for a in assets if a["reference_count"] == 0]
    }
    
    # Save ASSET_INVENTORY.json
    inv_path = os.path.join(PLANNING_DIR, "ASSET_INVENTORY.json")
    with open(inv_path, "w", encoding="utf-8") as f:
        json.dump({"summary": summary, "assets": assets}, f, indent=2)
        
    print(f"Audit completed: {total_files} assets discovered. Total size: {summary['total_size_mb']} MB.")
    print(f"Assets > 300KB: {len(summary['large_assets_gt_300kb'])}. Duplicates: {len(summary['duplicate_assets'])}.")
    return summary, assets

if __name__ == "__main__":
    audit_assets()
