const path = require('path')
const handlerPath = path.resolve(__dirname, '../functions/handlers/auth/signup.js')
console.log('handlerPath:', handlerPath)
try {
  const h = require(handlerPath)
  console.log('typeof handler:', typeof h)
  if (typeof h === 'function') console.log('handler is function — OK')
} catch (err) {
  console.error('require error:', err && err.stack)
  process.exit(2)
}
