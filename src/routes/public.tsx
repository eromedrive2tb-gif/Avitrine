import { Hono } from 'hono';
import { HomePage } from '../pages/Home';
import { ModelsPage } from '../pages/Models';
import { PlansPage } from '../pages/Plans';
import { AuthPage } from '../pages/Auth';

const publicRoutes = new Hono();

publicRoutes.get('/', (c) => c.html(<HomePage />));
publicRoutes.get('/models', (c) => c.html(<ModelsPage />));
publicRoutes.get('/plans', (c) => c.html(<PlansPage />));
publicRoutes.get('/login', (c) => c.html(<AuthPage type="login" />));
publicRoutes.get('/register', (c) => c.html(<AuthPage type="register" />));

export default publicRoutes;
