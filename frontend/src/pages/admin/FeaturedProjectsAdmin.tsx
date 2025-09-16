import React, { useEffect, useState } from 'react'
import '../../styles/marketplace.css'

export default function FeaturedProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([])
  useEffect(() => {
    // fetch current featured projects (best-effort)
    fetch('/api/public/projects?featured=true')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setProjects(data.items || []))
      .catch(() => setProjects([]))
  }, [])

  return (
    <div>
      <h1>Featured Projects (Admin)</h1>
      <p>This is a minimal admin UI to mark/unmark featured projects. Implement server-side actions separately.</p>
      <ul>
        {projects.map(p => (
          <li key={p.id} className="project-card">
            <strong>{p.title}</strong>
            <div><a href={`/projects/${p.id}`}>View</a></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
