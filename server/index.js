
if (typeof window === 'undefined') {
  global.window = {}
}
// if (typeof self === 'undefined') {
//   global.self = {}
// }

const fs = require('fs')
const path = require('path')
const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server')
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8')


const server = (port) => {
  const app = express()

  app.use(express.static(path.join(__dirname, '../dist')))

  app.get('/search', (req, res) => {
    const html = renderMarkup(renderToString(SSR))
    res.status(200).send(html)
  })

  app.listen(port, () => {
    console.log('Server is running on port:', port)
  })
}

const renderMarkup = (str) => {
  console.log('renderMarkup', str)
  return template.replace('<!--HTML_PALCEHOLDER-->', str)
}

server(process.env.PORT || 3000)