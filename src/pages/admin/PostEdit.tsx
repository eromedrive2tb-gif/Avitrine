import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Alert } from '../../components/atoms/Alert';

interface Model {
  id: number;
  name: string;
  slug: string | null;
}

interface PostFormData {
  title?: string;
  contentUrl: string;
  type: 'image' | 'video';
}

interface PostEditPageProps {
  model: Model;
  formData: PostFormData;
  isEditing: boolean;
  postId?: number;
  error?: string;
  success?: string;
}

export const AdminPostEdit: FC<PostEditPageProps> = ({ 
  model, 
  formData, 
  isEditing, 
  postId,
  error,
  success 
}) => {
  const formAction = isEditing 
    ? `/admin/models/${model.id}/posts/${postId}/update` 
    : `/admin/models/${model.id}/posts/create`;

  return (
    <AdminLayout title={`${isEditing ? 'Editar' : 'Novo'} Post - ${model.name}`} breadcrumbs={[
      { label: 'Início', href: '/admin' },
      { label: 'Modelos', href: '/admin/models' },
      { label: model.name, href: `/admin/models/${model.id}` },
      { label: 'Posts', href: `/admin/models/${model.id}/posts` },
      { label: isEditing ? 'Editar Post' : 'Novo Post', href: '#' }
    ]}>
      <div class="max-w-4xl mx-auto">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">
            {isEditing ? 'Editar Post' : 'Novo Post'}
          </h1>
          <p class="text-gray-400">
            {isEditing 
              ? `Editando post da modelo "${model.name}"` 
              : `Criando novo post para a modelo "${model.name}"`}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} />
        )}
        {success && (
          <Alert type="success" message={success} />
        )}

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div class="bg-surface rounded-xl border border-white/5 p-6">
            <form method="POST" action={formAction} class="space-y-6">
              {/* Type Selection */}
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Conteúdo *
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <label class={`cursor-pointer rounded-lg border p-4 text-center transition-colors ${
                    formData.type === 'image' 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/20'
                  }`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="image" 
                      checked={formData.type === 'image'}
                      class="sr-only"
                    />
                    <div class="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      <span class="text-sm font-medium">Imagem</span>
                    </div>
                  </label>
                  
                  <label class={`cursor-pointer rounded-lg border p-4 text-center transition-colors ${
                    formData.type === 'video' 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                      : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/20'
                  }`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="video" 
                      checked={formData.type === 'video'}
                      class="sr-only"
                    />
                    <div class="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                      </svg>
                      <span class="text-sm font-medium">Vídeo</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
                  Título do Post
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  placeholder="Digite um título para o post (opcional)"
                  class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p class="mt-1 text-xs text-gray-500">
                  O título é opcional. Se não informado, será usado "Post sem título".
                </p>
              </div>

              {/* Content URL */}
              <div>
                <label for="contentUrl" class="block text-sm font-medium text-gray-300 mb-2">
                  URL do Conteúdo *
                </label>
                <input
                  type="url"
                  id="contentUrl"
                  name="contentUrl"
                  value={formData.contentUrl}
                  placeholder="https://exemplo.com/imagem.jpg ou https://exemplo.com/video.mp4"
                  required
                  class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  onInput={(e) => {
                    // Atualizar preview em tempo real
                    const url = e.currentTarget.value;
                    const previewImg = document.getElementById('preview-image') as HTMLImageElement;
                    const placeholder = document.getElementById('preview-placeholder');
                    const errorDiv = document.getElementById('preview-error');
                    
                    if (url && previewImg) {
                      previewImg.src = url;
                      previewImg.style.display = 'block';
                      if (placeholder) placeholder.style.display = 'none';
                      if (errorDiv) errorDiv.classList.add('hidden');
                    } else if (placeholder) {
                      placeholder.style.display = 'flex';
                      if (previewImg) previewImg.style.display = 'none';
                      if (errorDiv) errorDiv.classList.add('hidden');
                    }
                  }}
                />
                <p class="mt-1 text-xs text-gray-500">
                  Insira a URL direta da imagem ou vídeo. Formatos suportados: JPG, PNG, GIF, MP4, etc.
                </p>
              </div>

              {/* Actions */}
              <div class="flex gap-3 pt-4">
                <a 
                  href={`/admin/models/${model.id}/posts`}
                  class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </a>
                <button
                  type="submit"
                  class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex-1"
                >
                  {isEditing ? 'Atualizar Post' : 'Criar Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div class="bg-surface rounded-xl border border-white/5 p-6">
            <h3 class="text-lg font-bold text-white mb-4">Pré-visualização</h3>
            
            <div class="space-y-6">
              {/* Post Preview Card */}
              <div class="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                <div class="aspect-square bg-gray-800 relative">
                  {formData.contentUrl ? (
                    formData.type === 'image' ? (
                      <img 
                        id="preview-image"
                        src={formData.contentUrl} 
                        alt="Preview" 
                        class="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const errorDiv = document.getElementById('preview-error');
                          if (errorDiv) errorDiv.classList.remove('hidden');
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'block';
                          const errorDiv = document.getElementById('preview-error');
                          if (errorDiv) errorDiv.classList.add('hidden');
                        }}
                      />
                    ) : (
                      <div class="w-full h-full flex items-center justify-center bg-black/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                        </svg>
                      </div>
                    )
                  ) : (
                    <div id="preview-placeholder" class="w-full h-full flex items-center justify-center bg-gray-900">
                      <div class="text-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 opacity-20">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        <p class="text-sm">Insira uma URL para pré-visualizar</p>
                      </div>
                    </div>
                  )}
                  <div id="preview-error" class="hidden w-full h-full flex items-center justify-center bg-black/50">
                    <div class="text-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2">
                        <path d="m21.5 8-7 7L13 13.5a2.5 2.5 0 0 1-5 0L6.5 12 3 15.5"/>
                        <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <p class="text-xs">Imagem não encontrada</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-4">
                  <h4 class="font-medium text-white truncate">
                    {formData.title || 'Post sem título'}
                  </h4>
                  <div class="flex items-center justify-between mt-2">
                    <span class={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                      formData.type === 'image' 
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                        : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                    }`}>
                      {formData.type === 'image' ? '📷 Imagem' : '🎬 Vídeo'}
                    </span>
                    <span class="text-xs text-gray-500">Publicado</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div class="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                <h4 class="text-blue-400 font-medium mb-2">ℹ️ Informações Importantes</h4>
                <ul class="text-sm text-blue-300 space-y-1">
                  <li>• Posts administrativos não possuem likes ou comentários</li>
                  <li>• A data de criação será registrada automaticamente</li>
                  <li>• O post ficará visível imediatamente após a criação</li>
                  <li>• Certifique-se de que a URL do conteúdo é acessível publicamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};