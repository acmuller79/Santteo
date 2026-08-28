import React, { useState, useEffect } from 'react';
import { Beer, X, Save, Trash2, Sparkles, Droplets, Thermometer, Utensils } from 'lucide-react';
import { BeerProduct } from '../types';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  beer: BeerProduct | null;
  onSaveBeer: (beer: BeerProduct) => void;
  onDeleteBeer?: (beerId: string) => void;
}

const PRESET_COLORS = [
  { name: 'Dourado Pilsen', hex: '#E5A93C' },
  { name: 'Âmbar IPA', hex: '#C67A1D' },
  { name: 'Vinho Tinto', hex: '#72173C' },
  { name: 'Trigo Weiss', hex: '#DDA83A' },
  { name: 'Stout / Escuro', hex: '#2B1A13' },
  { name: 'Cobre APA', hex: '#D8942B' },
  { name: 'Rubi Intenso', hex: '#8B0000' },
  { name: 'Black Malte', hex: '#1A110D' },
];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  beer,
  onSaveBeer,
  onDeleteBeer,
}) => {
  const [formData, setFormData] = useState<BeerProduct>({
    id: `chopp-${Date.now()}`,
    name: '',
    style: '',
    tagline: '',
    description: '',
    abv: 4.8,
    ibu: 15,
    colorHex: '#E5A93C',
    badge: '',
    availableSizes: ['20L', '30L', '50L', 'Growler'],
    price20L: 280,
    price30L: 380,
    price50L: 590,
    priceGrowler: 25,
    temperature: '0°C a 2°C',
    pairings: 'Churrasco e petiscos',
  });

  useEffect(() => {
    if (beer) {
      setFormData({ ...beer });
    } else {
      setFormData({
        id: `chopp-${Date.now()}`,
        name: '',
        style: '',
        tagline: '',
        description: '',
        abv: 4.8,
        ibu: 15,
        colorHex: '#E5A93C',
        badge: '',
        availableSizes: ['20L', '30L', '50L', 'Growler'],
        price20L: 280,
        price30L: 380,
        price50L: 590,
        priceGrowler: 25,
        temperature: '0°C a 2°C',
        pairings: 'Churrasco e petiscos',
      });
    }
  }, [beer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSaveBeer(formData);
    onClose();
  };

  const toggleSize = (size: '20L' | '30L' | '50L' | 'Growler') => {
    const exists = formData.availableSizes.includes(size);
    if (exists) {
      if (formData.availableSizes.length === 1) return; // Must have at least 1 size
      setFormData({
        ...formData,
        availableSizes: formData.availableSizes.filter((s) => s !== size),
      });
    } else {
      setFormData({
        ...formData,
        availableSizes: [...formData.availableSizes, size],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 shadow-md shrink-0"
              style={{ backgroundColor: formData.colorHex }}
            >
              <Beer className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {beer ? `Editar: ${beer.name || 'Chopp'}` : 'Cadastrar Novo Chopp'}
              </h3>
              <p className="text-xs text-stone-400">Personalize estilos, preços por barril, IBU e harmonização</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nome do Chopp *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Pilsen Puro Malte Especial"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Estilo / Categoria
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Pilsen Artesanal, American IPA, Weiss..."
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Frase de Destaque / Tagline
              </label>
              <input
                type="text"
                placeholder="Ex: O mais pedido! Leve, refrescante e dourado."
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Selo Especial (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Campeão de Vendas, Edição Especial"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-sm text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Descrição Completa
            </label>
            <textarea
              rows={3}
              placeholder="Descreva as características, maltes, lúpulos, sensação na boca e ocasiões ideais..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Color and Visuals */}
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800/80 space-y-2">
            <label className="block text-xs font-semibold text-stone-300">
              Cor do Barril / Chopp
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.colorHex}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={formData.colorHex}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="w-24 bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 ml-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, colorHex: c.hex })}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
                      formData.colorHex.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-amber-400 text-white bg-stone-800'
                        : 'border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specs: ABV, IBU, Temp, Pairings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Teor Alcoólico (ABV %)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.abv}
                onChange={(e) => setFormData({ ...formData, abv: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Amargor (IBU)
              </label>
              <input
                type="number"
                step="1"
                value={formData.ibu}
                onChange={(e) => setFormData({ ...formData, ibu: parseInt(e.target.value) || 0 })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Temperatura Ideal
              </label>
              <input
                type="text"
                placeholder="0°C a 2°C"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Harmonização
              </label>
              <input
                type="text"
                placeholder="Churrasco, petiscos"
                value={formData.pairings}
                onChange={(e) => setFormData({ ...formData, pairings: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pricing by Keg Size */}
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800/80 space-y-3">
            <label className="block text-xs font-bold text-amber-400">
              Preços por Tamanho de Barril (R$)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Barril 20L</span>
                  <input
                    type="checkbox"
                    checked={formData.availableSizes.includes('20L')}
                    onChange={() => toggleSize('20L')}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-[10px] text-stone-500 font-bold">R$</span>
                  <input
                    type="number"
                    disabled={!formData.availableSizes.includes('20L')}
                    value={formData.price20L || ''}
                    onChange={(e) => setFormData({ ...formData, price20L: parseFloat(e.target.value) || 0 })}
                    placeholder="280"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white font-bold disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Barril 30L</span>
                  <input
                    type="checkbox"
                    checked={formData.availableSizes.includes('30L')}
                    onChange={() => toggleSize('30L')}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-[10px] text-stone-500 font-bold">R$</span>
                  <input
                    type="number"
                    disabled={!formData.availableSizes.includes('30L')}
                    value={formData.price30L || ''}
                    onChange={(e) => setFormData({ ...formData, price30L: parseFloat(e.target.value) || 0 })}
                    placeholder="380"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white font-bold disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-400">Barril 50L</span>
                  <input
                    type="checkbox"
                    checked={formData.availableSizes.includes('50L')}
                    onChange={() => toggleSize('50L')}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-[10px] text-stone-500 font-bold">R$</span>
                  <input
                    type="number"
                    disabled={!formData.availableSizes.includes('50L')}
                    value={formData.price50L || ''}
                    onChange={(e) => setFormData({ ...formData, price50L: parseFloat(e.target.value) || 0 })}
                    placeholder="590"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-amber-400 font-bold disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">Growler (L)</span>
                  <input
                    type="checkbox"
                    checked={formData.availableSizes.includes('Growler')}
                    onChange={() => toggleSize('Growler')}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-[10px] text-stone-500 font-bold">R$</span>
                  <input
                    type="number"
                    disabled={!formData.availableSizes.includes('Growler')}
                    value={formData.priceGrowler || ''}
                    onChange={(e) => setFormData({ ...formData, priceGrowler: parseFloat(e.target.value) || 0 })}
                    placeholder="25"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white font-bold disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
            {beer && onDeleteBeer ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja excluir "${beer.name}"?`)) {
                    onDeleteBeer(beer.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Chopp</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Chopp</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
