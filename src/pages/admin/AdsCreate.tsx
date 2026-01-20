import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';
import { AdBanner } from '../../components/molecules/AdBanner';
import { AdSpotSmall } from '../../components/molecules/AdSpotSmall';
import { HeroCarousel } from '../../components/organisms/HeroCarousel';
import { PostCard } from '../../components/organisms/PostCard';
import { NativeAdBlock } from '../../components/molecules/NativeAdBlock';

export const AdminAdsCreate: FC = () => {
  // Default preview data
  const defaultImage = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80";
  
  return (
    <AdminLayout title="Criar Novo Anúncio">
      <div class="flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div class="w-full md:w-1/3 space-y-6">
          <div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
            <h2 class="text-xl font-display text-white mb-6">Configuração do Anúncio</h2>
            
            <form action="/admin/ads/create" method="POST" class="space-y-4" id="ad-form">
              
              {/* Ad Type Selector */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tipo de Anúncio</label>
                <select id="input-type" name="type" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none appearance-none">
                  <option value="diamond">Diamond Selection (Post Style)</option>
                  <option value="diamond_block">Diamond Selection (Native Block)</option>
                  <option value="banner">Banner Horizontal (Native)</option>
                  <option value="spot">Ad Spot Small (Native)</option>
                  <option value="hero">Hero Carousel</option>
                </select>
              </div>

              {/* Common Fields */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título Principal</label>
                <input type="text" id="input-title" name="title" value="Título do Anúncio" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Subtitle (Banner Only) */}
              <div id="field-subtitle" class="hidden">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subtítulo</label>
                <input type="text" id="input-subtitle" name="subtitle" value="Descrição curta do anúncio" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Category (Hero Only) */}
              <div id="field-category" class="hidden">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoria</label>
                <input type="text" id="input-category" name="category" value="DESTAQUE" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* CTA Text (Banner, Spot, Hero) */}
              <div id="field-cta">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Texto do Botão (CTA)</label>
                <input type="text" id="input-cta" name="ctaText" value="SAIBA MAIS" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              {/* Image URL */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL da Imagem</label>
                <input type="text" id="input-image" name="imageUrl" value={defaultImage} class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
                <p class="text-[10px] text-gray-500 mt-1">Recomendado: 1200x628 para Banner, 1080x1350 para Post/Spot.</p>
              </div>

              {/* Link */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link de Destino</label>
                <input type="text" id="input-link" name="link" value="#" class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" />
              </div>

              <div class="pt-4">
                 <Button variant="primary" className="w-full">Publicar Anúncio</Button>
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
                            title: 'Título do Anúncio',
                            likes: 1234,
                            tipsTotal: 500,
                            comments: 42,
                            createdAt: 'Patrocinado',
                            mediaCdns: { images: [defaultImage] }
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
                            { name: "Título do Anúncio", imageUrl: defaultImage, isPromoted: true, category: "Destaque" },
                            { name: "Modelo 2", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80", isPromoted: true, category: "Modelo" },
                            { name: "Modelo 3", imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", isPromoted: true, category: "Modelo" },
                            { name: "Modelo 4", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", isPromoted: true, category: "Modelo" }
                        ]}
                      />
                  </div>

                  {/* PREVIEW: BANNER */}
                  <div id="preview-banner" class="w-full hidden">
                      <AdBanner 
                        title="Título do Anúncio"
                        subtitle="Descrição curta do anúncio"
                        ctaText="SAIBA MAIS"
                        link="#"
                        imageUrl={defaultImage}
                      />
                  </div>

                  {/* PREVIEW: SPOT SMALL */}
                  <div id="preview-spot" class="w-64 hidden">
                      <AdSpotSmall 
                        title="Título do Anúncio"
                        buttonText="SAIBA MAIS"
                        link="#"
                        imageUrl={defaultImage}
                      />
                  </div>

                  {/* PREVIEW: HERO CAROUSEL */}
                  <div id="preview-hero" class="w-full hidden">
                      <HeroCarousel 
                        slides={[{
                            image: defaultImage,
                            title: "Título do Anúncio",
                            category: "DESTAQUE",
                            isLive: false
                        }]}
                      />
                  </div>

              </div>
           </div>
        </div>

      </div>

      {/* CLIENT-SIDE SCRIPT FOR PREVIEW */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('ad-form');
            const typeSelect = document.getElementById('input-type');
            
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
            const pHero = document.getElementById('preview-hero');

            function updateVisibility() {
                const type = typeSelect.value;
                
                // Reset Previews
                pDiamond.classList.add('hidden');
                pDiamondBlock.classList.add('hidden');
                pBanner.classList.add('hidden');
                pSpot.classList.add('hidden');
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
                    pSpot.classList.remove('hidden');
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
                    // Title of the block section
                    const blockTitleEl = pDiamondBlock.querySelector('h3');
                    if(blockTitleEl) {
                        // Keep the star
                        const starSpan = blockTitleEl.querySelector('span');
                        blockTitleEl.innerHTML = '';
                        if(starSpan) blockTitleEl.appendChild(starSpan);
                        blockTitleEl.appendChild(document.createTextNode(' ' + title)); // Usually "Diamond Selection" but user can change
                    }

                    // Update FIRST Card only (The one being edited)
                    // The first card is inside the grid, first child
                    const firstCard = pDiamondBlock.querySelector('.grid > a:first-child');
                    if(firstCard) {
                        const imgEl = firstCard.querySelector('img');
                        const nameEl = firstCard.querySelector('h3');
                        
                        if(imgEl) imgEl.src = imgUrl;
                        // Use Title as Model Name here for preview
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
                    const titleEl = pSpot.querySelector('.absolute.bottom-3 p');
                    const btnEl = pSpot.querySelector('.absolute.bottom-3 button');
                    const imgEl = pSpot.querySelector('img');

                    if(titleEl) titleEl.innerText = title;
                    if(btnEl) btnEl.innerText = cta;
                    if(imgEl) imgEl.src = imgUrl;
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
                updateVisibility();
                updatePreview();
            });

            [titleInput, subtitleInput, ctaInput, imageInput, linkInput, catInput].forEach(input => {
                if(input) input.addEventListener('input', updatePreview);
            });

            // Init
            updateVisibility();
            updatePreview();
        });
      `}} />
    </AdminLayout>
  );
};
