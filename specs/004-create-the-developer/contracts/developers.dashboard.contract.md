# Contract: Developer Dashboard API

This contract specifies the expected shapes for the Developer Dashboard API.

## GET /developers/:id/dashboard
Response 200 JSON
- developer: object
  - id: uuid
  - display_name: string
  - headline: string
  - skills: array<string>
  - avatar_url: string
- analytics: object
  - profile_views: integer
  - proposals_submitted: integer
  - proposals_accepted: integer
- recent_proposals: array of proposals (id, project_id, status, created_at)
- saved_searches: array of saved search summaries (id, name, criteria, notification_cadence)

Errors:
- 403 if requesting user is not the developer or authorized admin
- 404 if developer not found

## POST /developers/:id/saved-searches
Request JSON:
- name: string
- criteria: object
- notification_cadence: string (immediate | daily | weekly)

Response 201 JSON:
- id: uuid
- name: string
- criteria: object
- notification_cadence: string

Errors:
- 400 invalid criteria
- 409 duplicate saved search
