# Audit Log Plugin - README

## Overview
- Adds automated audit logs for create/update/delete operations performed through Strapi Content API.
- Endpoint: GET /audit-logs
- Stores logs in collection audit_logs.

## Key features
- Captures contentType, recordId, action, timestamp, user (if available), payload and diff.
- Filtering: contentType, userId, action, date range.
- Pagination and sorting supported.

## Configuration
- config/plugins.js (see sample)
  - 'audit-log'.enabled (boolean) - enable or disable plugin
  - 'audit-log'.excludeContentTypes (array) - content types to exclude (recommended to include plugin::audit-log.audit-log to prevent recursion)
  - Also supported: top-level auditLog.* for environments.

## Permissions
- Endpoint requires authenticated user.
- Controller checks for read_audit_logs permission flag in user.role.permissions.
- To enable granular permission, we have added a permission entry named read_audit_logs in user permissions management (through manual console command).

## Usage
- Install files, then:
  - npm install
  - npm run build
  - then change directory to audit-logs-project/src/plugins/audit-logs
  - npm run build
  - npm run watch
  - in a separate terminal window, change directory to project root audit-logs-project
  - npm run build
  - npm run develop
 - Permissions setup instructions:
   - enter the following code in strapi console to setup canReadAuditLogs permission for authenticated user:
```      
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { name: 'Authenticated' } });
audit-logs-project > await strapi.db.query('plugin::users-permissions.permission').create({
   data: {
     action: 'plugin::audit-logs.read_audit_logs',
     role: role.id,
     enabled: true,
     policy: 'canReadAuditLogs',
   },
 });
```
- Call endpoint:
```
  GET /api/audit-logs?contentType=api::article.article&action=update&page=1&pageSize=20&sort=timestamp:desc
```

- Sample request (authenticated user with read_audit_logs permission):
```
  GET http://localhost:1337/api/audit-logs
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyMjI0OTgyLCJleHAiOjE3NjQ4MTY5ODJ9.t04Lu7QQHUK96qxPnrOBUqyO7oq9fQcvCIutJS9FP3I

```

  - Sample response:
