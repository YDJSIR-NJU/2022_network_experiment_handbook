---
name: document-export
description: Export the VitePress documentation to PDF, DOCX, or EPUB formats. Use when the user asks to export, print, or convert the handbook to PDF or other document formats.
---

# Document Export

## PDF Export

Uses [vitepress-export-pdf](https://github.com/condorheroblog/vitepress-export-pdf). Config file: `src/.vitepress/vitepress-pdf.config.ts`.

### Quick Start

```bash
npm run export-pdf
```

Output: `site.pdf` in the project root.

### Configuration

Key settings in `vitepress-pdf.config.ts`:

| Setting | Current Value | Notes |
|---------|---------------|-------|
| `format` | A4 | Paper size |
| `scale` | 0.85 | Page scale factor |
| `margin` | top/bottom 1cm, left/right 0.5cm | Page margins |
| `printBackground` | false | Whether to print CSS backgrounds |
| `displayHeaderFooter` | true | Show page headers/footers |
| `routePatterns` | `['!/404']` | Exclude 404 page |

### Important Notes

- **First run** downloads Chromium via Puppeteer automatically.
- **Page order** follows the sidebar configuration in `config.mts`. Verify order before publishing.
- The output file `site.pdf` is git-ignored.

## DOCX / EPUB Export

Use pandoc to convert Markdown source files directly:

```bash
# Single DOCX from all chapters
pandoc src/document/*.md -o handbook.docx

# EPUB with metadata
pandoc src/document/*.md --metadata title="互联网计算实验手册" -o handbook.epub
```

### Notes

- pandoc processes raw Markdown, not the VitePress-rendered HTML. VitePress-specific syntax (`::: tip`, `:::tabs`) will not render in pandoc output.
- Images referenced with relative paths may need path adjustments depending on the working directory.
- For best results, specify file order explicitly rather than relying on glob expansion.
