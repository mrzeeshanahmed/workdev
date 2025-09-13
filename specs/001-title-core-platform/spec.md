````markdown
# Feature Specification: Core platform and user management system for WorkDev

**Feature Branch**: `001-title-core-platform`  
**Created**: 2025-09-13  
**Status**: Draft  
**Input**: User description: "Core platform and user management system: roles Client and Developer with guided onboarding; auth (email/password, password reset, GitHub, Google), mandatory 2FA; Developer profiles: picture, headline, hourly rate, availability, bio, skills, portfolio, work history, GitHub integration, Vetting Badge; Client profiles: logo, name, description, website, public hiring history; real-time messaging with file attachments, unread indicators, email notifications; two-way reputation with criteria Quality, Communication, Expertise, Adherence to Deadlines; ratings and public reviews displayed on profiles."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors (Client, Developer), actions (register, onboard, message, hire, rate), data (profiles, messages, ratings), constraints (mandatory 2FA, social auth)
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements (below)
6. Identify Key Entities (see Key Entities section)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- Build a secure, test-first user management system with two distinct roles: `Client` and `Developer`.
- Authentication must support: email/password with password reset, OAuth via GitHub and Google, and mandatory Two-Factor Authentication (2FA) for all accounts.
- Developer and Client profiles have role-specific required fields (see Key Entities).
- Real-time messaging must support attachments, unread indicators, and email notifications.
- Reputation is two-way and public, with ratings across 4 criteria: Quality, Communication, Expertise, Adherence to Deadlines.

### Section Requirements
- **Mandatory sections**: User Scenarios, Acceptance Scenarios, Functional Requirements, Key Entities, Review & Acceptance Checklist.
- **When drafting tests**: create contract-level tests for APIs (auth, profiles, messaging, ratings) that fail initially.

## User Scenarios & Testing *(mandatory)*

### Primary User Story
Client and Developer can sign up, complete a guided onboarding for their role, authenticate securely (including mandatory 2FA), communicate in real-time with file attachments and receive email notifications, and participate in projects where both parties can rate each other after completion. Profiles display public ratings and relevant profile metadata (portfolio, hiring history, GitHub activity).

### Acceptance Scenarios
1. Given a new user, when they register via email/password, then they receive an email verification and must enable 2FA before performing sensitive actions.
2. Given a new user, when they sign up via GitHub or Google, then their account is created, they are prompted to complete role-specific onboarding, and 2FA enrollment is mandatory.
3. Given a Developer, when they complete onboarding, then their profile includes picture, headline, hourly rate, availability, bio, skills, portfolio entries, work history, GitHub activity, and a Vetting Badge if vetted.
4. Given a Client, when they complete onboarding, then their profile includes company logo, name, description, website link, and a public hiring history.
5. Given two connected users, when they exchange messages, then messages are delivered in real-time, attachments are stored and retrievable, unread counts are shown, and email notifications are sent for new messages when offline.
6. Given a completed project, when both parties submit ratings, then ratings are computed across the 4 criteria and published to public profiles with optional written reviews.

### Edge Cases
- Users who register via social providers but do not provide required role-specific fields must be prompted to complete onboarding before using role features.
- Attachment uploads that exceed allowed size or disallowed types must be rejected and provide user-friendly errors.
- 2FA setup failures (SMS/email delivery issues) must surface clear retry flows and fallbacks (e.g., backup codes).
- If a user deletes account, public ratings and non-PII reviews should remain associated to the profile placeholder unless legal removal is requested.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Authentication
  - Support email/password registration, secure password hashing (bcrypt/argon2), password reset via signed token email flow.
  - Support OAuth2 login via GitHub and Google; map provider email to existing accounts where appropriate.
  - Enforce mandatory 2FA (TOTP-based, e.g., authenticator apps). Provide backup codes and recovery flows.

- **FR-002**: Roles and Onboarding
  - Support two roles: `Client` and `Developer`. Each role has a guided onboarding flow (step-by-step forms and validation).
  - Onboarding must collect role-required fields and mark profile completion status.

- **FR-003**: Developer Profiles
  - Fields: profile picture, headline, hourly rate (currency), availability status (available/busy), detailed bio (markdown support), skills (array), portfolio (media + descriptions), work history (company, role, dates, description), GitHub integration (connect account, display repo activity), Vetting Badge (boolean + metadata about vetting date/approver).

- **FR-004**: Client Profiles
  - Fields: company logo, company name, brief business description, website link (validated), public hiring history (list of past hires/projects with dates and outcomes).

- **FR-005**: Messaging
  - Real-time messaging with presence and unread counts (WebSocket / Pusher / real-time layer).
  - Support file attachments (images, docs), server-side virus scanning or safe upload policies, attachment size/type limits.
  - Email notifications for new messages if recipient is offline or based on notification preferences.

- **FR-006**: Reputation & Reviews
  - Two-way rating system post-project with criteria: Quality, Communication, Expertise, Adherence to Deadlines (each numerical 1–5) and optional written review.
  - Aggregate scores and recent reviews are publicly displayed on profiles.
  - Allow flags/reporting for abusive or fraudulent reviews; include moderation workflow.

- **FR-007**: Privacy & Data
  - Personal identifiable information (PII) must be stored encrypted at rest where applicable.
  - Allow users to export their data and request deletion; handle ratings/reviews per policy.

- **FR-008**: Audit & Observability
  - Log security-critical events (logins, password resets, 2FA changes, social auth link/unlink) with structured logs.

### Key Entities *(include if feature involves data)*
- **User**: id, email, role (Client|Developer), display_name, primary_contact, created_at, last_login, 2fa_enabled
- **DeveloperProfile**: user_id, picture_url, headline, hourly_rate, currency, availability_status, bio, skills[], portfolio[], work_history[], github_connected (boolean), vetting_badge{granted_by, date}
- **ClientProfile**: user_id, company_logo_url, company_name, company_description, website_url, hiring_history[]
- **Message**: id, conversation_id, sender_id, recipient_id(s), body (text/markdown), attachments[], read_at, created_at
- **Attachment**: id, owner_id, file_url, content_type, size, virus_scan_status
- **Project**: id, client_id, developer_id(s), title, description, start_date, end_date, status
- **Rating**: id, project_id, rater_id, ratee_id, scores{quality,communication,expertise,deadlines}, comment, created_at

## Review & Acceptance Checklist

### Content Quality
- [ ] No implementation details that contradict the platform's security constraints
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] All [NEEDS CLARIFICATION] markers resolved
- [ ] Requirements are testable and unambiguous
- [ ] API contract list created for auth, profile, messaging, and ratings

## Execution Status
- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked (none outstanding in this draft)
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist pending

---

## Notes for implementers
- TDD order: Contract tests (auth, profile CRUD, messaging, rating CRUD) → minimal implementation → integration tests.
- Prefer standards for auth: OAuth2 for GitHub/Google, TOTP (RFC 6238) for 2FA, and secure password storage (Argon2 recommended).
- Real-time messaging can be implemented with a WebSocket server (e.g., SignalR, Socket.io) or third-party realtime services; design contracts first.

````
