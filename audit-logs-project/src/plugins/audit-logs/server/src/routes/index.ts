import contentAPIRoutes from './content-api';

console.log('[AUDIT-LOGS PLUGIN] Registering routes...');

const routes = {
  'content-api': {
    type: 'content-api',
    routes: [...contentAPIRoutes],
  },
};

export default routes;
