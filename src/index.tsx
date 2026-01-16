import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { HomePage } from './pages/Home';
import { ModelsPage } from './pages/Models';
import { PlansPage } from './pages/Plans';
import { AuthPage } from './pages/Auth';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminModels } from './pages/admin/Models';
import { AdminAds } from './pages/admin/Ads';
import { AdminPlans, AdminSettings } from './pages/admin/Settings';

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// Public Routes
app.get('/', (c) => c.html(<HomePage />));
app.get('/models', (c) => c.html(<ModelsPage />));
app.get('/plans', (c) => c.html(<PlansPage />));
app.get('/login', (c) => c.html(<AuthPage type="login" />));
app.get('/register', (c) => c.html(<AuthPage type="register" />));

// Admin Routes (Using the new Admin Layout structure)
app.get('/admin', (c) => c.html(<AdminDashboard />));
app.get('/admin/models', (c) => c.html(<AdminModels />));
app.get('/admin/ads', (c) => c.html(<AdminAds />));
app.get('/admin/plans', (c) => c.html(<AdminPlans />));
app.get('/admin/settings', (c) => c.html(<AdminSettings />));

// API/Action Mock Routes
app.post('/api/login', async (c) => {
  const body = await c.req.parseBody();
  console.log('Login attempt:', body);
  return c.redirect('/admin'); // Redirect to admin for demo
});

app.post('/api/register', async (c) => {
    const body = await c.req.parseBody();
    console.log('Register attempt:', body);
    return c.redirect('/plans');
});

export default app;