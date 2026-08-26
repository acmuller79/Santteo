import React from 'react';
import {
  MessageCircle,
  Beer,
  Calculator,
  BookOpen,
  Instagram,
  MapPin,
  Wrench,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DistributorConfig } from '../types';
import { buildDirectWhatsAppUrl } from '../utils/whatsapp';

interface QuickActionLinksProps {
  config: DistributorConfig;
  onOpenOrder: () => void;
  onOpenCalculator: () => void;
  onOpenCatalog: () => void;
  onOpenPix: () => void;
}

export const QuickActionLinks: React.FC<QuickActionLinksProps> = ({
  config,
  onOpenOrder,
  onOpenCalculator,
  onOpenCatalog,
  onOpenPix,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageCircle':
        return <MessageCircle className="w-6 h-6 text-emerald-400" />;
      case 'Beer':
        return <Beer className="w-6 h-6 text-amber-400" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-blue-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-amber-300" />;
      case 'Instagram':
        return <Instagram className="w-6 h-6 text-pink-400" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-red-400" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-orange-400" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-emerald-300" />;
      default:
        return <MessageCircle className="w-6 h-6 text-amber-400" />;
    }
  };

  const salesWhatsAppUrl = buildDirectWhatsAppUrl(
    config.primaryPhone,
    'Olá! Estou no site e gostaria de fazer um pedido de chopp / tirar dúvidas com um atendente.'
  );

  const techSupportWhatsAppUrl = buildDirectWhatsAppUrl(
    config.supportPhone || config.primaryPhone,
    'Olá! Preciso de auxílio técnico ou suporte referente à chopeira durante meu evento.'
  );

  const instagramUrl = `https://instagram.com/${config.instagramUser.replace('@', '')}`;

  return (
    <section id="quick-links-section" className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Acesso Rápido & Atendimento
        </h2>
        <span className="text-[11px] text-stone-400">Clique para ir direto</span>
      </div>

      <div className="space-y-3">
        {/* 1. WhatsApp Vendas & Atendimento (Super Highlight) */}
        <a
          id="link-whatsapp-sales"
          href={salesWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-stone-900 border-2 border-emerald-500/40 hover:border-emerald-400 text-white shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  WhatsApp - Vendas & Pedidos
                </span>
                <span className="bg-emerald-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Online
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Fale agora com nosso atendente para orçamentos e agendamento
              </p>
            </div>
          </div>
          <div className="flex items-center text-emerald-400 pl-2">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* 2. Simulador / Monte seu Pedido */}
        <button
          id="link-order-builder"
          onClick={onOpenOrder}
          className="w-full text-left group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-900 border border-amber-500/40 hover:border-amber-400 text-white shadow-lg shadow-amber-950/30 transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Beer className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  Monte seu Pedido de Chopp
                </span>
                <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                  Rápido
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Escolha o barril, chopeira e envie pronto no WhatsApp
              </p>
            </div>
          </div>
          <div className="flex items-center text-amber-400 pl-2">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 3. Calculadora de Chopp para Festas */}
        <button
          id="link-calculator"
          onClick={onOpenCalculator}
          className="w-full text-left group relative flex items-center justify-between p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-blue-500/50 text-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                Calculadora de Chopp p/ Eventos
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Descubra quantos litros você precisa para seu churrasco ou festa
              </p>
            </div>
          </div>
          <div className="flex items-center text-stone-400 group-hover:text-blue-400 pl-2">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 4. Catálogo Completo de Barris */}
        <button
          id="link-catalog"
          onClick={onOpenCatalog}
          className="w-full text-left group relative flex items-center justify-between p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 text-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                Ver Cardápio & Tabela de Preços
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Pilsen, IPA, Chopp de Vinho, Weiss, Escuro e barris 30L / 50L
              </p>
            </div>
          </div>
          <div className="flex items-center text-stone-400 group-hover:text-amber-400 pl-2">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* 5. Instagram */}
        <a
          id="link-instagram"
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-pink-500/50 text-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Instagram className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white group-hover:text-pink-300 transition-colors">
                  Instagram Oficial
                </span>
                <span className="text-xs text-pink-400/90 font-mono">@{config.instagramUser.replace('@', '')}</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Veja fotos de eventos, vídeos e depoimentos de clientes
              </p>
            </div>
          </div>
          <div className="flex items-center text-stone-400 group-hover:text-pink-400 pl-2">
            <ExternalLink className="w-5 h-5" />
          </div>
        </a>

        {/* 6. Localização & Como Chegar */}
        <a
          id="link-google-maps"
          href={config.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-red-500/50 text-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-red-400" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base text-white group-hover:text-red-300 transition-colors">
                Localização / Rota no Google Maps
              </span>
              <p className="text-xs text-stone-400 mt-0.5 truncate">
                {config.address} • {config.cityState}
              </p>
            </div>
          </div>
          <div className="flex items-center text-stone-400 group-hover:text-red-400 pl-2 shrink-0">
            <ExternalLink className="w-5 h-5" />
          </div>
        </a>

        {/* 7. Plantão Técnico de Chopeiras */}
        <a
          id="link-tech-support"
          href={techSupportWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-orange-500/50 text-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <span className="font-bold text-base text-white group-hover:text-orange-300 transition-colors">
                Plantão & Suporte Técnico de Chopeiras
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Dúvidas sobre regulagem de pressão, temperatura ou emergências
              </p>
            </div>
          </div>
          <div className="flex items-center text-stone-400 group-hover:text-orange-400 pl-2">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* 8. Chave PIX & Formas de Pagamento */}
        <button
          id="link-pix-modal"
          onClick={onOpenPix}
          className="w-full text-left group relative flex items-center justify-between p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-emerald-500/50 text-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                Chave PIX & Formas de Pagamento
              </span>
              <p className="text-xs text-stone-400 mt-0.5">
                Consulte dados bancários, parcelamento no cartão e descontos
              </p>
            </div>
          </div>
          <div className="flex items-center text-stone-400 group-hover:text-emerald-400 pl-2">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};
