import { FC } from 'hono/jsx';

interface OrderBumpProps {
  priceFormatted: string;
}

export const OrderBump: FC<OrderBumpProps> = ({ priceFormatted }) => {
  return (
    <div class="relative mb-8">
        <label class="cursor-pointer block">
        <input type="checkbox" name="order_bump" id="order_bump" class="bump-box peer sr-only" />
        <div class="border border-white/20 bg-gradient-to-r from-[#1a1a1a] to-black p-5 rounded-xl transition-all peer-checked:border-gold peer-checked:bg-gradient-to-r peer-checked:from-[#1a1a1a] peer-checked:to-[#2a2200] hover:border-white/30">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded border border-gray-500 peer-checked:bg-gold peer-checked:border-gold flex items-center justify-center mt-1 transition-colors">
                    <svg class="w-4 h-4 text-black opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                    <h4 class="font-display text-lg text-white peer-checked:text-gold flex items-center gap-2">
                        QUERO ACESSO AO GRUPO VIP (Telegram)
                        <span class="text-[10px] bg-red-600 text-white px-2 rounded-full py-0.5">OFERTA ÚNICA</span>
                    </h4>
                    <p class="text-gray-400 text-sm mt-1 leading-relaxed">
                        Tenha acesso antecipado a conteúdos, pedidos exclusivos e chat direto com as modelos. De <span class="line-through">R$ 49,90</span> por apenas <span class="text-white font-bold">{priceFormatted}</span>.
                    </p>
                </div>
            </div>
        </div>
        </label>
    </div>
  );
};