import type { Core } from '@strapi/strapi';
import { Context } from 'koa';

// Define a simple interface for the query structure we expect
interface AuditQuery {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: string;
  _limit?: number;
  _start?: number;
  limit?: number;
  start?: number;
  filters?: {
    contentType?: string;
    userId?: number;
    action?: 'create' | 'update' | 'delete';
    fromDate?: string;
    toDate?: string;
    [key: string]: any; // Allow other filter properties
  };
  [key: string]: any; // Allow other top-level query properties
}

// Use the standard factory pattern for controllers
const auditLogController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: Context) {
    console.log('[AUDIT-LOGS] Controller hit');

    const { query } = ctx as AuditQuery;

    // --- 1. Set Default Pagination and Sorting ---
    const defaultQuery = {
      pagination: {
        page: query.pagination?.page || 1, 
        pageSize: query.pagination?.pageSize || 5,
      },
      sort: query.sort || 'timestamp:desc', 
    };
    
    // --- 2. Build Filters (from query.filters) ---
    const filters: any = {};
    if (query.filters) {
      if (query.filters.contentType) {
        filters.contentType = query.filters.contentType;
      }
      if (query.filters.action) {
        filters.action = query.filters.action;
      }
      // Add date range filter logic
      if (query.filters.fromDate || query.filters.toDate) {
        filters.timestamp = {}; 
        if (query.filters.fromDate) {
          filters.timestamp.$gte = new Date(query.filters.fromDate as string);
        }
        if (query.filters.toDate) {
          filters.timestamp.$lte = new Date(query.filters.toDate as string);
        }
      }
    }

    // --- 3. Execute Query ---
    const logs = await strapi.service('plugin::audit-logs.auditLogService').find(
      {
        ...query,
        ...defaultQuery,
        filters,
      }
    );

    // Manual transformation/response structure (if not using core controller factory)
    // If you were using createCoreController, you'd use this.transformResponse(logs)
    ctx.body = logs;
  },
});

export default auditLogController;