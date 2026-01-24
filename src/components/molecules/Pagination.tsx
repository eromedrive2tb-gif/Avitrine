import { FC } from 'hono/jsx';

interface PaginationProps {
  currentPage: number;
  totalPages?: number; // Optional if unknown (like S3)
  nextUrl?: string;
  prevUrl?: string;
  baseUrl?: string;
  showingFrom?: number;
  showingTo?: number;
  totalItems?: number | string;
}

export const Pagination: FC<PaginationProps> = ({ 
  currentPage, 
  totalPages = 1, 
  nextUrl, 
  prevUrl,
  baseUrl,
  showingFrom,
  showingTo,
  totalItems 
}) => {
  const finalPrevUrl = prevUrl || (baseUrl && currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : undefined);
  const finalNextUrl = nextUrl || (baseUrl && totalPages && currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : undefined);

  return (
    <div class="px-6 py-4 border-t border-white/5 bg-[#1a1a1a] flex items-center justify-between">
      <div class="text-xs text-gray-500">
        {showingFrom && showingTo ? (
          <>Mostrando <span class="font-bold text-white">{showingFrom}</span> a <span class="font-bold text-white">{showingTo}</span> de <span class="font-bold text-white">{totalItems || 'muitos'}</span> resultados</>
        ) : (
          <>Página <span class="font-bold text-white">{currentPage}</span> de <span class="font-bold text-white">{totalPages}</span></>
        )}
      </div>

      <div class="flex items-center gap-2">
        {/* Previous */}
        {finalPrevUrl ? (
          <a href={finalPrevUrl} class="px-3 py-1.5 rounded bg-[#050505] border border-white/10 text-xs text-white hover:border-primary transition-colors">
            Anterior
          </a>
        ) : (
          <button disabled class="px-3 py-1.5 rounded bg-[#050505] border border-white/5 text-xs text-gray-600 cursor-not-allowed">
            Anterior
          </button>
        )}

        {/* Numbers (Mocked logic for simplicity if totalPages is small) */}
        {totalPages > 1 && (
            <div class="hidden sm:flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    const pageUrl = baseUrl ? `${baseUrl}?page=${pageNum}` : undefined;
                    
                    if (pageUrl) {
                      return (
                        <a href={pageUrl} class={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${isActive ? 'bg-primary text-white' : 'bg-transparent text-gray-400 hover:text-white'}`}>
                            {pageNum}
                        </a>
                      );
                    }

                    return (
                        <button class={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${isActive ? 'bg-primary text-white' : 'bg-transparent text-gray-400 hover:text-white'}`}>
                            {pageNum}
                        </button>
                    );
                })}
            </div>
        )}

        {/* Next */}
        {finalNextUrl ? (
          <a href={finalNextUrl} class="px-3 py-1.5 rounded bg-[#050505] border border-white/10 text-xs text-white hover:border-primary transition-colors">
            Próxima
          </a>
        ) : (
          <button disabled class="px-3 py-1.5 rounded bg-[#050505] border border-white/5 text-xs text-gray-600 cursor-not-allowed">
            Próxima
          </button>
        )}
      </div>
    </div>
  );
};
