import fetch from 'node-fetch'

export const BASE = process.env.CONTRACT_BASE_URL || process.env.FUNCTIONS_BASE_URL || 'http://127.0.0.1:4000'

export async function getJson(path: string) {
  const res = await fetch(`${BASE}${path}`)
  return { status: res.status, body: await res.json() }
}
