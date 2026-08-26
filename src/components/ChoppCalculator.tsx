import React, { useState } from 'react';
import { Calculator, X, Users, Clock, Flame, ArrowRight, Beer, Sparkles } from 'lucide-react';
import { DistributorConfig } from '../types';
import { openWhatsApp, buildDirectWhatsAppUrl } from '../utils/whatsapp';

interface ChoppCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  config: DistributorConfig;
  onSelectKegQuantity?: (liters: number) => void;
}

export const ChoppCalculator: React.FC<ChoppCalculatorProps> = ({
  isOpen,
  onClose,
  config,
  onSelectKegQuantity
}) => {
  const [men, setMen] = useState<number>(10);
  const [women, setWomen] = useState<number>(10);
  const [durationHours, setDurationHours] = useState<number>(5);
  const [partyType, setPartyType] = useState<'churrasco' | 'casamento' | 'aniversario' | 'happyhour'>('churrasco');

  if (!isOpen) return null;

  // Calculation parameters based on Brazilian beer events benchmark
  let baseRatePerPersonPerHour = 0.35; // Liters per hour
  if (partyType === 'churrasco') baseRatePerPersonPerHour = 0.45; // Sunny BBQ drinks more
  if (partyType === 'casamento') baseRatePerPersonPerHour = 0.30; // More mixed drinks/wine
  if (partyType === 'happyhour') baseRatePerPersonPerHour = 0.40;

  // Men drink approx 1.3x baseline, women approx 0.8x baseline
  const menLiters = men * (baseRatePerPersonPerHour * 1.25) * Math.min(durationHours, 6);
  const womenLiters = women * (baseRatePerPersonPerHour * 0.85) * Math.min(durationHours, 6);
  
  // Total rounded to clean 5L increments
  const totalEstimatedLiters = Math.max(20, Math.ceil((menLiters + womenLiters) / 5) * 5);

  // Determine optimal keg combination
  let recommendation = '';
  if (totalEstimatedLiters <= 30) {
    recommendation = '1 Barril de 30 Litros';
  } else if (totalEstimatedLiters <= 50) {
    recommendation = '1 Barril de 50 Litros (Sobrando com tranquilidade)';
  } else if (totalEstimatedLiters <= 60) {
    recommendation = '2 Barris de 30 Litros (Você pode escolher 2 estilos diferentes!)';
  } else if (totalEstimatedLiters <= 80) {
    recommendation = '1 Barril de 50L + 1 Barril de 30L';
  } else if (totalEstimatedLiters <= 100) {
    recommendation = '2 Barris de 50 Litros';
  } else {
    const kegs50 = Math.floor(totalEstimatedLiters / 50);
    const remainder = totalEstimatedLiters % 50;
    recommendation = `${kegs50} Barris de 50L ${remainder > 0 ? `+ 1 Barril de 30L` : ''}`;
  }

  const estimatedCups = Math.ceil((totalEstimatedLiters * 1000) / 350); // 350ml useful cup volume

  const handleAskInWhatsApp = () => {
    const partyNameMap: Record<string, string> = {
      churrasco: 'Churrasco',
      casamento: 'Casamento / Formatura',
      aniversario: 'Aniversário / Festa',
      happyhour: 'Happy Hour / Confraternização',
    };

    const text = [
      `🧮 *SIMULAÇÃO NA CALCULADORA DE CHOPP*`,
      `--------------------------------------`,
      `🎉 *Tipo de Evento:* ${partyNameMap[partyType]}`,
      `👥 *Convidados:* ${men} homens e ${women} mulheres (Total: ${men + women} pessoas)`,
      `⏱️ *Duração:* ${durationHours} horas de festa`,
      ``,
      `🍺 *Volume Calculado Recomendado:* *${totalEstimatedLiters} Litros*`,
      `💡 *Sugestão de Barris:* ${recommendation}`,
      `🥤 *Estimativa de Copos:* aprox. ${estimatedCups} copos`,
      `--------------------------------------`,
      `Olá! Fiz a simulação na calculadora e gostaria de um orçamento para essa quantidade de chopp e chopeira!`
    ].join('\n');

    openWhatsApp(config.primaryPhone, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Calculadora de Chopp
                <span className="text-[10px] bg-blue-500 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Para Eventos
                </span>
              </h3>
              <p className="text-xs text-stone-400">Nunca deixe faltar e evite desperdício</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Party Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Qual é o tipo de evento?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'churrasco', label: '🥩 Churrasco' },
                { id: 'aniversario', label: '🎂 Aniversário' },
                { id: 'casamento', label: '💍 Casamento' },
                { id: 'happyhour', label: '🍻 Happy Hour' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPartyType(item.id as any)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    partyType === item.id
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* People inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  Homens (Consumidores)
                </span>
                <span className="text-lg font-black text-white">{men}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={men}
                onChange={(e) => setMen(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>0</span>
                <span>40</span>
                <span>80+</span>
              </div>
            </div>

            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-pink-400" />
                  Mulheres (Consumidoras)
                </span>
                <span className="text-lg font-black text-white">{women}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={women}
                onChange={(e) => setWomen(parseInt(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>0</span>
                <span>40</span>
                <span>80+</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Duração Estimada da Festa
              </span>
              <span className="text-lg font-black text-amber-400">{durationHours} horas</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={durationHours}
              onChange={(e) => setDurationHours(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>2h (Rápida)</span>
              <span>5h (Padrão)</span>
              <span>10h (Dia Inteiro)</span>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-gradient-to-br from-blue-950/40 via-stone-950 to-stone-900 border-2 border-blue-500/40 rounded-2xl p-5 text-center shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-1">
              Volume Recomendado para seu Evento
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white my-2 flex items-center justify-center gap-2">
              <Beer className="w-8 h-8 text-amber-400 animate-bounce" />
              <span>{totalEstimatedLiters} <span className="text-2xl font-bold text-blue-400">Litros</span></span>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3 my-3 text-left">
              <div className="text-xs text-stone-300 font-medium">
                💡 <strong>Combinação Ideal de Barris:</strong>
              </div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">
                {recommendation}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Equivale a aproximadamente <strong>{estimatedCups} copos</strong> de 400ml servidos bem gelados.
              </div>
            </div>

            <button
              id="btn-calc-ask-whatsapp"
              onClick={handleAskInWhatsApp}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>PEDIR ESTA QUANTIDADE NO WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
