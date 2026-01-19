import { Hono } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { AdminService } from '../services/admin';
import { WhitelabelDbService } from '../services/whitelabel';
import { AuthService } from '../services/auth';

const apiRoutes = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Admin API
apiRoutes.post('/admin/whitelabel/activate', async (c) => {
  const body = await c.req.parseBody();
  const activateAll = body['all'] === 'true';
  const specificModel = body['model'] as string;

  try {
    const result = await AdminService.activateModels(activateAll, specificModel);

    return c.html(
      <div id="toast" class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-xl animate-[fadeIn_0.5s]">
        ✅ Processado: {result.processedCount} modelos. (+{result.newModelsCount} novos, +{result.newPostsCount} posts)
      </div>
    );

  } catch (err: any) {
    console.error(err);
    return c.html(
      <div id="toast" class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded shadow-xl animate-[fadeIn_0.5s]">
        ❌ Erro ao ativar: {err.message}
      </div>
    );
  }
});


apiRoutes.get('/models', async (c) => {
  const pageParam = c.req.query('page');
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  const limit = 20;

  try {
    const result = await WhitelabelDbService.getTopModelsWithThumbnails(page, limit);

    return c.json({
      data: result,
      meta: { page, limit, count: result.length }
    });

  } catch (err: any) {
    console.error("Erro API Models:", err);
    return c.json({ error: 'Erro ao processar modelos.' }, 500);
  }
});

// 2. Atualize a rota de posts da modelo para assinar os arquivos
apiRoutes.get('/models/:modelName/posts', async (c) => {
  const modelName = c.req.param('modelName');
  const page = parseInt(c.req.query('page') || '1');
  const limit = 20;

  try {
    const model = await WhitelabelDbService.getModelBySlug(modelName);

    if (!model) return c.json({ error: '404' }, 404);

    const formattedPosts = await WhitelabelDbService.getModelPosts(model.id, page, limit);

    return c.json({ data: formattedPosts, meta: { page, limit, count: formattedPosts.length } });
  } catch (err) {
    console.error("Erro API Posts:", err);
    return c.json({ error: 'Erro ao carregar posts' }, 500);
  }
});

// Auth API
apiRoutes.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body['email'] as string;
  const password = body['password'] as string;

  try {
    const user = await AuthService.login(email, password);
    if (!user) {
        return c.redirect('/login?error=Credenciais inválidas');
    }

    await AuthService.checkSubscriptionStatus(user.id);

    const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role
    };

    const token = await sign(tokenPayload, JWT_SECRET);
    setCookie(c, 'auth_token', token, { 
        httpOnly: true, 
        path: '/', 
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
    });

    return c.redirect('/');
  } catch (err) {
    console.error("Login error:", err);
    return c.redirect('/login?error=Erro no servidor');
  }
});

apiRoutes.post('/register', async (c) => {
  const body = await c.req.parseBody();
  const email = body['email'] as string;
  const password = body['password'] as string;
  const name = body['name'] as string;
  
  try {
      const user = await AuthService.register(email, password, name);
      
      const tokenPayload = {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          role: user.role
      };

      const token = await sign(tokenPayload, JWT_SECRET);
      setCookie(c, 'auth_token', token, { 
          httpOnly: true, 
          path: '/', 
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production'
      });
      
      return c.redirect('/plans');
  } catch (err: any) {
      return c.redirect(`/register?error=${encodeURIComponent(err.message)}`);
  }
});

apiRoutes.post('/subscribe', async (c) => {
    const token = getCookie(c, 'auth_token');
    if (!token) return c.redirect('/login');

    try {
        const payload = await verify(token, JWT_SECRET);
        const body = await c.req.parseBody();
        const planId = parseInt(body['planId'] as string);

        if (!planId) return c.json({ error: 'Plan ID required' }, 400);

        await AuthService.createSubscription(payload.id as number, planId);
        
        return c.redirect('/admin');
    } catch (err) {
        console.error("Subscribe error:", err);
        return c.redirect('/login');
    }
});

apiRoutes.post('/logout', (c) => {
  setCookie(c, 'auth_token', '', { 
      httpOnly: true, 
      path: '/', 
      maxAge: 0,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
  });
  return c.redirect('/login');
});

export default apiRoutes;