import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { pagefindPlugin, chineseSearchOptimize } from 'vitepress-plugin-pagefind'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
// import { generateSidebar } from 'vitepress-sidebar'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItDeflist from 'markdown-it-deflist'
import markdownItAbbr from 'markdown-it-abbr'

export default withMermaid(
  defineConfig({
    title: '互联网计算实验手册',
    description: 'Powered by YDJSIR & lyc8503',
    lang: 'zh-CN',

    head: [
      ['meta', { name: 'theme-color', content: '#3eaf7c' }],
      ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
      ['link', { rel: 'icon', href: '/favicon.ico' }],
    ],

    lastUpdated: true,

    ignoreDeadLinks: [
      /\.pkt$/,
    ],

    vite: {
      plugins: [
        pagefindPlugin({
          customSearchQuery: chineseSearchOptimize,
          btnPlaceholder: '搜索',
          placeholder: '搜索文档',
          emptyText: '空空如也',
          heading: '共: {{searchResult}} 条结果',
        }),
      ],
      optimizeDeps: {
        exclude: [
          '@nolebase/vitepress-plugin-enhanced-readabilities/client',
          'vitepress',
          '@nolebase/ui',
        ],
      },
      ssr: {
        noExternal: [
          '@nolebase/vitepress-plugin-enhanced-readabilities',
          '@nolebase/ui',
        ],
      },
    },

    markdown: {
      lineNumbers: true,
      math: true,
      config: (md) => {
        md.use(markdownItSub)
        md.use(markdownItSup)
        md.use(markdownItFootnote)
        md.use(markdownItDeflist)
        md.use(markdownItAbbr)
        md.use(tabsMarkdownPlugin)
      },
    },

    mermaid: {},

    themeConfig: {
      outline: {
        level: [2, 4],
        label: '目录',
      },

      lastUpdated: {
        text: '最近更新',
      },

      nav: [
        { text: '背景介绍', link: '/introduction/intro' },
        { text: '实验指南', link: '/document/quickStart' },
      ],

      // To use auto-generated sidebar via vitepress-sidebar, replace the
      // manual sidebar below with: sidebar: generateSidebar({ ... })
      // See: https://vitepress-sidebar.cdget.com/guide/getting-started
      sidebar: {
        '/introduction/': [
          {
            text: '背景介绍',
            collapsed: false,
            items: [
              { text: '背景介绍', link: '/introduction/intro' },
              { text: '交换机', link: '/introduction/Switch' },
              { text: '路由器', link: '/introduction/Router' },
            ],
          },
        ],
        '/document/': [
          {
            text: '实验指南',
            collapsed: false,
            items: [
              { text: '快速开始', link: '/document/quickStart' },
              { text: '01：路由器基本命令', link: '/document/chap03_router_basics' },
              { text: '02：交换机基本命令', link: '/document/chap06_switch_basics' },
              { text: '03：交换机端口安全', link: '/document/chap07_switch_security' },
              { text: '04：静态路由和简单组网', link: '/document/chap08_router_static' },
              { text: '05：动态RIP', link: '/document/chap09_router_rip' },
              { text: '06：配置单域OSPF', link: '/document/chap10_router_ospf' },
              { text: '07：VLAN间路由', link: '/document/chap11_router_vlan' },
              { text: '08：NAT网络地址转换', link: '/document/chap12_router_nat' },
              { text: '09：ACL实验', link: '/document/chap13_router_acl' },
              { text: '10：PPP验证实验', link: '/document/chap14_router_ppp' },
              { text: '11：帧中继实验', link: '/document/chap15_router_frame' },
              { text: '12：DHCP欺诈保护', link: '/document/chap16_dhcp_protect' },
              { text: '13：IPv6静态路由和默认路由实验', link: '/document/chap17_router_ipv6_static' },
              { text: '14：IPv6环境中的RIPng配置', link: '/document/chap18_router_ipv6_ripng' },
              { text: '15：IPv6环境的OSPFv3实验', link: '/document/chap19_router_ospfv3' },
            ],
          },
        ],
      },

      footer: {
        message: '<a href="http://www.beian.miit.gov.cn" style="color: #bcbec2; text-decoration: none;">粤ICP备20028390号-1</a>',
      },

      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },

      returnToTopLabel: '返回顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
    },
  })
)
