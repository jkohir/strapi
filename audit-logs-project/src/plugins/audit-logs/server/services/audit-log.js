'use strict';

module.exports = ({ strapi }) => ({
  /**
   * Creates an audit log entry.
   */
  async createLog({ contentType, action, recordId, payload, user }) {
    // 1. Check if logging is globally enabled
    const config = strapi.config.get('plugin.audit-logs');
    if (!config || config.enabled === false) {
      return;
    }

    // 2. Check if the content type is excluded
    if (config.excludeContentTypes && config.excludeContentTypes.includes(contentType)) {
      return;
    }

    try {
      await strapi.query('plugin::audit-logs.audit-log').create({
        data: {
          contentType,
          recordId: String(recordId),
          action,
          payload,
          timestamp: new Date().toISOString(),
          // Use user ID if authenticated
          user: user ? user.id : null,
        },
      });
    } catch (error) {
      strapi.log.error(`Audit Log failed to save: ${error.message}`);
    }
  },
});