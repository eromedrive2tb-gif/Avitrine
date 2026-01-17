import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import apiRoutes from './routes/api';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

// Mount Routes
app.route('/', publicRoutes);
app.route('/admin', adminRoutes);
app.route('/api', apiRoutes);

export default {
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 120, // Increase timeout to 120 seconds
};
