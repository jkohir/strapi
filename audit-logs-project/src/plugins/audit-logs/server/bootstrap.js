// src/plugins/audit-logs/server/bootstrap.js
'use strict';

/**
 * Calculates the difference between the previous record state and the new record state.
 * @param {object} previous - The state of the record before the update (event.state.previous).
 * @param {object} current - The state of the record after the update (event.result).
 * @returns {object} An object showing only the keys that changed, with their old and new values.
 */
const computeDiff = (previous, current) => {
  const diff = {};
  
  // Get all keys present in either the previous or current state
  const allKeys = new Set([...Object.keys(previous || {}), ...Object.keys(current || {})]);

  for (const key of allKeys) {
    const oldValue = previous ? previous[key] : undefined;
    const newValue = current ? current[key] : undefined;

    // We need a robust comparison, especially for JSON/objects and deep structures.
    // For simplicity here, we stringify and compare to detect changes in objects/arrays.
    const isValueChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

    if (isValueChanged) {
      // Exclude standard Strapi metadata fields from the diff payload
      if (!['id', 'createdAt', 'updatedAt'].includes(key)) {
        diff[key] = { old: oldValue, new: newValue };
      }
    }
  }
  return diff;
};

module.exports = ({ strapi }) => {
  const contentTypes = strapi.contentTypes;

  // Iterate over all API content types to register the hooks
  for (const uid in contentTypes) {
    // Only register hooks for user-defined content types (not Strapi internals)
    if (uid.startsWith('api::')) {
      strapi.db.lifecycles.subscribe({
        model: uid,

        // Intercept 'create' operation
        async afterCreate(event) {
          // Get the user from the request context (or null if unauthenticated)
          const user = event.state.user || event.state.auth?.credentials?.user;

          await strapi.plugin('audit-logs').service('auditLog').createLog({
            contentType: uid,
            action: 'create',
            recordId: event.result.id,
            payload: { new: event.result }, // Full new record
            user,
          });
        },

        // Intercept 'update' operation
        async afterUpdate(event) {
          const user = event.state.user || event.state.auth?.credentials?.user;
          
          // 1. Compute the difference using previous and result states
          const changes = computeDiff(event.state.previous, event.result);

          // 2. Only log if actual fields have changed
          if (Object.keys(changes).length > 0) {
            await strapi.plugin('audit-logs').service('auditLog').createLog({
              contentType: uid,
              action: 'update',
              recordId: event.result.id,
              payload: { changes },
              user,
            });
          }
        },

        // Intercept 'delete' operation
        async afterDelete(event) {
          const user = event.state.user || event.state.auth?.credentials?.user;

          await strapi.plugin('audit-logs').service('auditLog').createLog({
            contentType: uid,
            action: 'delete',
            recordId: event.result.id,
            payload: { deleted: event.result }, // The record that was deleted
            user,
          });
        },
      });
    }
  }
};