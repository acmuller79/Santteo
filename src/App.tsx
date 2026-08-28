import React, { useState, useEffect } from 'react';
import {
  Beer,
  MessageCircle,
  Truck,
  Sparkles,
  PhoneCall,
  Instagram,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  Share2,
  Calendar,
  Settings,
  Award,
  Clock,
  Plus
} from 'lucide-react';
import { DistributorConfig, BeerProduct, TrustBadge } from './types';
import { DEFAULT_CONFIG, DEFAULT_BEERS, DEFAULT_TRUST_BADGES } from './data/defaultData';
import { Header } from './components/Header';
import { QuickActionLinks } from './components/QuickActionLinks';
import { OrderSimulator } from './components/OrderSimulator';
import { ChoppCalculator } from './components/ChoppCalculator';
import { BeerMenu } from './components/BeerMenu';
import { BusinessInfo } from './components/BusinessInfo';
import { ConfigModal } from './components/ConfigModal';
import { ProductEditModal } from './components/ProductEditModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { buildDirectWhatsAppUrl, formatPhoneDisplay } from './utils/whatsapp';

export default function App() {
  const [config, setConfig] = useState<DistributorConfig>(() => {
    try {
      const saved = localStorage.getItem('chopp_distributor_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Empório & Distribuidora de Chopp' || !parsed.logoUrl) {
          return { ...DEFAULT_CONFIG, ...parsed, name: 'Santtêo', logoUrl: DEFAULT_CONFIG.logoUrl };
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.warn('Error loading config from localStorage:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [beers, setBeers] = useState<BeerProduct[]>(() => {
    try {
      const saved = localStorage.getItem('chopp_distributor_beers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading beers from localStorage:', e);
    }
    return DEFAULT_BEERS;
  });

  // Modals state
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingBeer, setEditingBeer] = useState<BeerProduct | null>(null);
  const [selectedBeerIdForOrder, setSelectedBeerIdForOrder] = useState<string | undefined>();

  // Admin Authentication State (User 97538325, Pass 9725)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('santteo_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAdminAuth = (action: () => void) => {
    if (isAdminAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('santteo_admin_auth');
    } catch (e) {
      console.warn('Session storage error:', e);
    }
    setIsAdminAuthenticated(false);
    setIsSettingsOpen(false);
    setIsProductModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAuthModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleSaveConfig = (newConfig: DistributorConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('chopp_distributor_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Error saving config:', e);
    }
  };

  const handleSaveBeers = (newBeers: BeerProduct[]) => {
    setBeers(newBeers);
    try {
      localStorage.setItem('chopp_distributor_beers', JSON.stringify(newBeers));
    } catch (e) {
      console.error('Error saving beers:', e);
    }
  };

  const handleSaveSingleBeer = (savedBeer: BeerProduct) => {
    const exists = beers.some((b) => b.id === savedBeer.id);
    let updated: BeerProduct[];
    if (exists) {
      updated = beers.map((b) => (b.id === savedBeer.id ? savedBeer : b));
    } else {
      updated = [...beers, savedBeer];
    }
    handleSaveBeers(updated);
  };

  const handleDeleteSingleBeer = (beerId: string) => {
    const updated = beers.filter((b) => b.id !== beerId);
    handleSaveBeers(updated);
  };

  const handleOpenEditBeer = (beer: BeerProduct | null) => {
    setEditingBeer(beer);
    setIsProductModalOpen(true);
  };

  const handleSelectBeerForOrder = (beerId: string) => {
    setSelectedBeerIdForOrder(beerId);
    setIsOrderOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-5 h-5 text-amber-400 mb-1" />;
      case 'Beer':
        return <Beer className="w-5 h-5 text-amber-400 mb-1" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />;
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5 text-emerald-400 mb-1" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400 mb-1" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400 mb-1" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-blue-400 mb-1" />;
      default:
        return <Beer className="w-5 h-5 text-amber-400 mb-1" />;
    }
  };

  const promo = config.promoBanner;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Header Profile */}
      <Header
        config={config}
        onOpenSettings={() => requireAdminAuth(() => setIsSettingsOpen(true))}
        onOpenOrder={() => {
          setSelectedBeerIdForOrder(undefined);
          setIsOrderOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">
        {/* Promotional Highlight Banner (Editable) */}
        {promo?.enabled !== false && (
          <div className="mx-2 sm:mx-0 p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-yellow-500/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-black shadow-md">
                <Zap className="w-6 h-6 fill-stone-950" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-amber-300 block">
                  {promo?.title || 'Chopeira Elétrica Grátis nos Barris de 30L e 50L'}
                </span>
                <p className="text-xs text-stone-300 mt-0.5">
                  {promo?.subtitle || 'Levamos o kit completo regulado com CO2 e instalação no local da sua festa!'}
                </p>
              </div>
            </div>

            <button
              id="btn-banner-order"
              onClick={() => {
                setSelectedBeerIdForOrder(promo?.targetBeerId || beers[0]?.id || 'pilsen-puro-malte');
                setIsOrderOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md"
            >
              {promo?.buttonText || 'Aproveitar Promoção'}
            </button>
          </div>
        )}

        {/* Quick Link Hub (Primary requested action buttons) */}
        <QuickActionLinks
          config={config}
          onOpenOrder={() => {
            setSelectedBeerIdForOrder(undefined);
            setIsOrderOpen(true);
          }}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenCatalog={() => scrollToSection('beer-catalog-section')}
          onOpenPix={() => setIsPixModalOpen(true)}
        />

        {/* Trust Badges (Dynamic) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-2 sm:px-0 py-2">
          {(config.trustBadges && config.trustBadges.length > 0 ? config.trustBadges : DEFAULT_TRUST_BADGES).map(
            (badge) => (
              <div
                key={badge.id}
                className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-3 text-center flex flex-col items-center justify-center"
              >
                {renderBadgeIcon(badge.icon)}
                <span className="text-xs font-bold text-white">{badge.title}</span>
                <span className="text-[10px] text-stone-400">{badge.subtitle}</span>
              </div>
            )
          )}
        </section>

        {/* Full Beer Catalog with prices and IBU/ABV */}
        <BeerMenu
          beers={beers}
          config={config}
          onSelectBeerForOrder={handleSelectBeerForOrder}
          onEditBeer={(beer) => requireAdminAuth(() => handleOpenEditBeer(beer))}
          onAddNewBeer={() => requireAdminAuth(() => handleOpenEditBeer(null))}
        />

        {/* Business Details, Hours, Coverage, FAQ & PIX */}
        <BusinessInfo
          config={config}
          isOpenPixModal={isPixModalOpen}
          onClosePixModal={() => setIsPixModalOpen(false)}
        />
      </main>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp config={config} />

      {/* Modals */}
      <OrderSimulator
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        beers={beers}
        config={config}
        initialBeerId={selectedBeerIdForOrder}
      />

      <ChoppCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        config={config}
      />

      <ConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        beers={beers}
        onSaveConfig={handleSaveConfig}
        onSaveBeers={handleSaveBeers}
        onLogout={handleAdminLogout}
        onOpenProductModal={(beer) => {
          setIsSettingsOpen(false);
          handleOpenEditBeer(beer);
        }}
      />

      <ProductEditModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        beer={editingBeer}
        onSaveBeer={handleSaveSingleBeer}
        onDeleteBeer={handleDeleteSingleBeer}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="mt-12 bg-stone-950 border-t border-stone-900 text-stone-400 py-8 px-4 text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-300">
            <a
              href={buildDirectWhatsAppUrl(config.primaryPhone, 'Olá! Gostaria de atendimento.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {formatPhoneDisplay(config.primaryPhone)}</span>
            </a>

            <span>•</span>

            <a
              href={`https://instagram.com/${config.instagramUser.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram: @{config.instagramUser.replace('@', '')}</span>
            </a>

            <span>•</span>

            <button
              onClick={() => requireAdminAuth(() => setIsSettingsOpen(true))}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-stone-400"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Painel de Personalização Completa</span>
            </button>
          </div>

          <p className="text-[11px] text-stone-400">
            {config.name} • {config.address} • {config.cityState}
          </p>

          <p className="text-[10px] text-stone-400">
            Beba com moderação. Proibida a venda de bebidas alcoólicas para menores de 18 anos (Lei 8.069/90).
          </p>
        </div>
      </footer>
    </div>
  );
}
