---
name: vitepress-chapter-management
description: Manage VitePress experiment chapters and plugins. Use when adding, reordering, or removing experiment chapters, or when integrating new VitePress plugins into the documentation site.
---

# VitePress Chapter & Plugin Management

## Adding a New Chapter

1. **Create the Markdown file** in `src/document/` following the naming pattern `chap{XX}_{device}_{topic}.md` (e.g., `chap20_router_bgp.md`).

2. **Create the assets directory** alongside the file: `src/document/chap20_router_bgp.assets/`.

3. **Write the chapter content** with this structure:

```markdown
# {NN}：{Chapter Title}

## Experiment Objectives

## Network Topology

## Experiment Steps

## Command Reference

## Questions
```

4. **Register in sidebar** — edit `src/.vitepress/config.mts`, add an entry to the `sidebar['/document/'].items` array in the correct position by experiment number:

```typescript
{ text: '{NN}：{Title}', link: '/document/chap{XX}_{device}_{topic}' },
```

5. **Verify**: Run `npm run build` to confirm no errors.

## Reordering Chapters

Edit the `items` array order in `sidebar['/document/']` inside `src/.vitepress/config.mts`. The sidebar renders in array order.

## Integrating a New Plugin

1. **Install**: `npm install {plugin-name}`

2. **Register** the plugin in the appropriate location:
   - Vite plugin → `vite.plugins` array in `config.mts`
   - Markdown-it plugin → `markdown.config(md)` callback in `config.mts`
   - Config wrapper → wrap `defineConfig(...)` (e.g., `withMermaid(...)`)
   - Theme plugin → `src/.vitepress/theme/index.ts` via `enhanceApp` or `Layout` slots

3. **Handle SSR** if the plugin uses client-side APIs:
   - Add to `vite.optimizeDeps.exclude`
   - Add to `vite.ssr.noExternal`

4. **Localize** any user-facing text to Chinese.

5. **Verify**: Run `npm run build` and `npm run dev` to confirm.
