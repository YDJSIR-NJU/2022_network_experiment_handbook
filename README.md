# 2022 Network Experiment Handbook

<center>南京大学软件学院<br>2022</center>

> Powered by YDJSIR & lyc8503

## 项目简介

本仓库是南京大学软件学院《互联网计算》课程的改进计划的内部仓库，视情况发布后会公开。

本仓库的文档组织使用了 [VitePress](https://vitepress.dev/) 框架，以方便版本控制以及发布 Web 版本。实际线下导出时使用 PDF 形式。PDF 内尽量使用 PDF 自带的标签实现目录跳转。Markdown 源文件可根据需要使用 pandoc 等工具转换为 DOCX、EPUB 等其他格式。

## 环境要求

- **Node.js**: v22.16.0 （推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理版本）
- **包管理器**: npm（Node.js 自带）

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器（支持热更新）：

```bash
npm run dev
```

在开发模式下，对 Markdown 文本的更改会实时同步到网页上。

构建静态站点：

```bash
npm run build
```

构建结果位于 `src/.vitepress/dist` 目录，可直接部署到任意静态文件服务器。

本地预览构建结果：

```bash
npm run preview
```

## PDF 导出

本项目使用 [vitepress-export-pdf](https://github.com/condorheroblog/vitepress-export-pdf) 实现 PDF 导出。

```bash
npm run export-pdf
```

导出完成后，会在项目根目录生成 `site.pdf` 文件。

PDF 导出配置位于 `src/.vitepress/vitepress-pdf.config.ts`，可调整：

- 页面格式（默认 A4）
- 边距、缩放比例
- 页眉页脚显示
- 导出路径排除规则

> **注意**: PDF 导出依赖 Puppeteer，首次运行时会自动下载 Chromium 浏览器。导出的 PDF 页面顺序取决于站点 sidebar 配置，发布前可能需要手动检查顺序。

### 其他格式导出

VitePress 本身面向 HTML 静态站点。如需导出其他格式，可直接处理 `src/` 目录下的 Markdown 源文件：

```bash
# 示例：使用 pandoc 将所有 Markdown 转为单个 DOCX
pandoc src/document/*.md -o handbook.docx

# 示例：转换为 EPUB
pandoc src/document/*.md --metadata title="互联网计算实验手册" -o handbook.epub
```

## 项目结构

```
src/                          # VitePress 文档根目录
├── index.md                  # 首页
├── introduction/             # 背景介绍
│   ├── intro.md
│   ├── Switch.md
│   └── Router.md
├── document/                 # 实验指南
│   ├── quickStart.md
│   ├── chap03_router_basics.md
│   ├── chap06_switch_basics.md
│   ├── ...（共 17 个实验章节）
│   └── chap19_router_ospfv3.md
└── .vitepress/
    ├── config.mts            # VitePress 主配置
    ├── vitepress-pdf.config.ts  # PDF 导出配置
    └── theme/
        ├── index.ts          # 自定义主题入口
        └── style.css         # 自定义样式
```

## HTTPS 与域名跳转机制说明

**当前状态：本项目未启用任何强制 HTTPS 或域名跳转配置。**

以下记录了 VitePress 生态中可实现跳转的几种机制，供后续如需启用时参考：

### 1. `head` 配置注入 meta 标签

在 `config.mts` 的 `head` 数组中可添加 `<meta http-equiv="refresh">` 标签实现客户端跳转：

```typescript
// 示例（当前未启用）
head: [
  ['meta', { 'http-equiv': 'refresh', content: '0; url=https://example.com' }]
]
```

### 2. `transformHtml` / `transformPageData` 钩子

VitePress 提供构建时钩子，可在生成的 HTML 中注入重定向逻辑或修改页面数据：

```typescript
// 示例（当前未启用）
export default defineConfig({
  transformHtml(code, id, context) {
    // 可在此修改 HTML 输出，注入 JS 重定向等
  }
})
```

### 3. `rewrites` 路径重写

VitePress 的 `rewrites` 配置可将源文件路径映射到不同的 URL 路径，但不涉及 HTTP 跳转：

```typescript
// 示例（当前未启用）
export default defineConfig({
  rewrites: {
    'old-path/:page': 'new-path/:page'
  }
})
```

### 4. 部署层面配置

实际的 HTTPS 强制和域名重定向通常在部署层面配置：

- **Nginx**: 通过 `return 301 https://$host$request_uri;` 实现
- **Vercel**: 在 `vercel.json` 中配置 `redirects`
- **Netlify**: 在 `_redirects` 文件或 `netlify.toml` 中配置
- **Cloudflare Pages**: 通过 `_redirects` 文件配置

以上机制均为参考说明，本项目当前未使用任何跳转配置。

## 图片管理

请将图片放在与 Markdown 文件同名的 `.assets` 目录或同名目录下。使用以 `./` 开头的相对路径引用。可以使用 Typora 管理图片。
