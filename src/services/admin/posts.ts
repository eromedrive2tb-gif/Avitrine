import { db } from '../../db';
import { posts, models } from '../../db/schema';
import { eq, desc, sql, like, and, count } from 'drizzle-orm';

export interface AdminPostData {
  id?: number;
  modelId: number;
  title?: string;
  contentUrl: string;
  type: 'image' | 'video';
}

export interface AdminPostFilters {
  search?: string;
  type?: 'image' | 'video';
}

export class AdminPostsService {
  /**
   * Lista posts de uma modelo específica
   */
  static async listByModel(modelId: number, page: number = 1, limit: number = 20, filters?: AdminPostFilters) {
    const offset = (page - 1) * limit;
    
    // Build conditions
    const conditions = [eq(posts.modelId, modelId)];
    
    if (filters?.type) {
      conditions.push(eq(posts.type, filters.type));
    }
    
    if (filters?.search) {
      conditions.push(like(posts.title, `%${filters.search}%`));
    }

    // Get data
    const data = await db
      .select()
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Count total
    const [countResult] = await db
      .select({ count: count() })
      .from(posts)
      .where(and(...conditions));
    
    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages
    };
  }

  /**
   * Busca post por ID
   */
  static async getById(id: number) {
    const result = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        model: true
      }
    });
    return result;
  }

  /**
   * Cria novo post
   */
  static async create(data: AdminPostData) {
    // Verificar se a modelo existe e é administrativa
    const model = await db.query.models.findFirst({
      where: eq(models.id, data.modelId)
    });
    
    if (!model) {
      throw new Error('Modelo não encontrada');
    }

    const [result] = await db.insert(posts).values({
      modelId: data.modelId,
      title: data.title,
      contentUrl: data.contentUrl,
      type: data.type
    }).returning();

    // Atualizar contador de posts da modelo
    await db.update(models)
      .set({ 
        postCount: sql`${models.postCount} + 1` 
      })
      .where(eq(models.id, data.modelId));

    return result;
  }

  /**
   * Atualiza post existente
   */
  static async update(data: AdminPostData & { id: number }) {
    // Verificar se o post existe
    const existing = await this.getById(data.id);
    if (!existing) {
      throw new Error('Post não encontrado');
    }

    const [result] = await db
      .update(posts)
      .set({
        title: data.title,
        contentUrl: data.contentUrl,
        type: data.type
      })
      .where(eq(posts.id, data.id))
      .returning();

    return result;
  }

  /**
   * Exclui post
   */
  static async delete(id: number) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Post não encontrado');
    }

    await db.delete(posts).where(eq(posts.id, id));

    // Atualizar contador de posts da modelo
    await db.update(models)
      .set({ 
        postCount: sql`GREATEST(0, ${models.postCount} - 1)` 
      })
      .where(eq(models.id, existing.modelId));

    return true;
  }

  /**
   * Obtém estatísticas dos posts de uma modelo
   */
  static async getStats(modelId: number) {
    const [result] = await db.select({
      total: count(),
      images: count().filter(sql`${posts.type} = 'image'`),
      videos: count().filter(sql`${posts.type} = 'video'`)
    })
    .from(posts)
    .where(eq(posts.modelId, modelId));

    return {
      total: Number(result?.total || 0),
      images: Number(result?.images || 0),
      videos: Number(result?.videos || 0)
    };
  }

  /**
   * Formata posts para exibição pública (compatível com whitelabel)
   */
  static async formatForPublic(postsData: any[]) {
    return await Promise.all(postsData.map(async post => {
      // Assinar URL se for do S3, manter intacta se for URL externa
      let signedContentUrl = post.contentUrl;
      
      // Verificar se é URL do S3 (DigitalOcean Spaces)
      if (post.contentUrl && post.contentUrl.includes('digitaloceanspaces.com')) {
        try {
          // Extrair a key do S3 da URL
          const url = new URL(post.contentUrl);
          const s3Key = decodeURIComponent(url.pathname.substring(1)); // Remove a barra inicial
          
          // Importar função de assinatura
          const { signS3Key } = await import('../../services/s3');
          const signedUrl = await signS3Key(s3Key);
          
          if (signedUrl) {
            signedContentUrl = signedUrl;
          }
        } catch (error) {
          console.error('Erro ao assinar URL do S3:', error);
          // Mantém a URL original se falhar
        }
      }
      
      return {
        id: post.id,
        title: post.title || `Post #${post.id}`,
        likes: 0, // Posts administrativos não têm likes por padrão
        tipsTotal: 0, // Posts administrativos não têm gorjetas por padrão
        comments: 0, // Posts administrativos não têm comentários por padrão
        createdAt: 'Publicado', // Texto fixo para posts administrativos
        mediaCdns: { 
          images: post.type === 'image' ? [signedContentUrl] : [],
          videos: post.type === 'video' ? [signedContentUrl] : []
        }
      };
    }));
  }
}