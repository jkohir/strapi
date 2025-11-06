import type { Core } from '@strapi/strapi';
import { Context } from 'koa';
import { queryParams } from '@strapi/utils';

const transformer = queryParams.createTransformer({
  getModel: (uid) => strapi.getModel(uid as any),
});

// Use the standard factory pattern for controllers
const auditLogController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    console.log('[AUDIT-LOGS] Controller hit, query object:', ctx.query);

    const query = transformer.transformQueryParams(
      'plugin::audit-logs.audit-log',
      ctx.query
    );

    //Apply defaults
    query.page = query.page ?? 1;
    query.pageSize = query.pageSize ?? 20;
    if (!Array.isArray(query.orderBy) || query.orderBy.length === 0) {
      query.orderBy = [{ timestamp: 'desc' }];
    }

    // Optional: ensure we don’t override filters accidentally
    query.where = query.where ?? {};

    console.log('[AUDIT-LOGS] Final params sent to service:', query);

    // --- Call Service ---
    const logs = await strapi.service('plugin::audit-logs.auditLogService').find(query);

    // Manual transformation/response structure (if not using core controller factory)
    // If you were using createCoreController, you'd use this.transformResponse(logs)
    ctx.body = logs;
  },
});

export default auditLogController;