import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';
import { AdBanner } from '../../components/molecules/AdBanner';
import { AdSpotSmall } from '../../components/molecules/AdSpotSmall';
import { HeroCarousel } from '../../components/organisms/HeroCarousel';
import { PostCard } from '../../components/organisms/PostCard';
import { NativeAdBlock } from '../../components/molecules/NativeAdBlock';
import type { Ad } from '../../services/ads';

interface AdminAdsCreateProps {
  ad?: Ad;
  isEditing?: boolean;
}

// Mapeamento de placements válidos por tipo - deve ser consistente com o backend
const VALID_PLACEMENTS_BY_TYPE = {
  diamond: ['feed_model'],
  diamond_block: ['home_top', 'home_middle', 'models_grid'],
  banner: ['home_top', 'home_bottom', 'login', 'register'],
  spot: ['sidebar', 'model_profile', 'model_sidebar'],
  hero: ['home_top']
};

// Labels para os placements
const PLACEMENT_LABELS: Record<string, string> = {
  'home_top': 'Home (Topo)',
  'home_middle': 'Home (Meio)',
  'home_bottom': 'Home (Rodapé)',
  'sidebar': 'Sidebar (Geral)',
  'feed_mix': 'Feed Mix',
  'models_grid': 'Grid de Modelos',
  'model_profile': 'Perfil de Modelo (Topo)',
  'login': 'Página de Login',
  'register': 'Página de Registro',
  'feed_model': 'Feed de Modelo',
  'model_sidebar': 'Sidebar de Modelo'
};

