import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../styles/marketplace.css';
export default function DeveloperCard({ id, name, headline, skills }) {
    return (_jsxs("article", { className: "dev-card", children: [_jsx("h3", { children: name }), _jsx("p", { children: headline }), skills && skills.length > 0 && _jsxs("p", { children: ["Skills: ", skills.join(', ')] }), _jsx("a", { href: `/developers/${id}`, children: "View profile" })] }));
}
