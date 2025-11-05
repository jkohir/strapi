# DESIGN SUMMARY - Audit Logging for Strapi

## Context
Strapi lacks built-in audit logging for content changes.  
This plugin provides a traceable history of CRUD operations for compliance, debugging, and administrative insight.

## Goal
- Capture create/update/delete events for all content types handled by Strapi's Content API.
- Store entries in a new collection audit_logs with efficient indexing.
- Provide a REST endpoint for querying logs with filters, pagination and sorting.
- Enforce access control via a read_audit_logs permission check.
- Allow runtime configuration to enable/disable logging and exclude content types.

## Architecture
- Plugin-based implementation located at src/plugins/audit-log.
- Uses Strapi lifecycle subscription API (`strapi.db.lifecycles.subscribe`) to observe `afterCreate`, `afterUpdate`, and `afterDelete` across models.
- A lightweight service (`server/src/services/audit-log.js`) writes structured log entries into `plugin::audit-log.audit-log` via `strapi.query().create()`.
- The audit-log model defines fields: contentType, recordId, action, timestamp, user (json), payload (json), diff (json). Indexes are configured for common queries.
- A REST route `GET /audit-logs` is provided by the plugin. Controller supports filters (contentType, userId, action, startDate, endDate), pagination and sorting.
- RBAC: the controller checks `ctx.state.user` and expects a permission flag `read_audit_logs` on the user's role permissions.

## Security & Access Control
- Endpoint protected via users-permissions plugin authentication.
- Policy `canReadAuditLogs` enforces RBAC.
- Only users with `plugin::audit-logs.read_audit_logs` can access logs.

## Performance
- Diffs computed via JSON.stringify comparison.
- Skips system fields (`id`, `createdAt`, `updatedAt`).
- Future support can be planned for archival / cleanup of old records.

## Example Flow
1. Authenticated user updates an Article.
2. `afterUpdate` hook fires.
3. Diff computed and stored.
4. `auditLogService.createLog()` writes to DB.
5. Accessible via `GET /api/audit-logs`.

## Tradeoffs
- Plugin instead of middleware for deeper integration and data persistence.
- Manual permission registration avoids race condition but adds setup overhead.
- Lifecycle hooks provide consistent change tracking but add minimal runtime overhead.

## Future Enhancements
- Admin UI page for audit log browsing.
- Configurable retention policies.
- Enhanced filtering and search.
- Support for custom actions (publish/unpublish).
