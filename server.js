const http = require('http');
const risk = require("./src/risk");

const r = new risk();

const server = http.createServer((req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json');
    res.end(r.calculate_risk(data));
  })
})

module.exports = server.listen(3000);