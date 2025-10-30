'use strict';

module.exports = ({ strapi }) => {
  strapi.container.get('plugin::users-permissions.permissions').actions.register(
    // The action ID used in the database and policy checks
    'plugin::audit-logs.read_audit_logs',
    {
      displayName: 'Read Audit Logs',
      actionId: 'read_audit_logs', // Simplified name for visibility
      plugin: 'audit-logs',
    }
  );
};