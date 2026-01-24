import { db } from '../../db';
import { checkouts, subscriptions, models, ads, plans, users } from '../../db/schema';
import { eq, sql, desc, gte, and, lt } from 'drizzle-orm';

export const AdminDashboardService = {
  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);

    // 1. Receita Mensal
    const [revenueResult] = await db
      .select({ total: sql<number>`SUM(${checkouts.totalAmount})` })
      .from(checkouts)
      .where(and(eq(checkouts.status, 'paid'), gte(checkouts.createdAt, thirtyDaysAgo)));
    
    const [prevRevenueResult] = await db
      .select({ total: sql<number>`SUM(${checkouts.totalAmount})` })
      .from(checkouts)
      .where(and(
        eq(checkouts.status, 'paid'), 
        gte(checkouts.createdAt, sixtyDaysAgo),
        lt(checkouts.createdAt, thirtyDaysAgo)
      ));

    const currentRevenue = Number(revenueResult?.total || 0);
    const prevRevenue = Number(prevRevenueResult?.total || 0);
    const revenueTrend = prevRevenue > 0 
      ? `${(((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(0)}%`
      : '+0%';

    const monthlyRevenue = (currentRevenue / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    // 2. Novos Assinantes
    const [subscribersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(subscriptions)
      .where(and(eq(subscriptions.status, 'active'), gte(subscriptions.createdAt, thirtyDaysAgo)));
    
    const [prevSubscribersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(subscriptions)
      .where(and(
        eq(subscriptions.status, 'active'), 
        gte(subscriptions.createdAt, sixtyDaysAgo),
        lt(subscriptions.createdAt, thirtyDaysAgo)
      ));

    const currentSubs = Number(subscribersResult?.count || 0);
    const prevSubs = Number(prevSubscribersResult?.count || 0);
    const subscribersTrend = prevSubs > 0 
      ? `${(((currentSubs - prevSubs) / prevSubs) * 100).toFixed(0)}%`
      : '+0%';

    const newSubscribers = currentSubs.toLocaleString('pt-BR');

    // 3. Modelos Ativas
    const [modelsResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(models);
    
    const activeModels = Number(modelsResult?.count || 0).toLocaleString('pt-BR');

    // 4. Ads CTR Médio
    const [adsResult] = await db
      .select({
        clicks: sql<number>`SUM(${ads.clicks})`,
        impressions: sql<number>`SUM(${ads.impressions})`,
      })
      .from(ads);
    
    const clicks = Number(adsResult?.clicks || 0);
    const impressions = Number(adsResult?.impressions || 0);
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgAdsCtr = `${ctr.toFixed(1)}%`;

    return {
      monthlyRevenue,
      revenueTrend,
      revenueIsPositive: currentRevenue >= prevRevenue,
      newSubscribers,
      subscribersTrend,
      subscribersIsPositive: currentSubs >= prevSubs,
      activeModels,
      avgAdsCtr,
    };
  },

  async getTrafficData() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Como não temos tabela de tráfego, vamos usar checkouts criados (tentativas de compra) por hora
    const trafficResult = await db
      .select({
        hour: sql<string>`DATE_TRUNC('hour', ${checkouts.createdAt})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(checkouts)
      .where(gte(checkouts.createdAt, twentyFourHoursAgo))
      .groupBy(sql`DATE_TRUNC('hour', ${checkouts.createdAt})`)
      .orderBy(sql`DATE_TRUNC('hour', ${checkouts.createdAt})`);

    // Mapear para um array de 24 números
    const data = Array.from({ length: 24 }).fill(0) as number[];
    const now = new Date();
    
    trafficResult.forEach(row => {
      const rowDate = new Date(row.hour);
      const diffHours = Math.floor((now.getTime() - rowDate.getTime()) / (1000 * 60 * 60));
      if (diffHours >= 0 && diffHours < 24) {
        data[23 - diffHours] = Number(row.count);
      }
    });

    return data;
  },

  async getRecentActivity() {
    // Buscar as 5 atividades mais recentes (Checkouts pagos ou novas assinaturas)
    const recentSubscriptions = await db
      .select({
        userName: users.name,
        planName: plans.name,
        createdAt: subscriptions.createdAt,
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .leftJoin(plans, eq(subscriptions.planId, plans.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(5);

    return recentSubscriptions.map(sub => {
      const diff = Math.floor((new Date().getTime() - new Date(sub.createdAt!).getTime()) / (1000 * 60));
      let timeAgo = `${diff} minutos`;
      if (diff >= 60) {
        const hours = Math.floor(diff / 60);
        timeAgo = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      }
      if (diff >= 1440) {
        const days = Math.floor(diff / 1440);
        timeAgo = `${days} ${days === 1 ? 'dia' : 'dias'}`;
      }

      return {
        userName: sub.userName || 'Visitante',
        planName: sub.planName || 'Plano',
        timeAgo: `Há ${timeAgo}`,
      };
    });
  }
};
