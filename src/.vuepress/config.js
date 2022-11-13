const markdown = require('vuepress-plugin-mathjax/src/markdown')
const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '互联网计算实验手册',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: "Powered by YDJSIR & lyc0853",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    [{ rel: 'icon', href: 'favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: true,
    watchOptions: {
      ignored: '/node_modules/'
    },
    lastUpdated: '最近更新',
    nav: [
      {
        text: '背景介绍',
        link: '/introduction/intro.html'
      },
      {
        text: '实验指南',
        link: '/document/quickStart.html'
      },
    ],
    sidebarDepth: 4,
    sidebar: {
      '/introduction/': [
        {
          title: '背景介绍',
          collapsable: true,
          children: [
            'intro',
            'Switch',
            'Router'
          ]
        }
      ],
      '/document/': [
        {
          title: '实验指南',
          collapsable: true,
          children: [
            'quickStart',
            'chap03_router_basics',
            'chap04_router_recovery',
            'chap05_router_backup',
            'chap06_switch_basics',
            'chap07_switch_security',
            'chap08_router_static',
            'chap09_router_rip',
            'chap10_router_ospf',
            'chap11_router_vlan',
            'chap12_router_nat',
            'chap13_router_acl',
            'chap14_router_ppp',
            'chap15_router_frame',
            'chap16_dhcp_protect',
            'chap17_router_ipv6_static',
            'chap18_router_ipv6_ripng',
            'chap19_router_ospfv3',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/back-to-top',
    [
      'vuepress-plugin-zooming',
      {
        delay: 1000,
        options: {
          bgColor: 'rgb(1, 1, 1)',
          bgOpacity: '0.3',
          zIndex: 1000,
        },
      },
    ],
    'vuepress-plugin-mathjax',
    ['@snowdog/vuepress-plugin-pdf-export', {
      // sorter: true,
      puppeteerLaunchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      pageOptions: {
        // landscape: true,
        displayHeaderFooter: true,
        footerTemplate: "<pageNumber><pageNumber>",
        printBackground: false,
        format: "A4",
        scale: 0.85,
        margin: {
          top: "1cm",
          right: "0.5cm",
          bottom: "1cm",
          left: "0.5cm"
        }
      }
    }],
    '@vuepress/nprogress',
    '@vuepress/last-updated'
    // 'element-ui',
  ],
  markdown: {
    lineNumbers: true,
    extendMarkdown: md => {
      md.set({
        html: true,
        linkify: true,
        typographer: true
      })
      md.use(require("markdown-it-sub"))
      md.use(require("markdown-it-sup"))
      md.use(require("markdown-it-footnote"))
      md.use(require("markdown-it-deflist"))
      md.use(require("markdown-it-abbr"))
    },
    extractHeaders: ['h2', 'h3', 'h4'],
    toc: { includeLevel: [2, 3, 4] }
  },

}



