import { db } from '../db';
import { ads } from '../db/schema';
import { eq, desc, asc, and, or, sql, gte, lte, isNull } from 'drizzle-orm';

// Types
export type AdType = 'diamond' | 'diamond_block' | 'banner' | 'spot' | 'hero';
export type AdPlacement = 'home_top' | 'home_middle' | 'home_bottom' | 'sidebar' | 'feed_mix' | 'models_grid' | 'model_profile' | 'login' | 'register' | 'feed_model' | 'model_sidebar';
export type AdStatus = 'active' | 'paused' | 'draft';

// Mapeamento de placements válidos por tipo de anúncio
export const VALID_PLACEMENTS_BY_TYPE: Record<AdType, AdPlacement[]> = {
  // Diamond Selection (post style): apenas em feeds de conteúdo do modelo
  diamond: ['feed_model'],
  
  // Diamond Block (native block): apenas em áreas de destaque
  diamond_block: ['home_top', 'home_middle', 'models_grid'],
  
  // Banner: qualquer lugar menos feeds de conteúdo
  banner: ['home_top', 'home_bottom', 'login', 'register'],
  
  // Ad Spot Small: apenas áreas laterais ou secundárias
  spot: ['sidebar', 'model_profile', 'model_sidebar'],
  
  // Hero Carousel: apenas topo da home
  hero: ['home_top']
};

// Função para obter o placement padrão de um tipo
export const getDefaultPlacement = (type: AdType): AdPlacement => {
  return VALID_PLACEMENTS_BY_TYPE[type][0];
};

// Função para validar se um placement é válido para um tipo
export const isValidPlacement = (type: AdType, placement: AdPlacement): boolean => {
  return VALID_PLACEMENTS_BY_TYPE[type].includes(placement);
};

export interface CreateAdInput {
  name: string;
  type: AdType;
  placement: AdPlacement;
  status?: AdStatus;
  title: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  link: string;
  category?: string;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateAdInput extends Partial<CreateAdInput> {
  id: number;
}

export interface Ad {
  id: number;
  name: string;
  type: AdType;
  placement: AdPlacement;
  status: AdStatus;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  imageUrl: string | null;
  link: string;
  category: string | null;
  impressions: number;
  clicks: number;
  priority: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ListAdsResult {
  data: Ad[];
  total: number;
  page: number;
  totalPages: number;
}

export const AdsService = {
  /**
   * Lista todos os anúncios com paginação e filtros
   */
  async list(
    page: number = 1, 
    limit: number = 20, 
    filters?: { status?: AdStatus; placement?: AdPlacement; type?: AdType }
  ): Promise<ListAdsResult> {
    const offset = (page - 1) * limit;
    
    // Build conditions
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(ads.status, filters.status));
    }
    if (filters?.placement) {
      conditions.push(eq(ads.placement, filters.placement));
    }
    if (filters?.type) {
      conditions.push(eq(ads.type, filters.type));
    }

    // Query
    let query = db.select().from(ads).orderBy(desc(ads.createdAt)).limit(limit).offset(offset);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const data = await query;

