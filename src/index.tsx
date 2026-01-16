import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { HomePage } from './pages/Home';
import { ModelsPage } from './pages/Models';
import { PlansPage } from './pages/Plans';
import { AuthPage } from './pages/Auth';
import { AdminDashboard } from './pages/Admin';

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// Public Routes
app.get('/', (c) => c.html(<HomePage />));
app.get('/models', (c) => c.html(<ModelsPage />));
app.get('/plans', (c) => c.html(<PlansPage />));

app.get('/login', (c) => c.html(<AuthPage type="login" />));
app.get('/register', (c) => c.html(<AuthPage type="register" />));

// Admin Routes (Protected - simplistic check for demo)
app.get('/admin', (c) => c.html(<AdminDashboard />));
app.get('/admin/*', (c) => c.html(<AdminDashboard />));

// API/Action Mock Routes
app.post('/api/login', async (c) => {
  const body = await c.req.parseBody();
  // In real app: validate user via DB
  console.log('Login attempt:', body);
  return c.redirect('/admin');
});

app.post('/api/register', async (c) => {
    const body = await c.req.parseBody();
    console.log('Register attempt:', body);
    return c.redirect('/plans');
});

export default app;