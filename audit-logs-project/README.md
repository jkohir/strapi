# Audit Log Plugin - README

## Overview
- Adds automated audit logs for create/update/delete operations performed through Strapi Content API.
- Endpoint: GET /audit-logs
- Stores logs in collection audit_logs.

Key features
- Captures contentType, recordId, action, timestamp, user, payload and diff.
- Supports indexes on contentType, action, user and timestamp for efficient querying.
- Filtering: contentType, userId, action, date range.
- Pagination and sorting supported.

Configuration
- config/plugins.js (see sample)
  - 'audit-log'.enabled (boolean) - enable or disable plugin
  - 'audit-log'.excludeContentTypes (array) - content types to exclude (recommended to include plugin::audit-log.audit-log to prevent recursion)
  - Also supported: top-level auditLog.* for environments.

Permissions
- Endpoint requires authenticated user.
- A policy file checks for read_audit_logs permission flag in user.role.permissions OR admin role.
- To enable granular permission, add a permission entry named read_audit_logs to your role management (manual DB or extend admin UI).

Usage
- Install files, then:
  - npm install
  - npm run build
  - npm run develop
- Call endpoint:
  GET /api/audit-logs?contentType=api::article.article&action=update&page=1&pageSize=20&sort=timestamp:desc

Extending / Next steps
- Add unit tests to ensure appropriate code coverage
- Improve user resolution and provide links to the changed entity in the admin UI.

# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
