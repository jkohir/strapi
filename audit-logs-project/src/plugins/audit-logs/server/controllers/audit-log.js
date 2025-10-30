'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::audit-logs.audit-log', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    // --- 1. Set Default Pagination and Sorting ---
    const defaultQuery = {
      // Set defaults using Strapi's query parameter syntax for v4
      pagination: {
        page: query.pagination?.page || 1, // 'page' starts at 1
        pageSize: query.pagination?.pageSize || 5,
      },
      
      sort: query.sort || 'timestamp:desc', 
    };
    
    // --- 2. Build Filters ---
    const filters = {};
    if (query.filters) {
      if (query.filters.contentType) {
        filters.contentType = query.filters.contentType;
      }
      if (query.filters.userId) {
        filters.user = query.filters.userId;
      }
      if (query.filters.action) {
        filters.action = query.filters.action;
      }
      // Date Range Filter
      if (query.filters.fromDate || query.filters.toDate) {
        filters.timestamp = {}; // Use 'timestamp' field
        if (query.filters.fromDate) {
          filters.timestamp.$gte = new Date(query.filters.fromDate);
        }
        if (query.filters.toDate) {
          filters.timestamp.$lte = new Date(query.filters.toDate);
        }
      }
    }

    // --- 3. Execute Query ---
    const logs = await strapi.service('plugin::audit-logs.audit-log').find(
      {
        ...query, // Include any other complex query parameters
        ...defaultQuery, // Apply defaults/user overrides for pagination/sort
        filters, // Apply derived filters
      }
    );

    // Use Strapi's default response format
    const sanitizedLogs = await this.sanitizeOutput(logs, ctx);

    return this.transformResponse(sanitizedLogs);
  },
}));