import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';

export const ModelsPage: FC = () => {
  // Mock data generator for 8+ models
  const models = Array.from({ length: 12 }).map((_, i) => ({
    name: `Model ${i + 1}`,
    imageUrl: `https://placehold.co/400x600/${20 + i}/fff?text=Model+${i+1}`,
    category: i % 2 === 0 ? "Fitness" : "Cosplay",
    isLive: i === 0 || i === 5
  }));

  return (
    <Layout title="Explorar Modelos - CreatorFlix">
      <section class="py-12 bg-[#0B2641]">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <h1 class="text-4xl font-bold mb-4">Nossas Criadoras</h1>
            <p class="text-gray-400 max-w-2xl mx-auto">
              Explore milhares de conteúdos exclusivos de criadoras de todo o mundo.
            </p>
          </div>

          {/* Filters (Molecule-ish) */}
          <div class="flex flex-wrap gap-4 justify-center mb-12">
            {['Todas', 'Populares', 'Novas', 'Live Now', 'Fitness', 'Cosplay'].map((filter, i) => (
              <button class={`px-5 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-[#A37CFF] text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                {filter}
              </button>
            ))}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {models.map((model) => (
              <ModelCard {...model} />
            ))}
          </div>

          {/* Pagination */}
          <div class="flex justify-center mt-16 gap-2">
            <button class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">{'<'}</button>
            <button class="w-10 h-10 rounded-lg bg-[#A37CFF] text-white flex items-center justify-center shadow-lg shadow-purple-500/20">1</button>
            <button class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">2</button>
            <button class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">3</button>
            <span class="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
            <button class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">{'>'}</button>
          </div>
        </div>
      </section>
    </Layout>
  );
};
