import { Hono } from 'hono';
import { HomePage } from '../pages/Home';
import { ModelsPage } from '../pages/Models';
import { PlansPage } from '../pages/Plans';
import { AuthPage } from '../pages/Auth';
import { ModelProfilePage } from '../pages/ModelProfile';
import { PostDetailPage } from '../pages/PostDetail';

const publicRoutes = new Hono();

publicRoutes.get('/', (c) => c.html(<HomePage />));
publicRoutes.get('/models', (c) => c.html(<ModelsPage />));
publicRoutes.get('/models/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(<ModelProfilePage slug={slug} />);
});
publicRoutes.get('/posts/:id', (c) => {
  const id = c.req.param('id');
  return c.html(<PostDetailPage id={id} />);
});
publicRoutes.get('/plans', (c) => c.html(<PlansPage />));
publicRoutes.get('/login', (c) => c.html(<AuthPage type="login" />));
publicRoutes.get('/register', (c) => c.html(<AuthPage type="register" />));

export default publicRoutes;
