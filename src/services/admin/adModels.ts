import { db } from '../../db';
import { models } from '../../db/schema';
import { eq, desc, sql, like, or, and } from 'drizzle-orm';

export interface AdModelData {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  bannerUrl?: string;
  externalUrl?: string;
  isFeatured?: boolean;
  isAdvertiser?: boolean;
  status?: 'active' | 'hidden' | 'draft';
}

export interface AdModelFilters {
  search?: string;
  status?: 'active' | 'hidden' | 'draft';
  isFeatured?: boolean;
}

export class AdminModelsService {
  /**
   * Lista modelos de publicidade (isAdvertiser = true)
   */
  static async list(page: number = 1, limit: number = 20, filters?: AdModelFilters) {
    const offset = (page - 1) * limit;
    
    // Build conditions
    const conditions: any[] = [];
    
    if (filters?.status) {
      conditions.push(eq(models.status, filters.status));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(models.name, `%${filters.search}%`),
          like(models.slug, `%${filters.search}%`)
        )
      );
    }

    // Get data
    let query = db
      .select()
      .from(models)
      .orderBy(desc(models.createdAt))
      .limit(limit)
      .offset(offset);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const data = await query;

    // Count total
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(models);
    
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
   * Busca modelo por ID
   */
  static async getById(id: number) {
    const result = await db.query.models.findFirst({
      where: eq(models.id, id)
    });
    return result;
  }

  /**
   * Busca modelo por slug
   */
  static async getBySlug(slug: string) {
    const result = await db.query.models.findFirst({
      where: eq(models.slug, slug)
    });
    return result;
  }

  /**
   * Cria novo modelo
   */
  static async create(data: AdModelData) {
    // Gerar slug único a partir do name se não fornecido
    const slug = data.slug || this.generateSlug(data.name);
    
    // Verificar se slug já existe
    const existing = await this.getBySlug(slug);
    if (existing) {
      throw new Error(`Já existe um modelo com o slug "${slug}"`);
    }

    const [result] = await db.insert(models).values({
      name: data.name,
      slug: slug,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      iconUrl: data.iconUrl,
      bannerUrl: data.bannerUrl,
      externalUrl: data.externalUrl,
      isFeatured: data.isFeatured ?? false,
      isAdvertiser: data.isAdvertiser ?? true,
      status: data.status || 'active',
      postCount: 0
    }).returning();

    return result;
  }

  /**
   * Atualiza modelo existente
   */
  static async update(data: AdModelData & { id: number }) {
    // Verificar se o modelo existe
    const existing = await this.getById(data.id);
    if (!existing) {
      throw new Error('Modelo não encontrado');
    }

    // Se mudou o slug, verificar se já existe
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await this.getBySlug(data.slug);
      if (slugExists) {
        throw new Error(`Já existe um modelo com o slug "${data.slug}"`);
      }
    }

    const [result] = await db
      .update(models)
      .set({
        name: data.name,
        slug: data.slug || existing.slug,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        iconUrl: data.iconUrl,
        bannerUrl: data.bannerUrl,
        externalUrl: data.externalUrl,
        isFeatured: data.isFeatured,
        isAdvertiser: data.isAdvertiser,
        status: data.status
      })
      .where(eq(models.id, data.id))
      .returning();

    return result;
  }

  /**
   * Exclui modelo
   */
  static async delete(id: number) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Modelo não encontrado');
    }

    await db.delete(models).where(eq(models.id, id));
    return true;
  }

  /**
   * Alterna status do modelo (active <-> hidden)
   */
  static async toggleStatus(id: number) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Modelo não encontrado');
    }

    const newStatus = existing.status === 'active' ? 'hidden' : 'active';
    
    const [result] = await db
      .update(models)
      .set({ status: newStatus })
      .where(eq(models.id, id))
      .returning();

    return result;
  }

  /**
   * Alterna destaque do modelo
   */
  static async toggleFeatured(id: number) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Modelo não encontrado');
    }

    const [result] = await db
      .update(models)
      .set({ isFeatured: !existing.isFeatured })
      .where(eq(models.id, id))
      .returning();

    return result;
  }

  /**
   * Obtém estatísticas dos modelos
   */
  static async getStats() {
    const [result] = await db.select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where ${models.status} = 'active')`,
      hidden: sql<number>`count(*) filter (where ${models.status} = 'hidden')`,
      featured: sql<number>`count(*) filter (where ${models.isFeatured} = true)`,
      advertisers: sql<number>`count(*) filter (where ${models.isAdvertiser} = true)`
    })
    .from(models);

    return {
      total: Number(result?.total || 0),
      active: Number(result?.active || 0),
      hidden: Number(result?.hidden || 0),
      featured: Number(result?.featured || 0),
      advertisers: Number(result?.advertisers || 0)
    };
  }

  /**
   * Gera slug a partir de um nome
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
      .replace(/(^-|-$)/g, '');         // Remove hífens do início e fim
  }
}
