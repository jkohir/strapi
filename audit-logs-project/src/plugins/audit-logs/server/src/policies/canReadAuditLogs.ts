import type { Core } from '@strapi/strapi';
import { Context } from 'koa';
import { errors } from '@strapi/utils';

const { UnauthorizedError, PolicyError } = errors;
/**
 * Checks if the authenticated user has the 'read_audit_logs' permission.
 */
export default async (policyContext, config, { strapi }) => {
  console.log('[AUDIT-LOGS] canReadAuditLogs policy triggered');
  
  const user = policyContext.state.user;
  if (!user) {
    console.log('[AUDIT-LOGS] Unauthorized access attempt to audit logs');
    throw new UnauthorizedError(
      "You are not authorized to access this resource.",
      {
        policy: "authentication-check",
        customCode: 'USER_NOT_AUTHENTICATED'
      }
    );
  }

  const userWithRole = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: user.id },
    populate: ['role', 'role.permissions'],
  });

  // console.log('[AUDIT-LOGS] User role loaded:', {
  //   roleName: userWithRole?.role?.name,
  //   permissions: userWithRole?.role?.permissions?.map((p: any) => p.action),
  // });
  
  const permissions = userWithRole?.role?.permissions?.map(p => p.action) || [];
  if (permissions.includes('plugin::audit-logs.read_audit_logs')) {
    return true;
  }

  console.error('[AUDIT-LOGS] You are not authorized to read audit logs. Requires specific permission.');

  throw new PolicyError(
    'You are not authorized to read audit logs. Requires specific permission.',
    {
      policy: "canReadAuditLogs",
      status: 403,
      customCode: 'INSUFFICIENT_PERMISSIONS',
    },
  );
};
