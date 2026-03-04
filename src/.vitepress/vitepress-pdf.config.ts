import { defineUserConfig } from 'vitepress-export-pdf'

export default defineUserConfig({
  outFile: 'site.pdf',
  outDir: './',
  pdfOptions: {
    format: 'A4',
    displayHeaderFooter: true,
    printBackground: false,
    scale: 0.85,
    margin: {
      top: '1cm',
      right: '0.5cm',
      bottom: '1cm',
      left: '0.5cm',
    },
  },
  puppeteerLaunchOptions: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  routePatterns: ['!/404'],
})
