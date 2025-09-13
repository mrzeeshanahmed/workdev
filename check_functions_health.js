const http = require('http')

const port = process.env.FUNCTIONS_PORT || 54323
const options = {
  hostname: 'localhost',
  port: port,
  path: '/functions/v1/health',
  method: 'GET',
  timeout: 2000
}

const req = http.request(options, (res) => {
  console.log('status', res.statusCode)
  let body = ''
  res.on('data', (chunk) => (body += chunk))
  res.on('end', () => console.log('body', body))
})

req.on('error', (err) => {
  console.error('err', err.message)
})

req.on('timeout', () => {
  req.destroy(new Error('timeout'))
})

req.end()
