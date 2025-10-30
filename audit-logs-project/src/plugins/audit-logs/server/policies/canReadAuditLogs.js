'use strict';

/**
 * Checks if the authenticated user is an Administrator OR has the 'read_audit_logs' permission.
 */
module.exports = async (ctx, next) => {
  const user = ctx.state.user;
  
  // 1. Authentication Check
  if (!user) {
    return ctx.unauthorized('Authentication required.');
  }

  // --- 2. Admin Role Check ---
  // If the user belongs to the Admin Panel (strapi-admin) users, check if they are an administrator.
  // The user role object typically contains properties like 'code' or 'name' that identify the type.
  const isAdmin = user.roles && user.roles.some(role => role.code === 'strapi-super-admin' || role.name === 'Administrator');
  
  if (isAdmin) {
    await next();
    return;
  }
  
  // --- 3. Permission Check (for Users & Permissions Plugin users) ---
  // Check if the user has the required permission ID for the Content API.
  const hasPermission = await strapi.entityService.hasPermission({
      action: 'plugin::audit-logs.read_audit_logs', 
      user,
      model: 'plugin::audit-logs.audit-log',
  });
  
  if (hasPermission) {
    await next();
    return;
  }

  // 4. Default: Forbidden
  return ctx.forbidden('You are not authorized to read audit logs. Requires Admin status or specific permission.');
};