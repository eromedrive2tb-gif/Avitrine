import { db } from '../src/db';
import { models, posts, whitelabelModels, whitelabelPosts } from '../src/db/schema';

async function debugAllData() {
  console.log('=== TODOS OS MODELOS ADMINISTRATIVOS ===');
  const adminModels = await db.select().from(models);
  adminModels.forEach(m => {
    console.log(`- ID: ${m.id}, Nome: ${m.name}, Slug: ${m.slug}, Status: ${m.status}, PostCount: ${m.postCount}`);
  });

  console.log('\n=== TODOS OS MODELOS WHITELABEL ===');
  const wlModels = await db.select().from(whitelabelModels);
  wlModels.forEach(m => {
    console.log(`- ID: ${m.id}, Folder: ${m.folderName}, PostCount: ${m.postCount}`);
  });

  console.log('\n=== TODOS OS POSTS ADMINISTRATIVOS ===');
  const adminPosts = await db.select().from(posts);
  adminPosts.forEach(p => {
    console.log(`- ID: ${p.id}, ModelID: ${p.modelId}, Title: ${p.title}, Type: ${p.type}`);
  });

  console.log('\n=== TODOS OS POSTS WHITELABEL ===');
  const wlPosts = await db.select().from(whitelabelPosts);
  wlPosts.forEach(p => {
    console.log(`- ID: ${p.id}, ModelID: ${p.whitelabelModelId}, Title: ${p.title}`);
  });
}

debugAllData().catch(console.error);