```  
  [
   {
    "id": 1,
    "documentId": "zr2karlcpoti1frjtmf41176",
    "contentType": "api::article.article",
    "recordId": "1",
    "action": "create",
    "timestamp": "2025-11-03T04:05:44.807Z",
    "payload": {
      "new": {
        "id": 1,
        "documentId": "yvequ04ohk5tbfknkebty4e9",
        "title": "Testing1",
        "content": "#Overview\nThis is a test 1 article that should create an audit log.",
        "createdAt": "2025-11-03T04:05:44.796Z",
        "updatedAt": "2025-11-03T04:05:44.796Z",
        "publishedAt": null,
        "locale": null,
        "createdBy": {
          "id": 1,
          "documentId": "mr01z2vzyjjx820l5wekojws",
          "firstname": "J",
          "lastname": "K",
          "username": null,
          "email": "sample@email.com",
          "password": "$2a$10$RIKnY6X6UXr5UbpGh6Tk7e8rij5npJPNJa4zuM605EN7Libq9OkyK",
          "resetPasswordToken": null,
          "registrationToken": null,
          "isActive": true,
          "blocked": false,
          "preferedLanguage": null,
          "createdAt": "2025-10-31T11:07:20.126Z",
          "updatedAt": "2025-10-31T11:07:20.126Z",
          "publishedAt": "2025-10-31T11:07:20.126Z",
          "locale": null
        },
        "updatedBy": {
          "id": 1,
          "documentId": "mr01z2vzyjjx820l5wekojws",
          "firstname": "J",
          "lastname": "K",
          "username": null,
          "email": "sample@email.com",
          "password": "$2a$10$RIKnY6X6UXr5UbpGh6Tk7e8rij5npJPNJa4zuM605EN7Libq9OkyK",
          "resetPasswordToken": null,
          "registrationToken": null,
          "isActive": true,
          "blocked": false,
          "preferedLanguage": null,
          "createdAt": "2025-10-31T11:07:20.126Z",
          "updatedAt": "2025-10-31T11:07:20.126Z",
          "publishedAt": "2025-10-31T11:07:20.126Z",
          "locale": null
        },
        "localizations": []
      }
    },
    "createdAt": "2025-11-03T04:05:44.808Z",
    "updatedAt": "2025-11-03T04:05:44.808Z",
    "publishedAt": "2025-11-03T04:05:44.810Z",
    "locale": null,
    "user": null
  },  {
    "id": 2,
    "documentId": "zcmzc0q43idmkbwoq91hq9r0",
    "contentType": "api::article.article",
    "recordId": "1",
    "action": "update",
    "timestamp": "2025-11-03T04:06:42.551Z",
    "payload": {
      "changes": {
        "documentId": {
          "new": "yvequ04ohk5tbfknkebty4e9"
        },
        "title": {
          "new": "Testing1"
        },
        "content": {
          "new": "#Overview\nThis is a test 1 article that should create an audit log."
        },
        "publishedAt": {
          "new": null
        },
        "locale": {
          "new": null
        },
        "createdBy": {
          "new": {
            "id": 1,
            "documentId": "mr01z2vzyjjx820l5wekojws",
            "firstname": "J",
            "lastname": "K",
            "username": null,
            "email": "sample@email.com",
            "password": "$2a$10$RIKnY6X6UXr5UbpGh6Tk7e8rij5npJPNJa4zuM605EN7Libq9OkyK",
            "resetPasswordToken": null,
            "registrationToken": null,
            "isActive": true,
            "blocked": false,
            "preferedLanguage": null,
            "createdAt": "2025-10-31T11:07:20.126Z",
            "updatedAt": "2025-10-31T11:07:20.126Z",
            "publishedAt": "2025-10-31T11:07:20.126Z",
            "locale": null
          }
        },
        "updatedBy": {
          "new": {
            "id": 1,
            "documentId": "mr01z2vzyjjx820l5wekojws",
            "firstname": "J",
            "lastname": "K",
            "username": null,
            "email": "sample@email.com",
            "password": "$2a$10$RIKnY6X6UXr5UbpGh6Tk7e8rij5npJPNJa4zuM605EN7Libq9OkyK",
            "resetPasswordToken": null,
            "registrationToken": null,
            "isActive": true,
            "blocked": false,
            "preferedLanguage": null,
            "createdAt": "2025-10-31T11:07:20.126Z",
            "updatedAt": "2025-10-31T11:07:20.126Z",
            "publishedAt": "2025-10-31T11:07:20.126Z",
            "locale": null
          }
        },
        "localizations": {
          "new": []
        }
      }
    },
    "createdAt": "2025-11-03T04:06:42.551Z",
    "updatedAt": "2025-11-03T04:06:42.551Z",
    "publishedAt": "2025-11-03T04:06:42.552Z",
    "locale": null,
    "user": null
  },{
    "id": 7,
    "documentId": "k5c1iipng1nfycmh8syvds6n",
    "contentType": "api::article.article",
    "recordId": "3",
    "action": "delete",
    "timestamp": "2025-11-03T04:30:11.059Z",
    "payload": {
      "deleted": {
        "id": 3,
        "documentId": "g38o0yi17o5s47syxaz6bjnr",
        "title": "Test2",
        "content": "#Overview\n\nWe will use this article to test delete audit logs.",
        "createdAt": "2025-11-03T04:28:32.052Z",
        "updatedAt": "2025-11-03T04:28:34.029Z",
        "publishedAt": null,
        "locale": null
      }
    },
    "createdAt": "2025-11-03T04:30:11.059Z",
    "updatedAt": "2025-11-03T04:30:11.059Z",
    "publishedAt": "2025-11-03T04:30:11.061Z",
    "locale": null,
    "user": null
  }
 ]
```

## Extending / Next steps
- Add Admin UI pages and register a permission via admin services so admins can assign the read_audit_logs permission in the UI.
- Improve user resolution and provide links to the changed entity in the admin UI.