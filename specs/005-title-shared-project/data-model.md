````markdown
# Data Model: Shared project workspace - WorkDev

## Entities

### ProjectWorkspace
- projectWorkspaceId: UUID
- projectId: UUID
- clientId: UUID
- developerId: UUID | null
- workspaceStatus: enum (Active|Archived|Locked)
- createdAt: timestamp
- updatedAt: timestamp

### Milestone
- milestoneId: UUID
- projectWorkspaceId: UUID
- title: string
- description: text
- dueDate: date
- amount: decimal | null
- state: enum (Draft|Submitted|RevisionRequested|Approved|Rejected|Archived)
- attachments: array[fileId]
- createdBy: UUID
- createdAt: timestamp
- updatedAt: timestamp
- version: integer (for optimistic locking)
- history: array[stateTransition]

### Message
- messageId: UUID
- projectWorkspaceId: UUID
- senderId: UUID
- recipientIds: array[UUID]
- body: text
- attachments: array[fileId]
- createdAt: timestamp
- readAt: timestamp | null

### File
- fileId: UUID
- projectWorkspaceId: UUID
- uploaderId: UUID
- filename: string
- size: integer
- mimeType: string
- storagePath: string
- version: integer
- uploadedAt: timestamp

## Relationships
- ProjectWorkspace 1..1 → Project
- ProjectWorkspace 1..* → Milestones
- ProjectWorkspace 1..* → Messages
- Milestone 0..* → File (attachments)

## State transitions (Milestone)
- Draft → Submitted (actor: developer or client)
- Submitted → Approved (actor: client)
- Submitted → RevisionRequested (actor: client)
- RevisionRequested → Submitted (actor: developer)
- Any → Archived (actor: client)

## Constraints and validation
- title: required, max 200 chars
- dueDate: optional but recommended; if present must be >= createdAt
- attachments: max per milestone 20 files
- file size limit: 50MB per file (subject to research decision)

````
