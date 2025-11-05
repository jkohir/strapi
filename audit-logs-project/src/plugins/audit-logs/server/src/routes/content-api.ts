const contentAPIRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: 'auditLog.find', // Reference the controller/function
    config: {
      auth: {}, // Uses the default 'users-permissions' authentication
      policies: [
        // Reference the policy file name without the extension
        'plugin::audit-logs.canReadAuditLogs' 
      ],
    },
  },
];

export default contentAPIRoutes;
