// Gera proposta-arcus-club.pdf a partir do servidor de desenvolvimento
// Uso: node generate-pdf.js
// (o servidor dev precisa estar rodando: npm run dev)

import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.join(__dirname, 'proposta-arcus-club.pdf')
const URL = 'http://localhost:5173/proposta'

console.log('Abrindo navegador...')
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()

// Viewport A4 a 96dpi
await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })

console.log(`Carregando ${URL} ...`)
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })

// Aguarda fontes e imagens
await page.evaluateHandle('document.fonts.ready')
await new Promise(r => setTimeout(r, 1500))

console.log('Gerando PDF...')
await page.pdf({
  path: OUTPUT,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  scale: 1,
})

await browser.close()
console.log(`✓ PDF salvo em: ${OUTPUT}`)
