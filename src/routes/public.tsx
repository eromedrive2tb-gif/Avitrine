import { Hono } from 'hono';
import { HomePage } from '../pages/Home';
import { ModelsPage } from '../pages/Models';
import { PlansPage } from '../pages/Plans';
import { AuthPage } from '../pages/Auth';
import { ModelProfilePage } from '../pages/ModelProfile';
import { PostDetailPage } from '../pages/PostDetail';
import { WhitelabelDbService } from '../services/whitelabel';

const publicRoutes = new Hono();

// ROTA HOME
publicRoutes.get('/', async (c) => {
  try {
    const signedModels = await WhitelabelDbService.getTopModelsWithThumbnails(1, 20);
    return c.html(<HomePage models={signedModels} />);
  } catch (e) {
    console.error("Erro na Home:", e);
    return c.html(<HomePage models={[]} />);
  }
});

publicRoutes.get('/models/:slug', async (c) => {
  const slug = c.req.param('slug');

  const model = await WhitelabelDbService.getModelBySlug(slug);

  if (!model) return c.notFound();

  // Busca os primeiros 20 posts com thumbnails assinadas
  const formattedPosts = await WhitelabelDbService.getModelPosts(model.id, 1, 20);

  return c.html(<ModelProfilePage model={model} initialPosts={formattedPosts} />);
});

// Outras rotas...
publicRoutes.get('/models', (c) => c.html(<ModelsPage />));
publicRoutes.get('/posts/:id', (c) => {
  const id = c.req.param('id');
  return c.html(<PostDetailPage id={id} />);
});
publicRoutes.get('/plans', (c) => c.html(<PlansPage />));
publicRoutes.get('/login', (c) => c.html(<AuthPage type="login" />));
publicRoutes.get('/register', (c) => c.html(<AuthPage type="register" />));

export default publicRoutes;
