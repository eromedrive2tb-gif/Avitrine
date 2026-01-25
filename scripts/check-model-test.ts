import { db } from '../src/db';
import { models, posts } from '../src/db/schema';
import { eq, like } from 'drizzle-orm';

async function checkModelTestData() {
  console.log('=== VERIFICANDO MODELO-TESTE ===');
  
  // Procurar modelos com nome ou slug "modelo-teste"
  const testModels = await db.select().from(models).where(
    like(models.name, '%modelo-teste%')
  );
  
  console.log('Modelos encontrados com "modelo-teste" no nome:');
  testModels.forEach(m => {
    console.log(`- ID: ${m.id}, Nome: ${m.name}, Slug: ${m.slug}, Status: ${m.status}`);
    
    // Verificar posts dessa modelo
    db.select().from(posts).where(eq(posts.modelId, m.id)).then(modelPosts => {
      console.log(`  Posts da modelo (ID: ${m.id}):`);
      if (modelPosts.length === 0) {
        console.log('  Nenhum post encontrado');
      } else {
        modelPosts.forEach(p => {
          console.log(`  - ID: ${p.id}, Title: ${p.title}, Type: ${p.type}`);
        });
      }
    });
  });
  
  // Também verificar se há modelos com slug específico
  const slugModels = await db.select().from(models).where(
    eq(models.slug, 'modelo-teste')
  );
  
  console.log('\nModelos com slug exato "modelo-teste":');
  slugModels.forEach(m => {
    console.log(`- ID: ${m.id}, Nome: ${m.name}, Slug: ${m.slug}`);
  });
  
  // Verificar todos os posts administrativos
  console.log('\n=== TODOS OS POSTS ADMINISTRATIVOS ===');
  const allAdminPosts = await db.select().from(posts);
  allAdminPosts.forEach(p => {
    console.log(`- ID: ${p.id}, ModelID: ${p.modelId}, Title: ${p.title}, Type: ${p.type}`);
  });
}

checkModelTestData().catch(console.error);