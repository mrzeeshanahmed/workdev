# Contract: Saved Searches API

This contract specifies endpoints to manage developer saved searches and notification preferences.

## POST /developers/:developerId/saved-searches
Request 201 JSON
- name: string
- criteria: object (keywords, skills[], project_type, budget_min, budget_max, remote)
- notification_cadence: string (immediate | daily | weekly)

Response 201 JSON
- id: uuid
- developer_id: uuid
- name: string
- criteria: object
- notification_cadence: string

Errors:
- 400 invalid payload
- 409 duplicate saved search

## GET /developers/:developerId/saved-searches
Response 200 JSON
- saved_searches: array
  - id, name, criteria, notification_cadence, last_notified_at

Errors:
- 403 if not authorized
- 404 developer not found

## DELETE /developers/:developerId/saved-searches/:id
Response 204 No Content

Errors:
- 403 if not authorized
- 404 saved search not found
