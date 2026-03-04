import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import { nextTick, watch, onMounted } from 'vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
  NolebaseEnhancedReadabilitiesPlugin,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import './style.css'
import './medium-zoom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      locales: {
        'zh-CN': {
          title: { title: '阅读增强' },
        },
      },
    })
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      if (inBrowser)
        mediumZoom('.vp-doc img:not(.no-zoom)', { background: 'rgba(0, 0, 0, 0.6)' })
    }
    onMounted(initZoom)
    watch(() => route.path, () => nextTick(initZoom))
  },
} satisfies Theme
