import type { Core } from '@strapi/strapi';
import type { Query } from '@strapi/utils/dist/convert-query-params';


// 1. Define the types for the data types
export interface AuditLogPayload {
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
  async find(query: Query) {
    console.log('[AUDIT-LOGS] Service incoming find query:', query);
    query.populate = {
      user: {
        select: ['id', 'username', 'email'],
      },
    };
    console.log('[AUDIT-LOGS] Service Final built query:', query);
    const logs = await strapi.db.query('plugin::audit-logs.audit-log').findMany(query);
    return logs;
  },
});

export default auditLogService;

