import { FC } from 'hono/jsx';

export const AgeVerificationModal: FC = () => {
  return (
    <div 
      id="age-verification-modal"
      class="fixed inset-0 hidden items-center justify-center p-4"
      style="z-index: 999999 !important;"
    >
      {/* Backdrop with Blur */}
      <div class="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300"></div>

      {/* Modal Card */}
      <div class="relative w-full max-w-[400px] bg-[#121212] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(138,43,226,0.3)] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div class="p-8 pb-4 text-center flex flex-col items-center">
            {/* 18+ Icon (Adapted SVG) */}
            <div class="mb-5 relative group">
                <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
                <svg width="64" height="64" viewBox="0 0 54 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="relative z-10 drop-shadow-[0_0_10px_rgba(138,43,226,0.5)]">
                    {/* Background shapes changed to match theme */}
                    <path d="M12.7807 2.29511V27.4257H4.3081V8.68546H0V2.29511H12.7807Z" fill="white"></path>
                    <path d="M34.8945 14.1783C35.9715 14.8484 36.7972 15.6741 37.3716 16.6554C37.97 17.6128 38.2691 18.7137 38.2691 19.9583C38.2691 21.5619 37.7905 22.974 36.8331 24.1946C35.8997 25.4152 34.5714 26.3606 32.8481 27.0308C31.1488 27.677 29.1982 28.0001 26.9963 28.0001C24.7944 28.0001 22.8318 27.677 21.1086 27.0308C19.4092 26.3606 18.0809 25.4152 17.1236 24.1946C16.1901 22.974 15.7234 21.5619 15.7234 19.9583C15.7234 18.7137 16.0106 17.6128 16.5851 16.6554C17.1834 15.6741 18.0211 14.8484 19.0981 14.1783C17.4467 12.8619 16.621 11.2105 16.621 9.22397C16.621 7.71614 17.0518 6.39977 17.9134 5.27488C18.7989 4.14999 20.0196 3.2764 21.5753 2.65412C23.1549 2.03184 24.9619 1.7207 26.9963 1.7207C29.0307 1.7207 30.8257 2.03184 32.3814 2.65412C33.961 3.2764 35.1817 4.14999 36.0433 5.27488C36.9288 6.39977 37.3716 7.71614 37.3716 9.22397C37.3716 11.2105 36.5459 12.8619 34.8945 14.1783ZM26.9963 7.42893C26.3979 7.42893 25.9073 7.6204 25.5244 8.00334C25.1653 8.38628 24.9858 8.91283 24.9858 9.58298C24.9858 10.2531 25.1653 10.7797 25.5244 11.1626C25.9073 11.5456 26.3979 11.737 26.9963 11.737C27.5946 11.737 28.0733 11.5456 28.4323 11.1626C28.8153 10.7797 29.0067 10.2531 29.0067 9.58298C29.0067 8.91283 28.8153 8.38628 28.4323 8.00334C28.0733 7.6204 27.5946 7.42893 26.9963 7.42893ZM26.9963 22.2919C27.81 22.2919 28.4682 22.0525 28.9708 21.5738C29.4974 21.0952 29.7606 20.4609 29.7606 19.6711C29.7606 18.8813 29.4974 18.247 28.9708 17.7684C28.4682 17.2897 27.81 17.0503 26.9963 17.0503C26.1825 17.0503 25.5124 17.2897 24.9858 17.7684C24.4832 18.247 24.2319 18.8813 24.2319 19.6711C24.2319 20.4609 24.4832 21.0952 24.9858 21.5738C25.5124 22.0525 26.1825 22.2919 26.9963 22.2919Z" fill="white"></path>
                    <path d="M52.1901 12.6725H45.9434V18.7756H41.3122V12.6725H35.1013V8.29259H41.3122V2.18945H45.9434V8.29259H52.1901V12.6725Z" fill="white"></path>
                    {/* The plus sign background */}
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M54 12.6721C54 13.8811 53.3991 14.8612 52.1901 14.8612H48.1324V18.7752C48.1324 19.9842 47.1523 20.9643 45.9433 20.9643H41.3121C40.1032 20.9643 39.1231 19.9842 39.1231 18.7752V14.8612H35.1013C33.8923 14.8612 32.9122 13.8811 32.9122 12.6721V8.29221C32.9122 7.08322 33.8923 6.10314 35.1013 6.10314H39.1231V2.18907C39.1231 0.980081 40.1032 0 41.3121 0H45.9433C47.1523 0 48.1324 0.980081 48.1324 2.18907V6.10314H52.1901C53.3991 6.10314 54 7.08322 54 8.29221V12.6721ZM45.9433 8.29221V2.18907H41.3121V8.29221H35.1013V12.6721H41.3121V18.7752H45.9433V12.6721H52.1901V8.29221H45.9433Z" fill="#8A2BE2" fill-opacity="0.8"></path>
                </svg>
            </div>
            
            <h2 class="text-3xl font-display text-white tracking-wide">
                CONTEÚDO <br/>
                <span class="text-primary text-4xl drop-shadow-neon-purple">ADULTO</span>
            </h2>
        </div>

        {/* Content Section */}
        <div class="px-8 space-y-6">
            <p class="text-gray-300 text-center font-body text-sm leading-relaxed">
                Entendo que o site <strong class="text-white">CreatorFlix</strong> apresenta <strong class="text-white">conteúdo explícito</strong> destinado a <strong class="text-white">adultos</strong>.
            </p>

            <div class="bg-white/5 rounded-lg p-4 border border-white/5">
                <p class="text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Aviso de Cookies</p>
                <p class="text-xs text-gray-500">
                    Nós usamos cookies e outras tecnologias semelhantes para melhorar a sua experiência em nosso site.
                </p>
            </div>

            <div class="text-[10px] text-center text-gray-600">
                 A profissão de acompanhante é legalizada no Brasil e deve ser respeitada. <br/>
                 <a href="/terms" class="text-gray-500 underline hover:text-primary transition-colors">Termos de uso</a>
            </div>
        </div>

        {/* Action Section */}
        <div class="p-8 pt-6">
            <button 
                id="age-confirm-btn"
                class="w-full bg-gradient-to-r from-primary to-purple-800 hover:from-primary/90 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-neon-purple hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest text-sm"
            >
                Concordo
            </button>
        </div>

      </div>

      <script dangerouslySetInnerHTML={{__html: `
        (function() {
            const modal = document.getElementById('age-verification-modal');
            const btn = document.getElementById('age-confirm-btn');
            const storageKey = 'creatorflix-age-verified-v1';

            // Check if verified
            if (!localStorage.getItem(storageKey)) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }

            // Handle confirm
            btn.addEventListener('click', function() {
                localStorage.setItem(storageKey, 'true');
                modal.classList.add('opacity-0');
                
                // Allow animation to finish before hiding
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = '';
                }, 300);
            });
        })();
      `}} />
    </div>
  );
};
