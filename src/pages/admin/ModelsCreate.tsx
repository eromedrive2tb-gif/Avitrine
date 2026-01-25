import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';

interface AdModel {
  id?: number;
  name?: string;
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

interface AdminModelsCreateProps {
  model?: AdModel;
  isEditing?: boolean;
}

export const AdminModelsCreate: FC<AdminModelsCreateProps> = ({ model, isEditing = false }) => {
  const defaultImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80";
  const defaultBanner = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80";
  
  // Default values from model or empty
  const formData = {
    name: model?.name || '',
    slug: model?.slug || '',
    description: model?.description || '',
    thumbnailUrl: model?.thumbnailUrl || defaultImage,
    iconUrl: model?.iconUrl || '',
    bannerUrl: model?.bannerUrl || defaultBanner,
    externalUrl: model?.externalUrl || '',
    isFeatured: model?.isFeatured || false,
    isAdvertiser: model?.isAdvertiser ?? true,
    status: model?.status || 'active',
  };

  const formAction = isEditing ? `/admin/models/${model?.id}/update` : '/admin/models/create';
  const pageTitle = isEditing ? `Editar Modelo: ${model?.name}` : 'Criar Novo Modelo';
  
  return (
    <AdminLayout title={pageTitle} activePath="/admin/models">
      <div class="mb-6">
        <a href="/admin/models" class="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Voltar para lista
        </a>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div class="w-full lg:w-2/5 space-y-6">
          <div class="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
            <h2 class="text-xl font-display text-white mb-6">Informações do Modelo</h2>
            
            <form action={formAction} method="post" class="space-y-4" id="model-form">
              
              {/* Name */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Modelo *</label>
                <input 
                  type="text" 
                  id="input-name" 
                  name="name" 
                  value={formData.name} 
                  placeholder="Ex: Isabella Martinez" 
                  required
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" 
                />
              </div>

              {/* Slug */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug (URL)</label>
                <div class="flex items-center">
                  <span class="text-gray-500 text-sm mr-2">/models/</span>
                  <input 
                    type="text" 
                    id="input-slug" 
                    name="slug" 
                    value={formData.slug} 
                    placeholder="isabella-martinez" 
                    class="flex-1 px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <p class="text-[10px] text-gray-500 mt-1">Deixe em branco para gerar automaticamente a partir do nome.</p>
              </div>

              {/* Description */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descrição</label>
                <textarea 
                  id="input-description" 
                  name="description" 
                  rows={3}
                  placeholder="Uma breve descrição sobre o modelo..."
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none resize-none"
                >{formData.description}</textarea>
              </div>

              <hr class="border-white/10 my-4" />

              <h3 class="text-white font-bold text-sm uppercase tracking-wider">Imagens</h3>

              {/* Thumbnail URL */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Imagem Principal (Thumbnail) *</label>
                <input 
                  type="text" 
                  id="input-thumbnail" 
                  name="thumbnailUrl" 
                  value={formData.thumbnailUrl} 
                  required
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" 
                />
                <p class="text-[10px] text-gray-500 mt-1">Recomendado: 400x600 (3:4) para melhor exibição no grid.</p>
              </div>

              {/* Icon URL */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avatar (Ícone)</label>
                <input 
                  type="text" 
                  id="input-icon" 
                  name="iconUrl" 
                  value={formData.iconUrl} 
                  placeholder="https://..."
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" 
                />
                <p class="text-[10px] text-gray-500 mt-1">Imagem circular para perfil. Recomendado: 200x200.</p>
              </div>

              {/* Banner URL */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Banner (Capa do Perfil)</label>
                <input 
                  type="text" 
                  id="input-banner" 
                  name="bannerUrl" 
                  value={formData.bannerUrl}
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" 
                />
                <p class="text-[10px] text-gray-500 mt-1">Banner de capa para página de perfil. Recomendado: 1920x600.</p>
              </div>

              <hr class="border-white/10 my-4" />

              <h3 class="text-white font-bold text-sm uppercase tracking-wider">Configurações de Publicidade</h3>

              {/* External URL */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Externo (CTA)</label>
                <input 
                  type="text" 
                  id="input-external" 
                  name="externalUrl" 
                  value={formData.externalUrl} 
                  placeholder="https://link-para-onde-redirecionar.com"
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none" 
                />
                <p class="text-[10px] text-gray-500 mt-1">Link para onde o usuário será redirecionado ao clicar (para anúncios).</p>
              </div>

              {/* Status */}
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select 
                  id="input-status" 
                  name="status" 
                  class="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded text-white focus:border-primary focus:outline-none appearance-none"
                >
                  <option value="active" selected={formData.status === 'active'}>Ativo</option>
                  <option value="hidden" selected={formData.status === 'hidden'}>Oculto</option>
                  <option value="draft" selected={formData.status === 'draft'}>Rascunho</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div class="flex gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="input-featured" 
                    name="isFeatured" 
                    value="true"
                    checked={formData.isFeatured}
                    class="w-4 h-4 rounded border-white/20 bg-[#0a0a0a] text-primary focus:ring-primary"
                  />
                  <span class="text-sm text-gray-300">Destaque</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="input-advertiser" 
                    name="isAdvertiser" 
                    value="true"
                    checked={formData.isAdvertiser}
                    class="w-4 h-4 rounded border-white/20 bg-[#0a0a0a] text-primary focus:ring-primary"
                  />
                  <span class="text-sm text-gray-300">Modelo Publicitário (ADS)</span>
                </label>
              </div>

              <div class="pt-4 flex gap-3">
                <Button variant="primary" className="flex-1" type="submit">
                  {isEditing ? 'Salvar Alterações' : 'Criar Modelo'}
                </Button>
                <a href="/admin/models" class="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded text-sm font-bold uppercase transition-colors">
                  Cancelar
                </a>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEWS */}
        <div class="w-full lg:w-3/5">
          <div class="sticky top-6 space-y-6">
            
            {/* PREVIEW: MODEL CARD */}
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-white font-display uppercase tracking-widest text-sm">Preview - Card do Modelo</h3>
                <span class="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded uppercase font-bold">Ao Vivo</span>
              </div>

              <div class="bg-black/50 border border-white/5 rounded-xl p-8 pattern-grid">
                <div class="max-w-[200px] mx-auto">
                  <div id="preview-card" class="group relative w-full aspect-[3/4] rounded-md overflow-hidden cursor-pointer block bg-gray-900 border border-white/5 hover:border-primary/50 transition-all duration-300">
                    
                    {/* Image Layer */}
                    <img 
                      id="preview-card-image"
                      src={formData.thumbnailUrl} 
                      alt="Preview" 
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    
                    {/* Gradient Overlay */}
                    <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

                    {/* Content */}
                    <div class="absolute bottom-0 left-0 w-full p-3 z-20">
                      <h3 id="preview-card-name" class="text-white text-sm md:text-base font-bold truncate capitalize shadow-black drop-shadow-md">
                        {formData.name || 'Nome do Modelo'}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW: PROFILE PAGE */}
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-white font-display uppercase tracking-widest text-sm">Preview - Página de Perfil</h3>
                <span class="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded uppercase font-bold">Simulação</span>
              </div>

              <div class="bg-[#050505] border border-white/5 rounded-xl overflow-hidden">
                {/* Banner */}
                <div class="relative h-32 md:h-40 overflow-hidden">
                  <img 
                    id="preview-profile-banner"
                    src={formData.bannerUrl}
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
                </div>
                
                {/* Profile Info */}
                <div class="px-6 -mt-12 relative z-10">
                  <div class="flex items-end gap-4">
                    {/* Avatar */}
                    <div class="w-20 h-20 rounded-full border-4 border-[#050505] overflow-hidden bg-gray-800">
                      <img 
                        id="preview-profile-icon"
                        src={formData.iconUrl || formData.thumbnailUrl}
                        class="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Name & Stats */}
                    <div class="flex-1 pb-2">
                      <h2 id="preview-profile-name" class="text-white font-display text-xl font-bold">
                        {formData.name || 'Nome do Modelo'}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div class="mt-4 pb-6">
                    <p id="preview-profile-description" class="text-gray-400 text-sm line-clamp-2">
                      {formData.description || 'Descrição do modelo aparecerá aqui...'}
                    </p>
                    
                    {/* CTA Button (if external URL) */}
                    <div id="preview-cta-container" class={formData.externalUrl ? '' : 'hidden'}>
                      <a 
                        id="preview-cta-link"
                        href={formData.externalUrl || '#'}
                        class="mt-4 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-primary/80 transition-colors"
                      >
                        <span>Ver Mais</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CLIENT-SIDE SCRIPT FOR LIVE PREVIEW */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
            // Inputs
            const nameInput = document.getElementById('input-name');
            const slugInput = document.getElementById('input-slug');
            const descInput = document.getElementById('input-description');
            const thumbnailInput = document.getElementById('input-thumbnail');
            const iconInput = document.getElementById('input-icon');
            const bannerInput = document.getElementById('input-banner');
            const externalInput = document.getElementById('input-external');

            // Preview Elements - Card
            const cardImage = document.getElementById('preview-card-image');
            const cardName = document.getElementById('preview-card-name');

            // Preview Elements - Profile
            const profileBanner = document.getElementById('preview-profile-banner');
            const profileIcon = document.getElementById('preview-profile-icon');
            const profileName = document.getElementById('preview-profile-name');
            const profileDescription = document.getElementById('preview-profile-description');
            const ctaContainer = document.getElementById('preview-cta-container');
            const ctaLink = document.getElementById('preview-cta-link');

            function updatePreview() {
                const name = nameInput.value || 'Nome do Modelo';
                const description = descInput.value || 'Descrição do modelo aparecerá aqui...';
                const thumbnail = thumbnailInput.value;
                const icon = iconInput.value || thumbnail;
                const banner = bannerInput.value;
                const externalUrl = externalInput.value;

                // Update Card Preview
                if (cardImage) cardImage.src = thumbnail;
                if (cardName) cardName.textContent = name;

                // Update Profile Preview
                if (profileBanner) profileBanner.src = banner;
                if (profileIcon) profileIcon.src = icon;
                if (profileName) profileName.textContent = name;
                if (profileDescription) profileDescription.textContent = description;

                // Update CTA
                if (ctaContainer) {
                    ctaContainer.classList.toggle('hidden', !externalUrl);
                }
                if (ctaLink) {
                    ctaLink.href = externalUrl || '#';
                }
            }

            // Auto-generate slug from name
            function generateSlug(name) {
                return name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\\u0300-\\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            }

            nameInput.addEventListener('input', () => {
                // Only auto-generate if slug is empty
                if (!slugInput.value) {
                    slugInput.placeholder = generateSlug(nameInput.value) || 'slug-automatico';
                }
                updatePreview();
            });

            // Add listeners to all inputs
            [nameInput, slugInput, descInput, thumbnailInput, iconInput, bannerInput, externalInput].forEach(input => {
                if (input) input.addEventListener('input', updatePreview);
                if (input) input.addEventListener('change', updatePreview);
            });

            // Initial update
            updatePreview();
        });
      `}} />
    </AdminLayout>
  );
};
