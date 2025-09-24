import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ProposalReview({ proposals, onShortlist }) {
    const list = proposals || [];
    if (list.length === 0)
        return _jsx("div", { role: "status", "aria-live": "polite", children: "No proposals" });
    return (_jsxs("div", { children: [_jsx("h2", { children: "Proposals" }), _jsx("ul", { children: list.map(p => (_jsxs("li", { "data-testid": `proposal-${p.id}`, children: [_jsx("div", { children: p.applicant_name }), _jsx("div", { children: p.cover_letter }), _jsxs("div", { children: ["Bid: ", p.bid] }), _jsx("button", { type: "button", "aria-label": `Shortlist ${p.applicant_name}`, onClick: () => onShortlist && onShortlist(p.id), children: "Shortlist" })] }, p.id))) })] }));
}
