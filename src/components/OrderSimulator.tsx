import React, { useState } from 'react';
import {
  Beer,
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Send,
  Zap,
  Info,
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { BeerProduct, DistributorConfig, OrderState } from '../types';
import {
  formatCurrency,
  generateOrderWhatsAppMessage,
  openWhatsApp,
  triggerOrderConfetti
} from '../utils/whatsapp';

interface OrderSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  beers: BeerProduct[];
  config: DistributorConfig;
  initialBeerId?: string;
}

export const OrderSimulator: React.FC<OrderSimulatorProps> = ({
  isOpen,
  onClose,
  beers,
  config,
  initialBeerId
}) => {
  const [order, setOrder] = useState<OrderState>({
    beerId: initialBeerId || beers[0]?.id || 'pilsen-puro-malte',
    kegSize: '50L',
    quantity: 1,
    tapType: 'eletrica-220v',
    eventDate: '',
    eventTime: '12:00',
    deliveryType: 'entrega',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    notes: '',
    includeCups: true,
    includeIce: false,
  });

  if (!isOpen) return null;

  const selectedBeer = beers.find((b) => b.id === order.beerId) || beers[0];

  // Calculate estimated price
  let basePrice = 0;
  if (order.kegSize === '30L') {
    basePrice = selectedBeer?.price30L || 380;
  } else if (order.kegSize === '50L') {
    basePrice = selectedBeer?.price50L || 590;
  } else if (order.kegSize === 'Growler') {
    basePrice = (selectedBeer?.priceGrowler || 25) * 2; // 2L growler default
  } else {
    basePrice = 280; // 20L
  }

  let totalEstimate = basePrice * order.quantity;
  if (order.includeCups) totalEstimate += 15 * order.quantity;
  if (order.includeIce && order.tapType === 'gelo') totalEstimate += 20;

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    triggerOrderConfetti();
    const msg = generateOrderWhatsAppMessage(order, selectedBeer, config, totalEstimate);
    openWhatsApp(config.primaryPhone, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Beer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Monte seu Pedido de Chopp
                <span className="text-[10px] bg-emerald-500 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Direto WhatsApp
                </span>
              </h3>
              <p className="text-xs text-stone-400">Preencha os detalhes e receba atendimento instantâneo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSendToWhatsApp} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Beer Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-between">
              <span>1. Escolha o Estilo do Chopp</span>
              <span className="text-[11px] text-stone-400 font-normal">Selecione uma opção</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {beers.map((beer) => {
                const isSelected = order.beerId === beer.id;
                return (
                  <button
                    key={beer.id}
                    type="button"
                    onClick={() => setOrder({ ...order, beerId: beer.id })}
                    className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                    }`}
                  >
                    <div
                      className="w-4 h-12 rounded-full shrink-0 mt-0.5 border border-white/20 shadow-inner"
                      style={{ backgroundColor: beer.colorHex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white truncate">{beer.name}</span>
                        {beer.badge && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded border border-amber-500/30">
                            {beer.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{beer.tagline}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-400">
                        <span>ABV: <strong className="text-amber-400">{beer.abv}%</strong></span>
                        <span>•</span>
                        <span>IBU: <strong className="text-amber-400">{beer.ibu}</strong></span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Keg Size & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                2. Tamanho do Barril / Embalagem
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['30L', '50L', 'Growler'] as const).map((size) => {
                  const isSelected = order.kegSize === size;
                  let price = 0;
                  if (size === '30L') price = selectedBeer.price30L || 380;
                  if (size === '50L') price = selectedBeer.price50L || 590;
                  if (size === 'Growler') price = (selectedBeer.priceGrowler || 25) * 2;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setOrder({ ...order, kegSize: size })}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400'
                      }`}
                    >
                      <div className="text-base font-black text-amber-300">{size}</div>
                      <div className="text-[11px] text-stone-400 mt-1">{formatCurrency(price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Quantidade de Barris
              </label>
              <div className="flex items-center gap-3 bg-stone-950/60 border border-stone-800 rounded-2xl p-2">
                <button
                  type="button"
                  onClick={() => setOrder({ ...order, quantity: Math.max(1, order.quantity - 1) })}
                  className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center font-black text-xl text-white">
                  {order.quantity} {order.quantity === 1 ? 'barril' : 'barris'}
                  <span className="block text-[11px] font-normal text-amber-400">
                    Total: {order.kegSize === 'Growler' ? order.quantity * 2 : parseInt(order.kegSize) * order.quantity} Litros
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOrder({ ...order, quantity: order.quantity + 1 })}
                  className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Tap / Chopeira Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-between">
              <span>3. Chopeira & Equipamento</span>
              <span className="text-[11px] text-emerald-400 font-semibold">✨ Inclusa Grátis nos Barris</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'eletrica-220v', title: 'Chopeira Elétrica 220V', sub: 'Mais potente, gela rápido' },
                { id: 'eletrica-110v', title: 'Chopeira Elétrica 110V', sub: 'Prática para tomadas padrão' },
                { id: 'gelo', title: 'Chopeira a Gelo', sub: 'Ideal onde não há tomada' },
              ].map((tap) => {
                const isSelected = order.tapType === tap.id;
                return (
                  <button
                    key={tap.id}
                    type="button"
                    onClick={() => setOrder({ ...order, tapType: tap.id as any })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-600'}`} />
                      <span className="font-bold text-xs text-white">{tap.title}</span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1 pl-5.5">{tap.sub}</p>
                  </button>
                );
              })}
            </div>

            {/* Extras Checkboxes */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-stone-800">
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={order.includeCups}
                  onChange={(e) => setOrder({ ...order, includeCups: e.target.checked })}
                  className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 bg-stone-950 w-4 h-4"
                />
                <span>Incluir pacote de 50 copos descartáveis 400ml (+R$ 15)</span>
              </label>

              {order.tapType === 'gelo' && (
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={order.includeIce}
                    onChange={(e) => setOrder({ ...order, includeIce: e.target.checked })}
                    className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 bg-stone-950 w-4 h-4"
                  />
                  <span>Incluir saco de gelo para chopeira (+R$ 20)</span>
                </label>
              )}
            </div>
          </div>

          {/* Step 4: Event Date & Customer Details */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
              4. Informações do Evento & Entrega
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Seu Nome</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={order.customerName}
                    onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Seu WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: (11) 99999-8888"
                    value={order.customerPhone}
                    onChange={(e) => setOrder({ ...order, customerPhone: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Data do Evento</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={order.eventDate}
                    onChange={(e) => setOrder({ ...order, eventDate: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Modalidade</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrder({ ...order, deliveryType: 'entrega' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      order.deliveryType === 'entrega'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    🚚 Entrega no Local
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrder({ ...order, deliveryType: 'retirada' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      order.deliveryType === 'retirada'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    🏢 Retirar no Balcão
                  </button>
                </div>
              </div>
            </div>

            {order.deliveryType === 'entrega' && (
              <div>
                <label className="block text-xs text-stone-400 mb-1">Endereço de Entrega (Rua, Número, Bairro)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua das Flores, 120 - Bairro Jardim"
                    value={order.deliveryAddress}
                    onChange={(e) => setOrder({ ...order, deliveryAddress: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-stone-400 mb-1">Observações ou Dúvidas (Opcional)</label>
              <textarea
                rows={2}
                placeholder="Ex: Evento no 2º andar sem elevador, horário de entrega preferencial..."
                value={order.notes}
                onChange={(e) => setOrder({ ...order, notes: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Price Summary & Submit CTA */}
          <div className="bg-gradient-to-br from-stone-950 to-stone-900 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-stone-400 block">Total Estimado do Pedido</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {formatCurrency(totalEstimate)}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Instalação e Chopeira Inclusas
                </span>
                <span className="block text-[11px] text-stone-400 mt-1">
                  Taxa de entrega calculada via WhatsApp
                </span>
              </div>
            </div>

            <button
              id="btn-submit-order-whatsapp"
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-5 h-5" />
              <span>ENVIAR PEDIDO NO WHATSAPP AGORA</span>
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              Você será direcionado diretamente para o atendimento no WhatsApp com o pedido formatado!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