export const AdminAdsCreate: FC<AdminAdsCreateProps> = ({ ad, isEditing = false }) => {
  const defaultImage = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80";
  
  // Default values from ad or empty
  const formData = {
    name: ad?.name || '',
    type: ad?.type || 'diamond',
    placement: ad?.placement || 'home_middle',
    status: ad?.status || 'draft',
    title: ad?.title || 'Título do Anúncio',
    subtitle: ad?.subtitle || 'Descrição curta do anúncio',
    ctaText: ad?.ctaText || 'SAIBA MAIS',
    imageUrl: ad?.imageUrl || defaultImage,
    link: ad?.link || '#',
    category: ad?.category || 'DESTAQUE',
    priority: ad?.priority || 0,
  };

  const formAction = isEditing ? `/admin/ads/${ad?.id}/update` : '/admin/ads/create';
  const pageTitle = isEditing ? `Editar Anúncio: ${ad?.name}` : 'Criar Novo Anúncio';
  
  // Gerar opções de placement para o tipo atual
  const currentTypePlacements = VALID_PLACEMENTS_BY_TYPE[formData.type as keyof typeof VALID_PLACEMENTS_BY_TYPE] || [];
  
  return (
    <AdminLayout title={pageTitle} activePath="/admin/ads">
      <div class="mb-6">
        <a href="/admin/ads" class="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar para lista
        </a>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div class="w-full md:w-1/3 space-y-6">
          <div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
            <h2 class="text-xl font-display text-white mb-6">Configuração do Anúncio</h2>
            
            <form action={formAction} method="post" class="space-y-4" id="ad-form">
              
              {/* Campaign Name */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome da Campanha</label>
                <input type="text" id="input-name" name="name" value={formData.name} placeholder="Ex: Black Friday 2026" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Ad Type Selector */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tipo de Anúncio</label>
                <select id="input-type" name="type" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none appearance-none">
                  <option value="diamond" selected={formData.type === 'diamond'}>Diamond Selection (Post Style)</option>
                  <option value="diamond_block" selected={formData.type === 'diamond_block'}>Diamond Selection (Native Block)</option>
                  <option value="banner" selected={formData.type === 'banner'}>Banner Horizontal (Native)</option>
                  <option value="spot" selected={formData.type === 'spot'}>Ad Spot Small (Native)</option>
                  <option value="hero" selected={formData.type === 'hero'}>Hero Carousel</option>
                </select>
                <p class="text-[10px] text-gray-500 mt-1">O tipo determina onde o anúncio pode aparecer.</p>
              </div>

              {/* Placement - Dinâmico baseado no tipo */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Placement</label>
                <select id="input-placement" name="placement" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none appearance-none">
                  {/* Opções serão preenchidas via JavaScript */}
                </select>
                <p id="placement-hint" class="text-[10px] text-primary/70 mt-1">Locais disponíveis para este tipo de anúncio.</p>
              </div>

              {/* Status */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select id="input-status" name="status" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none appearance-none">
                  <option value="draft" selected={formData.status === 'draft'}>Rascunho</option>
                  <option value="active" selected={formData.status === 'active'}>Ativo</option>
                  <option value="paused" selected={formData.status === 'paused'}>Pausado</option>
                </select>
              </div>

              <hr class="border-white/10 my-4" />

              {/* Common Fields */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título Principal</label>
                <input type="text" id="input-title" name="title" value={formData.title} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Subtitle (Banner Only) */}
              <div id="field-subtitle" class="hidden">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subtítulo</label>
                <input type="text" id="input-subtitle" name="subtitle" value={formData.subtitle} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Category (Hero Only) */}
              <div id="field-category" class="hidden">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoria</label>
                <input type="text" id="input-category" name="category" value={formData.category} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* CTA Text (Banner, Spot, Hero) */}
              <div id="field-cta">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Texto do Botão (CTA)</label>
                <input type="text" id="input-cta" name="ctaText" value={formData.ctaText} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Image URL */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL da Imagem</label>
                <input type="text" id="input-image" name="imageUrl" value={formData.imageUrl} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
                <p class="text-[10px] text-gray-500 mt-1">Recomendado: 1200x628 para Banner, 1080x1350 para Post/Spot.</p>
              </div>

              {/* Link */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link de Destino</label>
                <input type="text" id="input-link" name="link" value={formData.link} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Priority */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prioridade</label>
                <input type="number" id="input-priority" name="priority" value={String(formData.priority)} min="0" max="100" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
                <p class="text-[10px] text-gray-500 mt-1">Maior valor = maior prioridade de exibição.</p>
              </div>

              <div class="pt-4 flex gap-3">
                <Button variant="primary" className="flex-1" type="submit">
                  {isEditing ? 'Salvar Alterações' : 'Publicar Anúncio'}
                </Button>
                <a href="/admin/ads" class="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded text-sm font-bold uppercase transition-colors">
                  Cancelar
                </a>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div class="w-full md:w-2/3">
           <div class="sticky top-6">
              <div class="flex items-center justify-between mb-4">
                  <h3 class="text-white font-display uppercase tracking-widest text-sm">Preview em Tempo Real</h3>
                  <span class="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded uppercase font-bold">Ao Vivo</span>
              </div>

              <div class="bg-black/50 border border-white/5 rounded-xl p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden pattern-grid">
                  
                  {/* PREVIEW: DIAMOND (POST STYLE) */}
                  <div id="preview-diamond" class="w-full max-w-sm">
                      <PostCard 
                        post={{
                            id: 'preview',
                            title: formData.title,
                            likes: 1234,
                            tipsTotal: 500,
                            comments: 42,
                            createdAt: 'Patrocinado',
                            mediaCdns: { images: [formData.imageUrl] }
                        }}
                        model={{
                            iconUrl: 'https://ui-avatars.com/api/?name=Ad+Partner&background=FFD700&color=000',
                        }}
                        displayName="Parceiro Oficial"
                      />
                  </div>

                  {/* PREVIEW: DIAMOND (NATIVE BLOCK) */}
                  <div id="preview-diamond-block" class="w-full hidden">
                      <NativeAdBlock 
                        title="Diamond Selection"
                        models={[
                            { name: formData.title, imageUrl: formData.imageUrl, isPromoted: true, category: "Destaque" },
                            { name: "Modelo 2", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80", isPromoted: true, category: "Modelo" },
                            { name: "Modelo 3", imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", isPromoted: true, category: "Modelo" },
                            { name: "Modelo 4", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", isPromoted: true, category: "Modelo" }
                        ]}
                      />
                  </div>

                  {/* PREVIEW: BANNER */}
                  <div id="preview-banner" class="w-full hidden">
                      <AdBanner 
                        title={formData.title}
                        subtitle={formData.subtitle}
                        ctaText={formData.ctaText}
                        link="#"
                        imageUrl={formData.imageUrl}
                      />
                  </div>

                  {/* PREVIEW: SPOT SMALL (DEFAULT) */}
                  <div id="preview-spot" class="w-64 hidden">
                      <AdSpotSmall 
                        title={formData.title}
                        buttonText={formData.ctaText}
                        link="#"
                        imageUrl={formData.imageUrl}
                      />
                  </div>

                  {/* PREVIEW: SPOT SMALL (CARD STYLE - MODEL SIDEBAR) */}
                  <div id="preview-spot-card" class="w-64 hidden">
                    <a href="#" class="block rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-colors group">
                      <img src={formData.imageUrl} class="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                      <div class="p-3 bg-[#1a1a1a]">
                        <span class="text-[10px] text-[#FFD700] font-bold uppercase">Patrocinado</span>
                        <h5 class="text-white font-bold text-sm mt-1">{formData.title}</h5>
                        <span class="text-xs text-primary mt-2 inline-block">{formData.ctaText}</span>
                      </div>
                    </a>
                  </div>

                  {/* PREVIEW: SPOT SMALL (BANNER STYLE - MODEL PROFILE TOPO) */}
                  <div id="preview-spot-banner" class="w-full hidden">
                    <div class="relative w-full h-24 md:h-32 rounded-lg overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#050505] border border-white/10 hover:border-primary/50 transition-all">
                      <img src={formData.imageUrl} class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />
                      <div class="absolute inset-0 flex items-center justify-between px-4 md:px-10 z-10">
                        <div class="flex flex-col justify-center">
                          <span class="text-[10px] text-[#FFD700] uppercase font-bold tracking-widest border border-[#FFD700] px-1 w-fit mb-1">Publicidade</span>
                          <h4 class="text-white font-display text-xl md:text-3xl uppercase leading-none">{formData.title}</h4>
                          <p class="text-gray-400 text-xs md:text-sm hidden sm:block">{formData.subtitle}</p>
                        </div>
                        <span class="bg-primary text-white text-xs md:text-sm font-bold px-4 py-2 rounded-sm uppercase group-hover:bg-primary/80 transition-colors">{formData.ctaText}</span>
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW: HERO CAROUSEL */}
                  <div id="preview-hero" class="w-full hidden">
                      <HeroCarousel 
                        slides={[{
                            image: formData.imageUrl,
                            title: formData.title,
                            category: formData.category,
                            isLive: false
                        }]}
                      />
                  </div>

              </div>
           </div>
        </div>

      </div>

      {/* CLIENT-SIDE SCRIPT FOR PREVIEW AND DYNAMIC PLACEMENTS */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('ad-form');
            const typeSelect = document.getElementById('input-type');
            const placementSelect = document.getElementById('input-placement');
            
            // Inputs
            const titleInput = document.getElementById('input-title');
            const subtitleInput = document.getElementById('input-subtitle');
            const ctaInput = document.getElementById('input-cta');
            const imageInput = document.getElementById('input-image');
            const linkInput = document.getElementById('input-link');
            const catInput = document.getElementById('input-category');

            // Fields Containers
            const fieldSubtitle = document.getElementById('field-subtitle');
            const fieldCategory = document.getElementById('field-category');
            const fieldCta = document.getElementById('field-cta');

            // Preview Containers
            const pDiamond = document.getElementById('preview-diamond');
            const pDiamondBlock = document.getElementById('preview-diamond-block');
            const pBanner = document.getElementById('preview-banner');
            const pSpot = document.getElementById('preview-spot');
            const pSpotCard = document.getElementById('preview-spot-card');
            const pSpotBanner = document.getElementById('preview-spot-banner');
            const pHero = document.getElementById('preview-hero');

            // Mapeamento de placements válidos por tipo
            const validPlacementsByType = {
                diamond: ['feed_model'],
                diamond_block: ['home_top', 'home_middle', 'models_grid'],
                banner: ['home_top', 'home_bottom', 'login', 'register'],
                spot: ['sidebar', 'model_profile', 'model_sidebar'],
                hero: ['home_top']
            };

            // Labels para os placements
            const placementLabels = {
                'home_top': 'Home (Topo)',
                'home_middle': 'Home (Meio)',
                'home_bottom': 'Home (Rodapé)',
                'sidebar': 'Sidebar (Geral)',
                'feed_mix': 'Feed Mix',
                'models_grid': 'Grid de Modelos',
                'model_profile': 'Perfil de Modelo (Topo)',
                'login': 'Página de Login',
                'register': 'Página de Registro',
                'feed_model': 'Feed de Modelo',
                'model_sidebar': 'Sidebar de Modelo'
            };

            // Valor inicial do placement (do servidor)
            const initialPlacement = '${formData.placement}';

            function updatePlacementOptions() {
                const type = typeSelect.value;
                const validPlacements = validPlacementsByType[type] || [];
                
                // Salvar seleção atual se ainda for válida
                const currentSelection = placementSelect.value;
                
                // Limpar opções atuais
                placementSelect.innerHTML = '';
                
                // Adicionar novas opções
                validPlacements.forEach(placement => {
                    const option = document.createElement('option');
                    option.value = placement;
                    option.textContent = placementLabels[placement] || placement;
                    
                    // Selecionar a opção se for a seleção atual ou inicial
                    if (placement === currentSelection && validPlacements.includes(currentSelection)) {
                        option.selected = true;
                    } else if (placement === initialPlacement && validPlacements.includes(initialPlacement) && !currentSelection) {
                        option.selected = true;
                    }
                    
                    placementSelect.appendChild(option);
                });

                // Se nenhuma opção foi selecionada, selecionar a primeira
                if (!placementSelect.value && placementSelect.options.length > 0) {
                    placementSelect.options[0].selected = true;
                }
            }

            function updateVisibility() {
                const type = typeSelect.value;
                const placement = placementSelect.value;
                
                // Reset Previews
                pDiamond.classList.add('hidden');
                pDiamondBlock.classList.add('hidden');
                pBanner.classList.add('hidden');
                pSpot.classList.add('hidden');
                pSpotCard.classList.add('hidden');
                pSpotBanner.classList.add('hidden');
                pHero.classList.add('hidden');

                // Reset Fields
                fieldSubtitle.classList.add('hidden');
                fieldCategory.classList.add('hidden');
                fieldCta.classList.remove('hidden');

                if (type === 'diamond') {
                    pDiamond.classList.remove('hidden');
                    fieldCta.classList.add('hidden'); 
                } else if (type === 'diamond_block') {
                    pDiamondBlock.classList.remove('hidden');
                    fieldCta.classList.add('hidden');
                } else if (type === 'banner') {
                    pBanner.classList.remove('hidden');
                    fieldSubtitle.classList.remove('hidden');
                } else if (type === 'spot') {
                    if (placement === 'model_sidebar') {
                        pSpotCard.classList.remove('hidden');
                    } else if (placement === 'model_profile') {
                        pSpotBanner.classList.remove('hidden');
                        fieldSubtitle.classList.remove('hidden'); // Show subtitle for banner-style spot
                    } else {
                        pSpot.classList.remove('hidden');
                    }
                } else if (type === 'hero') {
                    pHero.classList.remove('hidden');
                    fieldCategory.classList.remove('hidden');
                }
            }

            function updatePreview() {
                const type = typeSelect.value;
                const title = titleInput.value;
                const subtitle = subtitleInput.value;
                const cta = ctaInput.value;
                const imgUrl = imageInput.value;
                const cat = catInput?.value || '';

                // Update Diamond (Post)
                if (type === 'diamond') {
                    const captionEl = pDiamond.querySelector('.stack-footer .text-gray-300');
                    if(captionEl) {
                        const nameSpan = captionEl.querySelector('span');
                        captionEl.innerHTML = '';
                        if(nameSpan) captionEl.appendChild(nameSpan);
                        captionEl.appendChild(document.createTextNode(' ' + title));
                    }
                    const imgEl = pDiamond.querySelector('.carousel-item img');
                    if(imgEl) imgEl.src = imgUrl;
                }

                // Update Diamond (Block)
                if (type === 'diamond_block') {
                    const blockTitleEl = pDiamondBlock.querySelector('h3');
                    if(blockTitleEl) {
                        const starSpan = blockTitleEl.querySelector('span');
                        blockTitleEl.innerHTML = '';
                        if(starSpan) blockTitleEl.appendChild(starSpan);
                        blockTitleEl.appendChild(document.createTextNode(' ' + title));
                    }

                    const firstCard = pDiamondBlock.querySelector('.grid > a:first-child');
                    if(firstCard) {
                        const imgEl = firstCard.querySelector('img');
                        const nameEl = firstCard.querySelector('h3');
                        
                        if(imgEl) imgEl.src = imgUrl;
                        if(nameEl) nameEl.innerText = title; 
                    }
                }

                // Update Banner
                if (type === 'banner') {
                    const titleEl = pBanner.querySelector('h4');
                    const subEl = pBanner.querySelector('p');
                    const ctaEl = pBanner.querySelector('span.bg-primary');
                    const imgEl = pBanner.querySelector('img');
                    
                    if(titleEl) titleEl.innerText = title;
                    if(subEl) subEl.innerText = subtitle;
                    if(ctaEl) ctaEl.innerText = cta;
                    if(imgEl) imgEl.src = imgUrl;
                }

                // Update Spot
                if (type === 'spot') {
                    // Default Spot
                    const titleEl = pSpot.querySelector('.absolute.bottom-3 p');
                    const btnEl = pSpot.querySelector('.absolute.bottom-3 button');
                    const imgEl = pSpot.querySelector('img');

                    if(titleEl) titleEl.innerText = title;
                    if(btnEl) btnEl.innerText = cta;
                    if(imgEl) imgEl.src = imgUrl;

                    // Card Style Spot
                    const cardTitleEl = pSpotCard.querySelector('h5');
                    const cardCtaEl = pSpotCard.querySelector('span.text-primary');
                    const cardImgEl = pSpotCard.querySelector('img');

                    if(cardTitleEl) cardTitleEl.innerText = title;
                    if(cardCtaEl) cardCtaEl.innerText = cta;
                    if(cardImgEl) cardImgEl.src = imgUrl;

                    // Banner Style Spot
                    const bTitleEl = pSpotBanner.querySelector('h4');
                    const bSubEl = pSpotBanner.querySelector('p');
                    const bCtaEl = pSpotBanner.querySelector('span.bg-primary');
                    const bImgEl = pSpotBanner.querySelector('img');

                    if(bTitleEl) bTitleEl.innerText = title;
                    if(bSubEl) bSubEl.innerText = subtitle;
                    if(bCtaEl) bCtaEl.innerText = cta;
                    if(bImgEl) bImgEl.src = imgUrl;
                }

                // Update Hero
                if (type === 'hero') {
                   const titleEl = pHero.querySelector('h2');
                   const catEl = pHero.querySelector('.text-primary.font-bold');
                   const imgEl = pHero.querySelector('img');
                   
                   if(titleEl) titleEl.innerText = title;
                   if(catEl) catEl.innerText = cat;
                   if(imgEl) imgEl.src = imgUrl;
                }
            }

            // Listeners
            typeSelect.addEventListener('change', () => {
                updatePlacementOptions();
                updateVisibility();
                updatePreview();
            });

            placementSelect.addEventListener('change', () => {
                updateVisibility();
                updatePreview();
            });

            [titleInput, subtitleInput, ctaInput, imageInput, linkInput, catInput].forEach(input => {
                if(input) input.addEventListener('input', updatePreview);
            });

            // Init
            updatePlacementOptions();
            updateVisibility();
            updatePreview();
        });
      `}} />
    </AdminLayout>
  );
};
