import React, { useState, useMemo } from 'react';
import { Beer, Sparkles, Droplets, Thermometer, Utensils, Send, Edit, Plus, Check, Settings2 } from 'lucide-react';
import { BeerProduct, DistributorConfig } from '../types';
import { formatCurrency, openWhatsApp } from '../utils/whatsapp';

interface BeerMenuProps {
  beers: BeerProduct[];
  config: DistributorConfig;
  onSelectBeerForOrder: (beerId: string) => void;
  onEditBeer?: (beer: BeerProduct) => void;
  onAddNewBeer?: () => void;
}

export const BeerMenu: React.FC<BeerMenuProps> = ({
  beers,
  config,
  onSelectBeerForOrder,
  onEditBeer,
  onAddNewBeer,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  // Extract dynamic styles
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    beers.forEach((b) => {
      if (b.style) set.add(b.style);
    });
    return Array.from(set);
  }, [beers]);

  const filteredBeers = beers.filter((beer) => {
    if (activeFilter === 'todos') return true;
    return beer.style.toLowerCase().includes(activeFilter.toLowerCase()) || beer.name.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const handleQuickBeerWhatsApp = (beer: BeerProduct) => {
    const text = `Olá! Gostaria de consultar a disponibilidade e valores do chopp *${beer.name}* (${beer.style}) para o meu evento!`;
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

        {/* Action Controls for Catalog */}
        {onAddNewBeer && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={onAddNewBeer}
              className="px-3.5 py-1.5 rounded-full bg-stone-900 border border-amber-500/40 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar Novo Chopp</span>
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'todos'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Todos os Estilos ({beers.length})
          </button>

          {availableCategories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {cat}
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
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/20 shadow-md shrink-0"
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

                <div className="flex items-center gap-1.5">
                  {beer.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 shrink-0">
                      {beer.badge}
                    </span>
                  )}

                  {onEditBeer && (
                    <button
                      onClick={() => onEditBeer(beer)}
                      className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-amber-500 text-stone-400 hover:text-amber-400 transition-colors"
                      title="Editar este chopp"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {beer.tagline && (
                <p className="text-[11px] text-amber-300/80 font-medium italic mb-2">
                  "{beer.tagline}"
                </p>
              )}

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
                  <span className="text-xs font-bold text-amber-400">{beer.temperature || '0°C a 2°C'}</span>
                </div>
              </div>

              {/* Harmonization */}
              {beer.pairings && (
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 bg-stone-900/50 px-2.5 py-1.5 rounded-lg border border-stone-800">
                  <Utensils className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate"><strong>Combina com:</strong> {beer.pairings}</span>
                </div>
              )}
            </div>

            {/* Pricing and Action Buttons */}
            <div className="pt-3 border-t border-stone-800/80">
              <div className="flex items-center justify-between mb-3 text-xs gap-1.5">
                {beer.price20L && (
                  <div className="flex-1 text-center bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                    <span className="text-[9px] text-stone-400 block">20L</span>
                    <strong className="text-white text-xs">{formatCurrency(beer.price20L)}</strong>
                  </div>
                )}
                <div className="flex-1 text-center bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                  <span className="text-[9px] text-stone-400 block">30L</span>
                  <strong className="text-white text-xs">{beer.price30L ? formatCurrency(beer.price30L) : 'Consulte'}</strong>
                </div>
                <div className="flex-1 text-center bg-stone-950 px-2 py-1 rounded-lg border border-amber-500/30">
                  <span className="text-[9px] text-amber-400 block">50L</span>
                  <strong className="text-amber-400 text-xs">{beer.price50L ? formatCurrency(beer.price50L) : 'Consulte'}</strong>
                </div>
                <div className="flex-1 text-center bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                  <span className="text-[9px] text-stone-400 block">Growler</span>
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
