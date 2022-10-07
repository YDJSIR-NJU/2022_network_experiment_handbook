const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '互联网计算实验手册 2.0',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

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
        link: '/introduction/'
      },
      {
        text: '快速开始',
        link: '/guide/',
      },
      {
        text: '实验指南',
        link: '/document/'
      },
    ],
    sidebar: {
      '/introduction/': [
        {
          title: '背景介绍',
          collapsable: true,
          children: [
            '',
          ]
        }
      ],
      '/guide/': [
        {
          title: '快速开始',
          collapsable: true,
          children: [
            '',
            'cheatsheet'
          ]
        }
      ],
      '/document/': [
        {
          title: '实验指南',
          collapsable: true,
          children: [
            '',
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
            'chap19_router_ipv6_ospfv3',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'vuepress-plugin-mathjax',
    // 'element-ui',
  ]
}

