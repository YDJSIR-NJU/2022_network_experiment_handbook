# Citi-Vuepress

Static Document Site of TextualESG

## 给商业组同学

请直接在 https://git.nju.edu.cn/YDJSIR/citi-vuepress 上更新Markdown即可，其他的东西不要碰。

所有的更改都会推送到COS上，而后就可以访问`doc.textualesg.com`查看实际效果。这个过程应该是没有缓存的，等几分钟`Ctrl+F5`刷新一下就可以了。

## 给软件组同学

### 前言

这个`Vuepress`是直接用官网的`creater`搞出来的，好像因为版本太新和很多插件都不兼容，试了很久，基本上这个仓库里面推荐的插件都是一装就炸。干脆就直接用原生的吧。反正大多数时候他也是独立网站或者是嵌到网页侧边的`drawer`里面。

### 添加文件步骤

`tips`是预留给网页右侧嵌入的`drawer`的，在下面创建文件，一样会生成文件，只是右上角导航栏不会留条路过去罢了。

`document`用来放指标说明等相关内容，`guide`用来放使用指南相关内容。

```bash
src
├── document
│   ├── indexDesc.md
│   ├── pointerDesc.md
│   └── README.md
├── guide
│   ├── README.md
│   ├── terms.md
│   └── userguide.md
├── index.md
└── tips
```

在对应的文件夹下面加一个markdown文件，比如说叫`indexDesc.md`。

而后修改`config.js`，修改一下导航栏相关内容。

```yaml
sidebar: {
      '/guide/': [
        {
          title: '使用指南',
          collapsable: true,
          children: [
            '',
            'userguide',
            'terms'
          ]
        }
      ],
      '/document/': [
        {
          title: '相关说明',
          collapsable: true,
          children: [
            '',
            'pointerDesc',
            'indexDesc'
          ]
        }
      ]
    }
```

