# DESIGN SUMMARY - Audit Logging for Strapi

## Goal
- Capture create/update/delete events for all content types handled by Strapi's Content API.
- Store entries in a new collection audit_logs with efficient indexing.
- Provide a REST endpoint for querying logs with filters, pagination and sorting.
- Enforce access control via a read_audit_logs permission check.
- Allow runtime configuration to enable/disable logging and exclude content types.

## Architecture
- Plugin-based implementation located at src/plugins/audit-log.
- Uses Strapi lifecycle subscription API (strapi.db.lifecycles.subscribe) to observe afterCreate, afterUpdate and afterDelete across models.
- A lightweight service (server/services/audit.js) writes structured log entries into plugin::audit-log.audit-log via strapi.entityService.create.
- The audit-log model defines fields: contentType, recordId, action, timestamp, user (json), payload (json), diff (json). Indexes are configured for common queries.
- A REST route GET /audit-logs is provided by the plugin. Controller supports filters (contentType, userId, action, startDate, endDate), pagination and sorting.
- RBAC: the controller checks ctx.state.user and expects a permission flag read_audit_logs on the user's role permissions (fallback: admin users allowed).

## Tradeoffs
We used a plugin instead of middleware because plugin provides the architecture (persistence, API, configuration), and the hooks provide the interception points to trigger the logging logic. You cannot build this feature without a Plugin using just middleware which are generally best for narrowly-scoped, common tasks that involve inspecting or modifying the data flow of an API request.