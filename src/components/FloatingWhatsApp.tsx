import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DistributorConfig } from '../types';
import { buildDirectWhatsAppUrl } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  config: DistributorConfig;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ config }) => {
  const directWhatsAppUrl = buildDirectWhatsAppUrl(
    config.primaryPhone,
    'Olá! Vim através do site da distribuidora e gostaria de atendimento para fazer um pedido!'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      {/* Tooltip badge */}
      <div className="hidden sm:flex items-center gap-2 bg-stone-900/95 border border-emerald-500/40 text-stone-200 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-sm text-xs animate-bounce">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-emerald-400">Atendimento Rápido</span>
      </div>

      {/* Pulsing circular button */}
      <a
        id="btn-floating-whatsapp"
        href={directWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all transform hover:scale-110 active:scale-95"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
        <MessageCircle className="w-7 h-7 text-stone-950 stroke-[2.2]" />
      </a>
    </div>
  );
};
