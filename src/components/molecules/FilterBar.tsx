import { FC } from 'hono/jsx';

export const FilterBar: FC = () => {
  return (
    <div class="sticky top-16 z-40 bg-[#050505]/95 backdrop-blur border-b border-white/5 py-3 px-4 md:px-6 shadow-lg">
      <div class="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Title & Count */}
          <div class="flex items-center gap-3 w-full md:w-auto">
              <h1 class="font-display text-2xl text-white">Modelos</h1>
              <span class="text-xs font-bold text-gray-500 bg-white/10 px-2 py-0.5 rounded">12,450+</span>
          </div>

          {/* Quick Filters */}
          <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
              <select class="bg-[#121212] border border-white/10 text-white text-xs font-bold uppercase py-2 px-4 rounded-full focus:outline-none focus:border-primary">
                  <option>Recomendados</option>
                  <option>Mais Populares</option>
                  <option>Novas</option>
              </select>
              
              <div class="h-6 w-px bg-white/10 mx-2 flex-shrink-0"></div>

              {['Brasileiras', 'Live Now', '4K', 'VR'].map(tag => (
                  <button class="px-4 py-2 rounded-full bg-[#121212] border border-white/5 text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 whitespace-nowrap transition-colors">
                      {tag}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};
