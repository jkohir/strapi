import type { Core } from '@strapi/strapi';
import type { Schema } from '@strapi/strapi';

// ExtendedStrapi interface for access to the container
interface ExtendedStrapi extends Core.Strapi {
  container: {
    get: (key: string) => any;
  };
}

// User type
type User = Schema.ContentType<'plugin::users-permissions.user'> & {
  id: number;
};

/**
 * Calculates the difference between the previous record state and the new record state.
 * @param {object} previous - The state of the record before the update (event.state.previous).
 * @param {object} current - The state of the record after the update (event.result).
 * @returns {object} An object showing only the keys that changed, with their old and new values.
 */
const computeDiff = (previous: any, current: any): Record<string, { old: any; new: any }> => {
  const diff: Record<string, { old: any; new: any }> = {};
  
  const allKeys = new Set([...Object.keys(previous || {}), ...Object.keys(current || {})]);

  for (const key of allKeys) {
    const oldValue = previous ? previous[key] : undefined;
    const newValue = current ? current[key] : undefined;

    // Use JSON.stringify for a simple comparison of objects/arrays
    const isValueChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

    if (isValueChanged) {
      if (!['id', 'createdAt', 'updatedAt'].includes(key)) {
        diff[key] = { old: oldValue, new: newValue };
      }
    }
  }
  return diff;
};

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  console.log('[AUDIT-LOGS] Bootstrap executed');

  const contentTypes = strapi.contentTypes;

  // Iterate over all API content types to register the hooks
  for (const uid in contentTypes) {
    if (uid.startsWith('api::')) {
      strapi.db.lifecycles.subscribe({
        models: [uid],

        // --- afterCreate Hook ---
        async afterCreate(event) {
          const eventStateAuth = (event.state.auth as { credentials: { user: User } });
          const user = event.state.user || eventStateAuth?.credentials?.user;

          await strapi.plugin('audit-logs').service('auditLogService').createLog({
            contentType: uid,
            action: 'create',
            recordId: event.result.id,
            payload: { new: event.result },
            user,
          });
        },

        // --- afterUpdate Hook ---
        async afterUpdate(event) {
          const eventStateAuth = (event.state.auth as { credentials: { user: User } });
          const user = event.state.user || eventStateAuth?.credentials?.user;
          const changes = computeDiff(event.state.previous, event.result);

          if (Object.keys(changes).length > 0) {
            await strapi.plugin('audit-logs').service('auditLogService').createLog({
              contentType: uid,
              action: 'update',
              recordId: event.result.id,
              payload: { changes },
              user,
            });
          }
        },

        // --- afterDelete Hook ---
        async afterDelete(event) {
          const eventStateAuth = (event.state.auth as { credentials: { user: User } });
          const user = event.state.user || eventStateAuth?.credentials?.user;

          await strapi.plugin('audit-logs').service('auditLogService').createLog({
            contentType: uid,
            action: 'delete',
            recordId: event.result.id,
            payload: { deleted: event.result },
            user,
          });
        },
      });
    }
  }
};

export default bootstrap;


