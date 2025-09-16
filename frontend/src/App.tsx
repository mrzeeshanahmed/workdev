import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import OnboardingForm from './features/onboarding/OnboardingForm'
import ProfilePage from './features/profile/ProfilePage'
import VettingQueue from './features/admin/VettingQueue'
import ReviewsPage from './features/reviews/ReviewsPage'
import ProjectsPage from './pages/marketplace/ProjectsPage'
import DevelopersPage from './pages/marketplace/DevelopersPage'

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/onboarding">Onboarding</Link> | <Link to="/reviews/proj-1">Reviews</Link> | <Link to="/admin/vetting">Vetting</Link>
        {' '}| <Link to="/projects">Projects</Link> | <Link to="/developers">Developers</Link>
      </nav>
      <Routes>
        <Route path="/onboarding" element={<OnboardingForm userId={'test-user'} />} />
  <Route path="/profile/:id" element={<ProfilePageWrapper />} />
  <Route path="/reviews/:projectId" element={<ReviewsPageWrapper />} />
  <Route path="/admin/vetting" element={<VettingQueue />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/developers" element={<DevelopersPage />} />
  <Route path="/" element={<div>Welcome to WorkDev - use navigation above</div>} />
      </Routes>
    </div>
  )
}

function ProfilePageWrapper() {
  // lightweight wrapper to read id from params without adding extra deps in tests
  const id = window.location.pathname.replace('/profile/', '')
  return <ProfilePage id={id || 'test-user'} />
}

function ReviewsPageWrapper() {
  const pid = window.location.pathname.replace('/reviews/', '')
  return <ReviewsPage projectId={pid || 'proj-1'} />
}
