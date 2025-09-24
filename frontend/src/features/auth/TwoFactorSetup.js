import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const TwoFactorSetup = ({ userId }) => {
    const [qr, setQr] = useState(null);
    const [secret, setSecret] = useState(null);
    const [backupCodes, setBackupCodes] = useState(null);
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(null);
    async function setup() {
        const res = await fetch('/functions/auth/2fa/setup', { method: 'POST', body: JSON.stringify({ userId }), headers: { 'Content-Type': 'application/json' } });
        const data = await res.json();
        setQr(data.qr);
        setSecret(data.secret);
        setBackupCodes(data.backupCodes);
    }
    async function verify() {
        const res = await fetch('/functions/auth/2fa/verify', { method: 'POST', body: JSON.stringify({ userId, token }), headers: { 'Content-Type': 'application/json' } });
        const data = await res.json();
        setVerified(data.valid);
    }
    function downloadBackupCodes() {
        if (!backupCodes)
            return;
        const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workdev-${userId}-2fa-backup.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    return (_jsxs("div", { children: [_jsx("h3", { children: "Two-factor setup" }), !qr && _jsx("button", { onClick: setup, children: "Start 2FA setup" }), qr && (_jsxs("div", { children: [_jsx("img", { src: qr, alt: "2fa-qr" }), _jsxs("p", { children: ["Secret: ", secret] }), _jsx("button", { onClick: downloadBackupCodes, children: "Download backup codes" }), _jsxs("div", { children: [_jsx("input", { value: token, onChange: (e) => setToken(e.target.value), placeholder: "123456" }), _jsx("button", { onClick: verify, children: "Verify" })] }), verified !== null && _jsx("div", { children: verified ? 'Verified' : 'Invalid code' })] }))] }));
};
export default TwoFactorSetup;
