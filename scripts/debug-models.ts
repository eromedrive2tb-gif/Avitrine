import { db } from '../src/db';
import { models, posts, whitelabelModels } from '../src/db/schema';
import { eq, like } from 'drizzle-orm';

async function debugModels() {
  console.log('=== MODELOS ADMINISTRATIVOS ===');
  const adminModels = await db.select().from(models).where(like(models.name, '%modelo%'));
  console.log('Modelos administrativos encontrados:');
  adminModels.forEach(m => {
    console.log(`- ID: ${m.id}, Nome: ${m.name}, Slug: ${m.slug}, PostCount: ${m.postCount}`);
  });

  console.log('\n=== MODELOS WHITELABEL ===');
  const wlModels = await db.select().from(whitelabelModels).where(like(whitelabelModels.folderName, '%modelo%'));
  console.log('Modelos whitelabel encontrados:');
  wlModels.forEach(m => {
    console.log(`- ID: ${m.id}, Folder: ${m.folderName}, PostCount: ${m.postCount}`);
  });

  console.log('\n=== POSTS ADMINISTRATIVOS ===');
  const adminPosts = await db.select().from(posts);
  console.log('Todos os posts administrativos:');
  adminPosts.forEach(p => {
    console.log(`- ID: ${p.id}, ModelID: ${p.modelId}, Title: ${p.title}, Type: ${p.type}`);
  });

  // Verificar posts específicos da modelo-teste
  const modeloTeste = adminModels.find(m => m.name === 'modelo-teste' || m.slug === 'modelo-teste');
  if (modeloTeste) {
    console.log(`\n=== POSTS DA MODELO-TESTE (ID: ${modeloTeste.id}) ===`);
    const modeloPosts = await db.select().from(posts).where(eq(posts.modelId, modeloTeste.id));
    modeloPosts.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, Content: ${p.contentUrl}`);
    });
  }
}

debugModels().catch(console.error);