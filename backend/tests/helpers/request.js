import supertest from 'supertest'
import app from '../../src/app.js'

// Export a pre-bound supertest client for convenience in tests
const request = supertest(app)
export default request
