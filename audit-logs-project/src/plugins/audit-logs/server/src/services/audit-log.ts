import type { Core } from '@strapi/strapi';
import type { Params } from '@strapi/database/dist/entity-manager/types';

// 1. Define the types for the data types
export type AuditLogPayload = {
  contentType: string;
  action: 'create' | 'update' | 'delete';
  recordId: number;
  payload: Record<string, any>;
  user?: any; // User object from state/auth
}

const auditLogService = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Creates a new audit log entry in the database.
   */
  async createLog(data: AuditLogPayload) {
    // 1. Check if logging is globally enabled
    const config = strapi.config.get('plugin.audit-logs') as any;
    if (!config || config.enabled === false) {
      return;
    }

    // 2. Check if the content type is excluded
    if (config.excludeContentTypes && config.excludeContentTypes.includes(data.contentType)) {
      return;
    }

    const { contentType, action, recordId, payload, user } = data;
    
    // Construct the data payload for the database
    const entryData = {
      contentType,
      action,
      recordId,
      payload,
      timestamp: new Date().toISOString(),
      // Link the log to the user who performed the action, if available
      user: user ? user.id : null,
    };

    // NOTE: The UID for a plugin's content type is always 'plugin::plugin-name.content-type-name'
    try {
      await strapi.query('plugin::audit-logs.audit-log').create({
        data: entryData,
      });
    } catch (error) {
      strapi.log.error(`Audit Log failed to save: ${error.message}`, error);
    }
  },

  /**
   * Fetches a list of audit logs, applying filtering, sorting, and pagination.
   */
  async find(params: Params) {
    // The entityService can directly consume the cleaned-up query parameters

    const logs = await strapi.query('plugin::audit-logs.audit-log').findMany({
      filters: params.filters,
      orderBy: params.orderBy,
      page: params.page,
      pageSize: params.pageSize,
      // Populate the user field for display
      populate: { user: true }, 
    });

    return logs;
  },
});

export default auditLogService;