    // Count total
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(ads);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as any;
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    return {
      data: data as Ad[],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  /**
   * Busca um anúncio por ID
   */
  async getById(id: number): Promise<Ad | null> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id)).limit(1);
    return (ad as Ad) || null;
  },

  /**
   * Cria um novo anúncio
   */
  async create(input: CreateAdInput): Promise<Ad> {
    // Validar e ajustar placement se necessário
    const type = input.type;
    let placement = input.placement;
    
    if (!isValidPlacement(type, placement)) {
      // Se o placement não é válido para o tipo, usar o padrão
      placement = getDefaultPlacement(type);
      console.warn(`[Ads] Placement "${input.placement}" inválido para tipo "${type}". Usando placement padrão: "${placement}"`);
    }
    
    const [ad] = await db.insert(ads).values({
      name: input.name,
      type: input.type,
      placement: placement,
      status: input.status || 'draft',
      title: input.title,
      subtitle: input.subtitle || null,
      ctaText: input.ctaText || null,
      imageUrl: input.imageUrl || null,
      link: input.link,
      category: input.category || null,
      priority: input.priority || 0,
      startDate: input.startDate || null,
      endDate: input.endDate || null,
    }).returning();

    return ad as Ad;
  },

  /**
   * Atualiza um anúncio existente
   */
  async update(input: UpdateAdInput): Promise<Ad | null> {
    const { id, ...data } = input;
    
    // Se está alterando o tipo, precisamos validar/ajustar o placement
    if (data.type !== undefined) {
      const currentAd = await this.getById(id);
      if (currentAd) {
        const newType = data.type;
        const currentPlacement = data.placement || currentAd.placement;
        
        if (!isValidPlacement(newType, currentPlacement)) {
          // Ajustar placement para o padrão do novo tipo
          data.placement = getDefaultPlacement(newType);
          console.warn(`[Ads] Placement "${currentPlacement}" inválido para tipo "${newType}". Ajustando para: "${data.placement}"`);
        }
      }
    }
    
    // Se está alterando apenas o placement, validar contra o tipo existente
    if (data.placement !== undefined && data.type === undefined) {
      const currentAd = await this.getById(id);
      if (currentAd && !isValidPlacement(currentAd.type, data.placement)) {
        console.warn(`[Ads] Placement "${data.placement}" inválido para tipo "${currentAd.type}". Mantendo placement atual.`);
        delete data.placement;
      }
    }
    
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.placement !== undefined) updateData.placement = data.placement;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.ctaText !== undefined) updateData.ctaText = data.ctaText;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.link !== undefined) updateData.link = data.link;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;

    const [updated] = await db.update(ads).set(updateData).where(eq(ads.id, id)).returning();
    return (updated as Ad) || null;
  },

  /**
   * Deleta um anúncio
   */
  async delete(id: number): Promise<boolean> {
    const [deleted] = await db.delete(ads).where(eq(ads.id, id)).returning();
    return !!deleted;
  },

  /**
   * Alterna o status de um anúncio entre active e paused
   */
  async toggleStatus(id: number): Promise<Ad | null> {
    const ad = await this.getById(id);
    if (!ad) return null;

    const newStatus: AdStatus = ad.status === 'active' ? 'paused' : 'active';
    return this.update({ id, status: newStatus });
  },

  /**
   * Incrementa o contador de impressões
   */
  async trackImpression(id: number): Promise<void> {
    await db.update(ads)
      .set({ impressions: sql`${ads.impressions} + 1` })
      .where(eq(ads.id, id));
  },

  /**
   * Incrementa o contador de cliques
   */
  async trackClick(id: number): Promise<void> {
    await db.update(ads)
      .set({ clicks: sql`${ads.clicks} + 1` })
      .where(eq(ads.id, id));
  },

  /**
   * Busca anúncios ativos para um placement específico
   * Considera datas de início e fim se configuradas
   */
  async getActiveByPlacement(placement: AdPlacement, limit: number = 10): Promise<Ad[]> {
    const now = new Date();
    
    const result = await db.select().from(ads).where(
      and(
        eq(ads.status, 'active'),
        eq(ads.placement, placement),
        // Start date: null or <= now
        or(isNull(ads.startDate), lte(ads.startDate, now)),
        // End date: null or >= now
        or(isNull(ads.endDate), gte(ads.endDate, now))
      )
    ).orderBy(desc(ads.priority), desc(ads.createdAt)).limit(limit);

    return result as Ad[];
  },

  /**
   * Busca anúncios ativos para múltiplos placements
   */
  async getActiveByPlacements(placements: AdPlacement[]): Promise<Record<AdPlacement, Ad[]>> {
    const result: Record<string, Ad[]> = {};
    
    for (const placement of placements) {
      result[placement] = await this.getActiveByPlacement(placement);
    }
    
    return result as Record<AdPlacement, Ad[]>;
  },

  /**
   * Formata label do placement para exibição
   */
  formatPlacementLabel(placement: AdPlacement): string {
    const labels: Record<AdPlacement, string> = {
      'home_top': 'Home (Topo)',
      'home_middle': 'Home (Meio)',
      'home_bottom': 'Home (Rodapé)',
      'sidebar': 'Sidebar',
      'feed_mix': 'Feed Mix',
      'models_grid': 'Grid de Modelos',
      'model_profile': 'Perfil de Modelo',
      'login': 'Página de Login',
      'register': 'Página de Registro',
      'feed_model': 'Feed de Modelo',
      'model_sidebar': 'Sidebar de Modelo'
    };
    return labels[placement] || placement;
  },

  /**
   * Formata label do tipo para exibição
   */
  formatTypeLabel(type: AdType): string {
    const labels: Record<AdType, string> = {
      'diamond': 'Diamond (Post)',
      'diamond_block': 'Diamond (Block)',
      'banner': 'Banner',
      'spot': 'Ad Spot',
      'hero': 'Hero Carousel'
    };
    return labels[type] || type;
  }
};
