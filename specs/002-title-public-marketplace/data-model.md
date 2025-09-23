# Data Model: Public marketplace and developer directory

## Entities

### projects
- id: UUID PRIMARY KEY
- title: TEXT
- short_description: TEXT
- description: TEXT
- client_id: UUID REFERENCES users(id)
- project_type: TEXT -- 'fixed' | 'hourly' | 'ongoing'
- budget_min: INTEGER
- budget_max: INTEGER
- budget_currency: TEXT -- 'USD'
- is_public: BOOLEAN DEFAULT true
- featured: BOOLEAN DEFAULT false
- featured_at: TIMESTAMP NULL
- created_at: TIMESTAMP DEFAULT now()
- updated_at: TIMESTAMP DEFAULT now()

Indexes and search support:
- CREATE INDEX projects_title_trgm_idx ON projects USING gin (to_tsvector('english', title || ' ' || coalesce(short_description, '')));
- CREATE INDEX projects_tsv_idx ON projects USING gin (to_tsvector('english', title || ' ' || coalesce(description, '')));

### skills
- id: UUID PRIMARY KEY
- name: TEXT UNIQUE
- slug: TEXT UNIQUE

### project_skills (join)
- project_id: UUID REFERENCES projects(id)
- skill_id: UUID REFERENCES skills(id)

### developer_profiles
- id: UUID PRIMARY KEY
- user_id: UUID REFERENCES users(id)
- display_name: TEXT
- headline: TEXT
- summary: TEXT
- hourly_rate_min: INTEGER NULL
- hourly_rate_max: INTEGER NULL
- availability: TEXT -- 'immediately' | 'within_2_weeks' | 'not_available'
- location: TEXT NULL
- portfolio_links: JSONB
- rating: NUMERIC DEFAULT 0
- created_at: TIMESTAMP DEFAULT now()
- updated_at: TIMESTAMP DEFAULT now()

### developer_skills (join)
- developer_id: UUID REFERENCES developer_profiles(id)
- skill_id: UUID REFERENCES skills(id)

Pagination: prefer cursor-based for large-scale lists; include `created_at` or `id`-based cursor fields.

Notes:
- All budgets stored in USD in v1. If multi-currency is required later, add `budget_currency` and conversion pipeline.
- Use GIN indexes on tsvector columns for title/description searches. For simple `ILIKE` implementations, use trigram indexes.
