import React from 'react';
import { Beer, Settings, Share2, PhoneCall, Sparkles, MapPin } from 'lucide-react';
import { DistributorConfig } from '../types';
import { buildDirectWhatsAppUrl, formatPhoneDisplay } from '../utils/whatsapp';

interface HeaderProps {
  config: DistributorConfig;
  onOpenSettings: () => void;
  onOpenOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onOpenSettings, onOpenOrder }) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.name,
          text: `${config.name} - ${config.tagline}`,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const directWhatsAppUrl = buildDirectWhatsAppUrl(
    config.primaryPhone,
    'Olá! Gostaria de consultar a disponibilidade de chopp e fazer um orçamento.'
  );

  return (
    <header id="main-header" className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white border-b border-amber-500/20 shadow-xl">
      {/* Subtle glowing ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

      {/* Top utility bar */}
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between text-xs text-stone-400 border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-400">Atendimento Online</span>
          <span className="hidden sm:inline text-stone-500">•</span>
          <span className="hidden sm:inline text-stone-400">Entrega rápida e chopeiras elétricas</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-share-page"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Compartilhar página"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            title="Personalizar dados da distribuidora (WhatsApp, nome, redes)"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Configurações</span>
          </button>
        </div>
      </div>

      {/* Hero profile container */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 text-center relative z-10">
        {/* Brand Icon / Logo Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 shadow-2xl shadow-amber-500/25 ring-4 ring-stone-800">
            <div className="w-full h-full bg-stone-950 rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <>
                  {/* Foam aesthetic effect */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-100 to-amber-200/90 rounded-t-[22px] flex items-center justify-center">
                    <div className="w-full h-1 bg-white/40 rounded-full" />
                  </div>
                  <Beer className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mt-2 stroke-[1.8]" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300/80 mt-1">CHOPP</span>
                </>
              )}
            </div>
          </div>

          <div className="absolute -bottom-2 -right-1 bg-emerald-500 text-stone-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 border border-stone-900">
            <Sparkles className="w-2.5 h-2.5" />
            OFICIAL
          </div>
        </div>

        {/* Distributor Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 font-display">
          {config.name}
        </h1>

        <p className="text-sm sm:text-base text-amber-400 font-medium max-w-xl mx-auto mb-2">
          {config.tagline}
        </p>

        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto mb-6">
          {config.slogan}
        </p>

        {/* Quick Address / Location Pill */}
        <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 bg-stone-900/90 border border-stone-800 px-3.5 py-1.5 rounded-full mb-6 max-w-full truncate">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{config.address} • {config.cityState}</span>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <a
            id="btn-header-whatsapp"
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-950 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-stone-950"></span>
            </span>
            <span>Chamar no WhatsApp</span>
            <span className="text-[11px] opacity-80 font-normal">({formatPhoneDisplay(config.primaryPhone)})</span>
          </a>

          <button
            id="btn-header-order"
            onClick={onOpenOrder}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Beer className="w-4 h-4" />
            <span>Monte seu Pedido</span>
          </button>
        </div>
      </div>
    </header>
  );
};
