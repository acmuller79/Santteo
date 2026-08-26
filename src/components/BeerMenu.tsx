import React, { useState } from 'react';
import { Beer, Sparkles, Droplets, Thermometer, Utensils, Send, Check } from 'lucide-react';
import { BeerProduct, DistributorConfig } from '../types';
import { formatCurrency, openWhatsApp } from '../utils/whatsapp';

interface BeerMenuProps {
  beers: BeerProduct[];
  config: DistributorConfig;
  onSelectBeerForOrder: (beerId: string) => void;
}

export const BeerMenu: React.FC<BeerMenuProps> = ({
  beers,
  config,
  onSelectBeerForOrder
}) => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'classicos' | 'especiais'>('todos');

  const filteredBeers = beers.filter((beer) => {
    if (activeFilter === 'classicos') return beer.id.includes('pilsen') || beer.id.includes('session');
    if (activeFilter === 'especiais') return !beer.id.includes('pilsen');
    return true;
  });

  const handleQuickBeerWhatsApp = (beer: BeerProduct) => {
    const text = `Olá! Gostaria de consultar o preço e disponibilidade de barris de *${beer.name}* (${beer.style}) para o meu evento!`;
    openWhatsApp(config.primaryPhone, text);
  };

  return (
    <section id="beer-catalog-section" className="max-w-4xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Beer className="w-3.5 h-3.5" />
          Nossos Chopes Artesanais & Puro Malte
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Catálogo de Barris & Estilos
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Barris higienizados, chopeiras reguladas e chopp sempre fresco direto da câmara fria.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[
            { id: 'todos', label: 'Todos os Estilos' },
            { id: 'classicos', label: 'Mais Vendidos' },
            { id: 'especiais', label: 'Especiais & Artesanais' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Beers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBeers.map((beer) => (
          <div
            key={beer.id}
            id={`beer-card-${beer.id}`}
            className="group relative bg-stone-900/90 border border-stone-800/90 hover:border-amber-500/40 rounded-3xl p-5 shadow-lg transition-all hover:-translate-y-0.5 flex flex-col justify-between"
          >
            {/* Top info */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/20 shadow-md shrink-0"
                    style={{ backgroundColor: beer.colorHex }}
                  >
                    <Beer className="w-5 h-5 text-white/90 drop-shadow" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {beer.name}
                    </h3>
                    <span className="text-xs text-amber-400/90 font-medium">{beer.style}</span>
                  </div>
                </div>

                {beer.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 shrink-0">
                    {beer.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                {beer.description}
              </p>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-stone-950/60 border border-stone-800/80 rounded-xl p-2.5 mb-4 text-center">
                <div>
                  <span className="block text-[10px] text-stone-400 font-medium">Teor (ABV)</span>
                  <span className="text-xs font-bold text-amber-400">{beer.abv}%</span>
                </div>
                <div className="border-x border-stone-800">
                  <span className="block text-[10px] text-stone-400 font-medium">Amargor (IBU)</span>
                  <span className="text-xs font-bold text-amber-400">{beer.ibu} IBU</span>
                </div>
                <div>
                  <span className="block text-[10px] text-stone-400 font-medium">Temperatura</span>
                  <span className="text-xs font-bold text-amber-400">{beer.temperature}</span>
                </div>
              </div>

              {/* Harmonization */}
              <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 bg-stone-900/50 px-2.5 py-1.5 rounded-lg border border-stone-800">
                <Utensils className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate"><strong>Combina com:</strong> {beer.pairings}</span>
              </div>
            </div>

            {/* Pricing and Action Buttons */}
            <div className="pt-3 border-t border-stone-800/80">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="text-center bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Barril 30L</span>
                  <strong className="text-white text-xs">{beer.price30L ? formatCurrency(beer.price30L) : 'Consulte'}</strong>
                </div>
                <div className="text-center bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Barril 50L</span>
                  <strong className="text-amber-400 text-xs">{beer.price50L ? formatCurrency(beer.price50L) : 'Consulte'}</strong>
                </div>
                <div className="text-center bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 block">Growler 2L</span>
                  <strong className="text-white text-xs">{beer.priceGrowler ? formatCurrency(beer.priceGrowler * 2) : 'Consulte'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id={`btn-order-beer-${beer.id}`}
                  onClick={() => onSelectBeerForOrder(beer.id)}
                  className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Beer className="w-3.5 h-3.5" />
                  <span>Simular Pedido</span>
                </button>

                <button
                  id={`btn-whatsapp-beer-${beer.id}`}
                  onClick={() => handleQuickBeerWhatsApp(beer)}
                  className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Pedir no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
