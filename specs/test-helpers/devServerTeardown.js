const { stop } = require('./devServerSetup')

module.exports = async function globalTeardown() {
  await stop()
}
