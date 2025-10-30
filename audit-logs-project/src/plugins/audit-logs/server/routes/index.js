module.exports = [
  {
    method: 'GET',
    path: '/audit-logs',
    handler: 'auditLog.find', 
    config: {
      policies: [
        // Reference the policy file name without the extension
        'plugin::audit-logs.canReadAuditLogs' 
      ],
    },
  },
];