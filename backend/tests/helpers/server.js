import http from 'http'
import app from '../../src/app.js'

export function createTestServer() {
  const server = http.createServer(app)
  return server
}

export default createTestServer
