export const MockService = {
  getTrendingModels: () => [
    { name: "Fernanda T.", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", category: "Gamer", isLive: true, views: "8.5k" },
    { name: "Sarah J.", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", category: "Cosplay", isLive: true, views: "5.1k" },
  ],
  
  getFeedModels: () => [
    { name: "Julia K.", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", category: "Fashion", isLive: false, views: "2k" },
    { name: "Mariana S.", imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80", category: "Vlog", isLive: false, views: "4k" },
    { name: "Elena R.", imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&q=80", category: "Fitness", isLive: false, views: "12k" },
    { name: "HOT_GIRL_99", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", category: "PATROCINADO", isLive: false, views: "AD", isPromoted: true },
    { name: "Sophie", imageUrl: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80", category: "Art", isLive: false, views: "900" },
    { name: "Valentina", imageUrl: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=600&q=80", category: "Lifestyle", isLive: false, views: "3.2k" },
    { name: "Isabella", imageUrl: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=600&q=80", category: "Model", isLive: false, views: "5k" },
    { name: "Carla", imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80", category: "Fitness", isLive: false, views: "2.1k" }
  ],

  getSponsoredModels: () => [
    { name: "Vitoria Secret", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", category: "Premium", isLive: false, views: "PRO" },
    { name: "Bella Doll", imageUrl: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=600&q=80", category: "New", isLive: false, views: "PRO" },
  ],

  getHeroSlides: () => [
    { id: 1, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80", title: "ALESSANDRA V.", category: "CAM #1 BRASIL", isLive: true },
    { id: 2, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80", title: "GAMER NIGHT", category: "EVENTO EXCLUSIVO", isLive: true },
    { id: 3, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80", title: "SARAH JONES", category: "LANÇAMENTO 4K", isLive: false },
  ],

  getTags: () => ['Recomendados', 'Brasileiras', 'VR', 'Live', 'Novinhas', 'Milf', 'Gamer'],

  getAllModels: () => {
    const generateModel = (i: number) => ({
      name: `Model ${i}`,
      imageUrl: `https://images.unsplash.com/photo-${[
          '1534528741775-53994a69daeb', '1524504388940-b1c1722653e1', '1529626455594-4ff0802cfb7e', '1494790108377-be9c29b29330', '1517841905240-472988babdf9'
      ][i % 5]}?w=600&q=80`,
      category: ['Brasileira', 'Gamer', 'Cosplay', 'Amadora'][i % 4],
      isLive: i % 7 === 0,
      views: `${(Math.random() * 10).toFixed(1)}k`,
      isPromoted: false
    });

    const modelsSection1 = Array.from({ length: 10 }).map((_, i) => generateModel(i));
    const modelsSection2 = Array.from({ length: 8 }).map((_, i) => generateModel(i + 10));
    
    // Inject Ad into Section 2
    modelsSection2.splice(2, 0, {
       name: "JOGUE AGORA",
       imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80",
       category: "CASSINO",
       isLive: false,
       views: "AD",
       isPromoted: true
    });

    return { section1: modelsSection1, section2: modelsSection2 };
  },

  getVipModels: () => [
    { name: "Elite One", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
    { name: "Elite Two", imageUrl: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
    { name: "Elite Three", imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
    { name: "Elite Four", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
  ],

  getPlans: () => [
    {
      id: 'basic',
      name: 'Basic',
      price: '29,90',
      currency: 'R$',
      features: ['Acesso limitado', 'Qualidade SD (720p)', 'Com anúncios'],
      highlighted: false,
      variant: 'outline',
      description: 'Acesso imediato. Cancele quando quiser.',
      className: 'order-2 lg:order-1'
    },
    {
      id: 'diamond',
      name: 'DIAMOND',
      price: '99,90',
      currency: 'R$',
      period: '/mês',
      features: [
        { icon: '👑', title: 'Acesso Total VIP', subtitle: 'Todos os vídeos, fotos e sets exclusivos.' },
        { icon: '🎥', title: '4K Ultra HD + VR', subtitle: 'A melhor qualidade possível.' },
        { icon: '💬', title: 'Direct Message', subtitle: 'Fale diretamente com as modelos.' }
      ],
      highlighted: true,
      variant: 'primary',
      badge: 'Experiência Definitiva',
      className: 'order-1 lg:order-2'
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '59,90',
      currency: 'R$',
      features: ['Acesso ilimitado', 'Full HD (1080p)', 'Sem anúncios', 'Acesso a Lives'],
      highlighted: false,
      variant: 'secondary',
      className: 'order-3 lg:order-3'
    }
  ],

  getAdminAds: () => [
    { id: 1, name: "BetWinner Banner", type: "Banner (Type B)", placement: "Home Top", impressions: "125,400", clicks: "4,200", status: "Active" },
    { id: 2, name: "Cassino Native", type: "Native Block (Type C)", placement: "Models Grid", impressions: "80,100", clicks: "1,240", status: "Active" },
    { id: 3, name: "Diamond Push", type: "Post Injection (Type A)", placement: "Feed Mix", impressions: "200,500", clicks: "8,500", status: "Paused" },
    { id: 4, name: "PokerStars Promo", type: "Banner (Type B)", placement: "Sidebar", impressions: "45,000", clicks: "980", status: "Active" },
    { id: 5, name: "OnlyFans Cross", type: "Post Injection (Type A)", placement: "Feed Mix", impressions: "12,000", clicks: "340", status: "Draft" },
  ],

  getAdminModels: () => Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    name: `Model_${i + 1}`,
    email: `model${i + 1}@example.com`,
    joined: "2 days ago",
    status: i % 3 === 0 ? "Pending" : "Verified",
    earnings: `R$ ${Math.floor(Math.random() * 5000)}`,
    posts: Math.floor(Math.random() * 500)
  }))
};
