import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Link } from 'react-router-dom';
import OnboardingForm from './features/onboarding/OnboardingForm';
import ProfilePage from './features/profile/ProfilePage';
import VettingQueue from './features/admin/VettingQueue';
import ReviewsPage from './features/reviews/ReviewsPage';
import ProjectsPage from './pages/marketplace/ProjectsPage';
import DevelopersPage from './pages/marketplace/DevelopersPage';
export default function App() {
    return (_jsxs("div", { children: [_jsxs("nav", { children: [_jsx(Link, { to: "/onboarding", children: "Onboarding" }), " | ", _jsx(Link, { to: "/reviews/proj-1", children: "Reviews" }), " | ", _jsx(Link, { to: "/admin/vetting", children: "Vetting" }), ' ', "| ", _jsx(Link, { to: "/projects", children: "Projects" }), " | ", _jsx(Link, { to: "/developers", children: "Developers" })] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/onboarding", element: _jsx(OnboardingForm, { userId: 'test-user' }) }), _jsx(Route, { path: "/profile/:id", element: _jsx(ProfilePageWrapper, {}) }), _jsx(Route, { path: "/reviews/:projectId", element: _jsx(ReviewsPageWrapper, {}) }), _jsx(Route, { path: "/admin/vetting", element: _jsx(VettingQueue, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectsPage, {}) }), _jsx(Route, { path: "/developers", element: _jsx(DevelopersPage, {}) }), _jsx(Route, { path: "/", element: _jsx("div", { children: "Welcome to WorkDev - use navigation above" }) })] })] }));
}
function ProfilePageWrapper() {
    // lightweight wrapper to read id from params without adding extra deps in tests
    const id = window.location.pathname.replace('/profile/', '');
    return _jsx(ProfilePage, { id: id || 'test-user' });
}
function ReviewsPageWrapper() {
    const pid = window.location.pathname.replace('/reviews/', '');
    return _jsx(ReviewsPage, { projectId: pid || 'proj-1' });
}
