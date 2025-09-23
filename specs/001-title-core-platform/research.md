````markdown
# Research: Core platform and user management system

## Decisions

- Backend: Supabase chosen for auth, Postgres, realtime, storage, and edge functions. Rationale: integrated suite reduces operational overhead and provides realtime subscriptions, storage buckets, and Edge Functions for server-side logic.

- 2FA: TOTP (RFC 6238) via Supabase MFA where possible. Provide backup codes as recovery. Rationale: avoids SMS cost and security issues; aligns with best practices.

- Messaging: Use Supabase Realtime on `messages` table with optimistic UI via TanStack Query and WebSocket subscriptions in the frontend. Consider a message delivery acknowledgement and presence channel.

- Storage: Use Supabase Storage buckets `avatars` and `project-files` with signed URLs and policies. Virus scanning should be handled by an Edge Function (e.g., send file to scanning service on upload webhook).

## Alternatives considered

- Use a separate WebSocket/Queue platform (Pusher/Ably) for messaging: rejected due to complexity and additional cost; Supabase Realtime sufficient for MVP.

- SMS-based 2FA: rejected for now due to cost and SMS delivery constraints; keep as later extension.

## Open questions / risks

- Vetting process: who performs vetting and what criteria? Needs operational decision for the Vetting Badge workflow.
- Review moderation: automated detection vs. manual moderation — start with manual flags and admin queue.

````
