export default ({ env }) => ({
 
  'audit-logs': {
    enabled: env.bool('AUDIT_LOGS_ENABLED', true), // Use environment variable for control
    config: {
      // Configuration defined in the plugin's config/index.js
      enabled: true,
      excludeContentTypes: [
        // Example: Exclude Strapi's built-in models
        'plugin::users-permissions.user',
        'plugin::i18n.locale',
        'plugin::audit-log.audit-log',
      ],
    },
  },
});