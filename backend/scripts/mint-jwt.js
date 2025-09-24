#!/usr/bin/env node
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'dev-secret'
const argv = process.argv.slice(2)
const sub = argv[0] || 'local-user'
const expiresIn = argv[1] || '1h'

const token = jwt.sign({}, secret, { subject: sub, expiresIn })
console.log(token)
