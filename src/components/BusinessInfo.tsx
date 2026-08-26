import React, { useState } from 'react';
import {
  Clock,
  Truck,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';
import { DistributorConfig } from '../types';
import { FREQUENT_QUESTIONS } from '../data/defaultData';

interface BusinessInfoProps {
  config: DistributorConfig;
  isOpenPixModal?: boolean;
  onClosePixModal?: () => void;
}

export const BusinessInfo: React.FC<BusinessInfoProps> = ({
  config,
  isOpenPixModal,
  onClosePixModal,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(config.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <section id="business-info-section" className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 3 Columns Info: Hours, Delivery, Payment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Horários */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Horário de Atendimento</h3>
          <div className="space-y-1.5 text-xs text-stone-400">
            <p><strong className="text-stone-300">Dias de Semana:</strong><br />{config.workingHoursWeekday}</p>
            <p><strong className="text-stone-300">Final de Semana & Feriados:</strong><br />{config.workingHoursWeekend}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-800 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Plantão de urgência para eventos
          </div>
        </div>

        {/* Regiões Atendidas */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Entrega & Instalação</h3>
          <p className="text-xs text-stone-400 mb-2">
            Entregamos e instalamos no local com chopeira elétrica regulada.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {config.deliveryZones.map((zone, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-stone-950 text-stone-300 border border-stone-800 px-2 py-0.5 rounded-md"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>

        {/* Formas de Pagamento & PIX */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Pagamento Facilitado</h3>
            <p className="text-xs text-stone-400 mb-3">
              PIX instantâneo com desconto especial, ou cartão de crédito em até 12x.
            </p>
          </div>

          <div className="bg-stone-950 border border-emerald-500/30 rounded-2xl p-3">
            <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
              <span>Chave PIX ({config.pixKeyType}):</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-emerald-400 font-bold truncate">
                {config.pixKey}
              </code>
              <button
                id="btn-copy-pix"
                onClick={handleCopyPix}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                title="Copiar chave PIX"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Dúvidas Frequentes sobre Locação e Barris</h3>
        </div>

        <div className="space-y-2">
          {FREQUENT_QUESTIONS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-stone-800 rounded-2xl bg-stone-950/50 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 text-sm font-semibold text-stone-200 hover:text-white"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PIX Modal if opened directly via quick actions */}
      {isOpenPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Pagamento via PIX & Cartão
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Realize pagamentos e confirmações de pedidos diretamente com a chave oficial:
            </p>

            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 mb-4">
              <span className="text-[11px] text-stone-500 block mb-1">Chave PIX ({config.pixKeyType}):</span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-emerald-400 font-bold break-all">
                  {config.pixKey}
                </code>
                <button
                  onClick={handleCopyPix}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-stone-950 text-xs font-bold shrink-0 hover:bg-emerald-400 flex items-center gap-1"
                >
                  {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPix ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-300 mb-6">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Titular: <strong>{config.name}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cartões: Aceitamos todas as bandeiras na entrega (até 12x).</span>
              </p>
            </div>

            <button
              onClick={onClosePixModal}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
