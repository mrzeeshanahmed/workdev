# Data Model: Developer Dashboard

This document describes core entities, fields, types, and relationships needed by the Developer Dashboard feature.

## Entities

### Developer (user profile)
- id: uuid
- user_id: uuid (references users table)
- display_name: string
- headline: string
- bio: text
- skills: array<string>
- location: {country: string, city?: string, remote: boolean}
- hourly_rate_min: number
- hourly_rate_max: number
- portfolio_urls: array<string>
- avatar_url: string
- visibility: enum (public, private)
- created_at, updated_at

### Project
- id: uuid
- client_id: uuid
- title: string
- description: text
- required_skills: array<string>
- project_type: enum (fixed, hourly)
- budget_min: number
- budget_max: number
- tags: array<string>
- remote: boolean
- created_at, updated_at

### Proposal
- id: uuid
- developer_id: uuid
- project_id: uuid
- cover_letter: text
- hourly_rate: number (nullable)
- total_price: number (nullable)
- status: enum (submitted, viewed, shortlisted, interview, offered, accepted, rejected, withdrawn)
- created_at, updated_at

### SavedSearch
- id: uuid
- developer_id: uuid
- name: string
- criteria: json (keywords, skills[], project_type, budget_min, budget_max, remote)
- notification_cadence: enum (immediate, daily, weekly)
- last_notified_at: timestamp
- created_at, updated_at

### Analytics
- developer_id: uuid
- profile_views: integer (aggregate daily)
- proposals_submitted: integer (aggregate)
- proposals_accepted: integer (aggregate)
- metrics_by_day: json ({date: {views: int, proposals: int}})

## Indices & Search
- Full-text index on `Project.title` and `Project.description`.
- GIN index on `Project.required_skills` and `tags`.
- Indexes for `SavedSearch.developer_id` and `criteria` if supported.

## API Contracts (high-level)
- GET /developers/:id/dashboard -> returns profile, analytics, recent proposals, saved searches
- POST /developers/:id/saved-searches -> create saved search
- GET /developers/:id/saved-searches -> list
- POST /projects/:id/proposals -> submit proposal
- GET /developers/:id/proposals -> list proposals

## Notes
- Criteria normalization: store skills and tags in lowercase, dedupe arrays.
- Timezones: store timestamps in UTC.
- Privacy: analytics endpoints require auth and scope checking.
