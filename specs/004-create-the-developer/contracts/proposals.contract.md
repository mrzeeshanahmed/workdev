# Contract: Proposals API

This contract specifies endpoints for submitting and listing proposals related to projects.

## POST /projects/:projectId/proposals
Request 201 JSON
- developer_id: uuid
- project_id: uuid
- cover_letter: string
- hourly_rate?: number
- total_price?: number

Response 201 JSON
- id: uuid
- developer_id: uuid
- project_id: uuid
- status: string (submitted)
- created_at: timestamp

Errors:
- 400 invalid payload
- 403 if developer not authorized
- 404 project not found

## GET /developers/:developerId/proposals
Response 200 JSON
- proposals: array of proposal summaries
  - id: uuid
  - project_id: uuid
  - status: enum (submitted, viewed, shortlisted, interview, offered, accepted, rejected, withdrawn)
  - created_at: timestamp
  - project_title: string (optional)

Errors:
- 403 if not authorized
- 404 developer not found
