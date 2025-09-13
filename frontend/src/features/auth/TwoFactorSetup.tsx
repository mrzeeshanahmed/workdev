import React, { useState } from 'react'

export const TwoFactorSetup: React.FC<{ userId: string }> = ({ userId }) => {
  const [qr, setQr] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [token, setToken] = useState('')
  const [verified, setVerified] = useState<boolean | null>(null)

  async function setup() {
    const res = await fetch('/functions/auth/2fa/setup', { method: 'POST', body: JSON.stringify({ userId }), headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    setQr(data.qr)
    setSecret(data.secret)
    setBackupCodes(data.backupCodes)
  }

  async function verify() {
    const res = await fetch('/functions/auth/2fa/verify', { method: 'POST', body: JSON.stringify({ userId, token }), headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    setVerified(data.valid)
  }

  function downloadBackupCodes() {
    if (!backupCodes) return
    const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workdev-${userId}-2fa-backup.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h3>Two-factor setup</h3>
      {!qr && <button onClick={setup}>Start 2FA setup</button>}
      {qr && (
        <div>
          <img src={qr} alt="2fa-qr" />
          <p>Secret: {secret}</p>
          <button onClick={downloadBackupCodes}>Download backup codes</button>
          <div>
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456" />
            <button onClick={verify}>Verify</button>
          </div>
          {verified !== null && <div>{verified ? 'Verified' : 'Invalid code'}</div>}
        </div>
      )}
    </div>
  )
}

export default TwoFactorSetup
