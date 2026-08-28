import React, { useState, useRef } from 'react';
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Check,
  Phone,
  Instagram,
  MapPin,
  CreditCard,
  Building,
  Beer,
  Sparkles,
  Zap,
  HelpCircle,
  Clock,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Image as ImageIcon,
  Copy,
  Link,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Eye,
  Layers
} from 'lucide-react';
import { DistributorConfig, BeerProduct, FAQItem, TrustBadge, QuickAction } from '../types';
import { DEFAULT_CONFIG, DEFAULT_BEERS, DEFAULT_TRUST_BADGES, DEFAULT_FAQS } from '../data/defaultData';
import { formatPhoneDisplay } from '../utils/whatsapp';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DistributorConfig;
  beers: BeerProduct[];
  onSaveConfig: (newConfig: DistributorConfig) => void;
  onSaveBeers: (newBeers: BeerProduct[]) => void;
  onOpenProductModal?: (beer: BeerProduct | null) => void;
}

type TabType = 'produtos' | 'identidade' | 'contatos' | 'promocoes' | 'links' | 'selos' | 'locais' | 'pagamentos' | 'faq' | 'backup';

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  beers,
  onSaveConfig,
  onSaveBeers,
  onOpenProductModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('produtos');
  const [formData, setFormData] = useState<DistributorConfig>({ ...config });
  const [beerList, setBeerList] = useState<BeerProduct[]>([...beers]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newRegionInput, setNewRegionInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...config });
      setBeerList([...beers]);
    }
  }, [isOpen, config, beers]);

  if (!isOpen) return null;

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveConfig(formData);
    onSaveBeers(beerList);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetFactory = () => {
    if (window.confirm('Atenção: Deseja restaurar todas as configurações e produtos para o padrão original de fábrica?')) {
      setFormData({ ...DEFAULT_CONFIG });
      setBeerList([...DEFAULT_BEERS]);
      onSaveConfig(DEFAULT_CONFIG);
      onSaveBeers(DEFAULT_BEERS);
      alert('Configurações e catálogo restaurados com sucesso!');
    }
  };

  // Logo file upload handler
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Backup Export
  const handleExportBackup = () => {
    const backupData = {
      config: formData,
      beers: beerList,
      exportedAt: new Date().toISOString(),
      version: '2.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_santteo_chopp_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Backup Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed.config) setFormData(parsed.config);
          if (parsed.beers && Array.isArray(parsed.beers)) setBeerList(parsed.beers);
          alert('Backup importado com sucesso! Clique em "Salvar Tudo" para consolidar.');
        } catch (err) {
          alert('Erro ao ler arquivo de backup JSON: Formato inválido.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Beer Operations inside Config Modal
  const handleDeleteBeer = (beerId: string) => {
    if (beerList.length <= 1) {
      alert('Você precisa ter pelo menos 1 chopp cadastrado no catálogo.');
      return;
    }
    if (window.confirm('Deseja excluir este chopp?')) {
      setBeerList(beerList.filter((b) => b.id !== beerId));
    }
  };

  const handleDuplicateBeer = (beer: BeerProduct) => {
    const newBeer: BeerProduct = {
      ...beer,
      id: `chopp-${Date.now()}`,
      name: `${beer.name} (Cópia)`,
    };
    setBeerList([...beerList, newBeer]);
  };

  const handleMoveBeer = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= beerList.length) return;
    const newList = [...beerList];
    const item = newList.splice(index, 1)[0];
    newList.splice(targetIndex, 0, item);
    setBeerList(newList);
  };

  // FAQ Operations
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'Nova pergunta frequente?',
      answer: 'Escreva aqui a resposta detalhada...',
    };
    setFormData({
      ...formData,
      faqs: [...(formData.faqs || DEFAULT_FAQS), newFaq],
    });
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', val: string) => {
    const updated = [...(formData.faqs || DEFAULT_FAQS)];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, faqs: updated });
  };

  const handleDeleteFaq = (index: number) => {
    const updated = [...(formData.faqs || DEFAULT_FAQS)];
    updated.splice(index, 1);
    setFormData({ ...formData, faqs: updated });
  };

  // Trust Badges Operations
  const handleUpdateBadge = (index: number, field: keyof TrustBadge, val: any) => {
    const updated = [...(formData.trustBadges || DEFAULT_TRUST_BADGES)];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, trustBadges: updated });
  };

  // Delivery Regions
  const handleAddRegion = () => {
    if (newRegionInput.trim() && !formData.deliveryZones.includes(newRegionInput.trim())) {
      setFormData({
        ...formData,
        deliveryZones: [...formData.deliveryZones, newRegionInput.trim()],
      });
      setNewRegionInput('');
    }
  };

  const handleRemoveRegion = (zoneToRemove: string) => {
    setFormData({
      ...formData,
      deliveryZones: formData.deliveryZones.filter((z) => z !== zoneToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-5 sm:px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Painel de Personalização Completa
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full uppercase border border-amber-500/30">
                  Edição Total
                </span>
              </h3>
              <p className="text-xs text-stone-400">Edite produtos, preços de barris, textos, WhatsApp, banners e FAQ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-950 px-4 py-2 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-thin">
          {[
            { id: 'produtos', label: '1. Catálogo & Preços', icon: Beer },
            { id: 'identidade', label: '2. Marca & Logotipo', icon: Building },
            { id: 'contatos', label: '3. WhatsApp & Redes', icon: Phone },
            { id: 'promocoes', label: '4. Banners & Destaques', icon: Zap },
            { id: 'selos', label: '5. Selos de Vantagem', icon: ShieldCheck },
            { id: 'locais', label: '6. Regiões & Horários', icon: MapPin },
            { id: 'pagamentos', label: '7. Pagamento & PIX', icon: CreditCard },
            { id: 'faq', label: '8. Dúvidas (FAQ)', icon: HelpCircle },
            { id: 'backup', label: '9. Backup & Exportar', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRODUTOS & PREÇOS */}
          {activeTab === 'produtos' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Beer className="w-4 h-4 text-amber-400" />
                    Gerenciamento do Catálogo de Chopes ({beerList.length} itens)
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Adicione novos estilos de chopp, altere preços dos barris de 20L, 30L e 50L ou exclua itens.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenProductModal) {
                        onOpenProductModal(null);
                      } else {
                        const newBeer: BeerProduct = {
                          id: `chopp-${Date.now()}`,
                          name: 'Novo Chopp Artesanal',
                          style: 'Estilo Especial',
                          tagline: 'Descrição curta do sabor',
                          description: 'Descrição completa sobre o chopp...',
                          abv: 5.0,
                          ibu: 20,
                          colorHex: '#E5A93C',
                          availableSizes: ['20L', '30L', '50L', 'Growler'],
                          price20L: 290,
                          price30L: 390,
                          price50L: 600,
                          priceGrowler: 25,
                          temperature: '0°C a 2°C',
                          pairings: 'Carnes e petiscos',
                        };
                        setBeerList([...beerList, newBeer]);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Cadastrar Novo Chopp</span>
                  </button>
                </div>
              </div>

              {/* Beers List */}
              <div className="space-y-3">
                {beerList.map((beer, idx) => (
                  <div
                    key={beer.id}
                    className="bg-stone-950/80 border border-stone-800 hover:border-amber-500/30 rounded-2xl p-4 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Avatar & Info */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-md shrink-0"
                          style={{ backgroundColor: beer.colorHex }}
                        >
                          <Beer className="w-6 h-6 text-white drop-shadow" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={beer.name}
                              onChange={(e) => {
                                const updated = [...beerList];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setBeerList(updated);
                              }}
                              className="font-bold text-sm text-white bg-transparent border-b border-stone-800 hover:border-amber-500 focus:border-amber-500 focus:outline-none px-1 py-0.5"
                            />
                            {beer.badge && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                                {beer.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-400">
                            <span className="text-amber-400/90 font-medium">{beer.style}</span>
                            <span>•</span>
                            <span>ABV: {beer.abv}%</span>
                            <span>•</span>
                            <span>IBU: {beer.ibu}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Prices Quick Inputs */}
                      <div className="grid grid-cols-3 gap-2 w-full lg:w-auto shrink-0 bg-stone-900/60 p-2 rounded-xl border border-stone-800">
                        <div className="text-center">
                          <span className="text-[10px] text-stone-400 block font-medium">Barril 30L</span>
                          <div className="relative mt-0.5">
                            <span className="absolute left-1.5 top-1 text-[9px] text-stone-500">R$</span>
                            <input
                              type="number"
                              value={beer.price30L || ''}
                              onChange={(e) => {
                                const updated = [...beerList];
                                updated[idx] = { ...updated[idx], price30L: parseFloat(e.target.value) || 0 };
                                setBeerList(updated);
                              }}
                              className="w-20 bg-stone-950 border border-stone-800 rounded px-1 pl-5 py-0.5 text-xs text-white font-bold text-center"
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[10px] text-amber-400 block font-medium">Barril 50L</span>
                          <div className="relative mt-0.5">
                            <span className="absolute left-1.5 top-1 text-[9px] text-amber-500">R$</span>
                            <input
                              type="number"
                              value={beer.price50L || ''}
                              onChange={(e) => {
                                const updated = [...beerList];
                                updated[idx] = { ...updated[idx], price50L: parseFloat(e.target.value) || 0 };
                                setBeerList(updated);
                              }}
                              className="w-20 bg-stone-950 border border-amber-500/40 rounded px-1 pl-5 py-0.5 text-xs text-amber-300 font-bold text-center"
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[10px] text-stone-400 block font-medium">Growler</span>
                          <div className="relative mt-0.5">
                            <span className="absolute left-1.5 top-1 text-[9px] text-stone-500">R$</span>
                            <input
                              type="number"
                              value={beer.priceGrowler || ''}
                              onChange={(e) => {
                                const updated = [...beerList];
                                updated[idx] = { ...updated[idx], priceGrowler: parseFloat(e.target.value) || 0 };
                                setBeerList(updated);
                              }}
                              className="w-16 bg-stone-950 border border-stone-800 rounded px-1 pl-5 py-0.5 text-xs text-white font-bold text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 w-full lg:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => handleMoveBeer(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-30"
                          title="Subir posição"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveBeer(idx, 'down')}
                          disabled={idx === beerList.length - 1}
                          className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-30"
                          title="Descer posição"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenProductModal && onOpenProductModal(beer)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar Tudo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateBeer(beer)}
                          className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
                          title="Duplicar Chopp"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBeer(beer.id)}
                          className="p-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-900/50"
                          title="Excluir Chopp"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IDENTIDADE & LOGOTIPO */}
          {activeTab === 'identidade' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  Nome da Empresa & Identidade Visual
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Nome Principal da Marca *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Subtítulo / Ramo de Atuação *</label>
                    <input
                      type="text"
                      required
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Slogan de Benefícios e Capacidades</label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Logo Uploader / URL */}
                <div className="pt-3 border-t border-stone-800 space-y-3">
                  <label className="block text-xs font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    Brasão / Logotipo Oficial
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-950 border-2 border-amber-500/40 shrink-0 shadow-lg flex items-center justify-center">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Beer className="w-8 h-8 text-amber-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Carregar Imagem do Dispositivo</span>
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoFileUpload}
                          accept="image/*"
                          className="hidden"
                        />

                        {formData.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, logoUrl: DEFAULT_CONFIG.logoUrl })}
                            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
                          >
                            Restaurar Brasão Original
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Ou cole a URL direta da imagem (ex: https://...)"
                          value={formData.logoUrl || ''}
                          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-300 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTATOS & WHATSAPP */}
          {activeTab === 'contatos' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  Números de Atendimento & Mensagens Automáticas
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">
                      WhatsApp Principal (Vendas e Pedidos) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 5511999998888 ou 11999998888"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Formato no site: {formatPhoneDisplay(formData.primaryPhone)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">
                      WhatsApp de Plantão Técnico / Suporte
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 5511988887777"
                      value={formData.supportPhone}
                      onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    Mensagem Padrão de Primeiro Contato no WhatsApp de Vendas
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whatsappWelcomeMessage || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappWelcomeMessage: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    Mensagem Padrão de Chamado de Suporte Técnico
                  </label>
                  <textarea
                    rows={2}
                    value={formData.supportWelcomeMessage || ''}
                    onChange={(e) => setFormData({ ...formData, supportWelcomeMessage: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    Perfil do Instagram (sem o @)
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.instagramUser}
                      onChange={(e) => setFormData({ ...formData, instagramUser: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROMOÇÕES & BANNERS */}
          {activeTab === 'promocoes' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Banner de Destaque Promocional
                </h4>

                <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
                  <div>
                    <span className="font-bold text-sm text-white block">Exibir Banner no Topo</span>
                    <span className="text-xs text-stone-400">Ativa a chamada promocional abaixo do cabeçalho</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.promoBanner?.enabled ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promoBanner: {
                          ...(formData.promoBanner || DEFAULT_CONFIG.promoBanner),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Título da Promoção</label>
                    <input
                      type="text"
                      value={formData.promoBanner?.title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promoBanner: {
                            ...(formData.promoBanner || DEFAULT_CONFIG.promoBanner),
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Descrição / Benefício</label>
                    <input
                      type="text"
                      value={formData.promoBanner?.subtitle || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promoBanner: {
                            ...(formData.promoBanner || DEFAULT_CONFIG.promoBanner),
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Texto do Botão de Ação</label>
                      <input
                        type="text"
                        value={formData.promoBanner?.buttonText || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promoBanner: {
                              ...(formData.promoBanner || DEFAULT_CONFIG.promoBanner),
                              buttonText: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Chopp Inicial no Simulador</label>
                      <select
                        value={formData.promoBanner?.targetBeerId || beerList[0]?.id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promoBanner: {
                              ...(formData.promoBanner || DEFAULT_CONFIG.promoBanner),
                              targetBeerId: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        {beerList.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.style})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Header Badge */}
                <div className="pt-3 border-t border-stone-800">
                  <label className="block text-xs text-stone-400 mb-1">
                    Frase do Selo Superior (Topo do Header)
                  </label>
                  <input
                    type="text"
                    value={formData.bannerBadge}
                    onChange={(e) => setFormData({ ...formData, bannerBadge: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SELOS DE VANTAGEM */}
          {activeTab === 'selos' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Os 4 Selos de Confiança & Vantagens
                </h4>
                <p className="text-xs text-stone-400">
                  Personalize os quatro cartões de garantia exibidos na página inicial.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(formData.trustBadges || DEFAULT_TRUST_BADGES).map((badge, idx) => (
                    <div key={badge.id} className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">Selo #{idx + 1}</span>
                        <select
                          value={badge.icon}
                          onChange={(e) => handleUpdateBadge(idx, 'icon', e.target.value)}
                          className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-300"
                        >
                          <option value="Truck">Caminhão / Entrega</option>
                          <option value="Beer">Chopp / Barril</option>
                          <option value="ShieldCheck">Escudo / Higienização</option>
                          <option value="MessageCircle">WhatsApp / Atendimento</option>
                          <option value="Zap">Raio / Agilidade</option>
                          <option value="Award">Medalha / Qualidade</option>
                          <option value="Clock">Relógio / Pontualidade</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 mb-0.5">Título</label>
                        <input
                          type="text"
                          value={badge.title}
                          onChange={(e) => handleUpdateBadge(idx, 'title', e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 mb-0.5">Subtítulo</label>
                        <input
                          type="text"
                          value={badge.subtitle}
                          onChange={(e) => handleUpdateBadge(idx, 'subtitle', e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LOCAIS & HORÁRIOS */}
          {activeTab === 'locais' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Endereço & Cobertura de Entregas
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Endereço Completo</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Cidade e Estado</label>
                    <input
                      type="text"
                      value={formData.cityState}
                      onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Link do Google Maps</label>
                  <input
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Delivery Regions */}
                <div className="pt-3 border-t border-stone-800 space-y-2">
                  <label className="block text-xs font-bold text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400" />
                    Regiões e Bairros Atendidos
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Zona Sul, Centro, Barueri, Santo André..."
                      value={newRegionInput}
                      onChange={(e) => setNewRegionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRegion();
                        }
                      }}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddRegion}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-stone-950 font-bold text-xs rounded-xl"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.deliveryZones.map((zone) => (
                      <span
                        key={zone}
                        className="bg-stone-900 text-stone-200 border border-stone-800 px-3 py-1 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        {zone}
                        <button
                          type="button"
                          onClick={() => handleRemoveRegion(zone)}
                          className="text-stone-500 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="pt-3 border-t border-stone-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Horários de Funcionamento
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Dias de Semana</label>
                      <input
                        type="text"
                        value={formData.workingHoursWeekday}
                        onChange={(e) => setFormData({ ...formData, workingHoursWeekday: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Final de Semana & Feriados</label>
                      <input
                        type="text"
                        value={formData.workingHoursWeekend}
                        onChange={(e) => setFormData({ ...formData, workingHoursWeekend: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PAGAMENTOS & PIX */}
          {activeTab === 'pagamentos' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  Configuração de Recebimento PIX
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Tipo de Chave PIX</label>
                    <select
                      value={formData.pixKeyType}
                      onChange={(e) => setFormData({ ...formData, pixKeyType: e.target.value as any })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="CNPJ">CNPJ</option>
                      <option value="CPF">CPF</option>
                      <option value="Telefone">Telefone</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Chave Aleatória">Chave Aleatória</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-400 mb-1">Chave PIX</label>
                    <input
                      type="text"
                      value={formData.pixKey}
                      onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DÚVIDAS FREQUENTES (FAQ) */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    Perguntas e Respostas do FAQ
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Dúvida</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.faqs || DEFAULT_FAQS).map((faq, idx) => (
                    <div key={faq.id || idx} className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-400">Pergunta #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(idx)}
                          className="p-1 rounded-lg text-stone-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Ex: A chopeira acompanha o barril?"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-white font-bold"
                      />

                      <textarea
                        rows={2}
                        placeholder="Resposta explicativa..."
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BACKUP & RESTAURAÇÃO */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Backup e Segurança dos Dados da sua Loja
                </h4>
                <p className="text-xs text-stone-300">
                  Salve uma cópia de segurança de todos os seus produtos, fotos, textos e preços para restaurar a qualquer momento.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                    <span className="text-xs font-bold text-white block">Exportar Arquivo de Backup</span>
                    <p className="text-[11px] text-stone-400">
                      Gera um arquivo JSON com todas as configurações, catálogo de barris e personalizações.
                    </p>
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-stone-700"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Baixar Backup JSON</span>
                    </button>
                  </div>

                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                    <span className="text-xs font-bold text-white block">Importar Arquivo de Backup</span>
                    <p className="text-[11px] text-stone-400">
                      Carregue um arquivo JSON salvo anteriormente para restaurar todas as opções.
                    </p>
                    <button
                      type="button"
                      onClick={() => jsonImportRef.current?.click()}
                      className="w-full px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-stone-700"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Carregar Arquivo JSON</span>
                    </button>
                    <input
                      type="file"
                      ref={jsonImportRef}
                      onChange={handleImportBackup}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-400 block">Restaurar Padrões de Fábrica</span>
                    <span className="text-[11px] text-stone-500">Voltar a Santtêo e o catálogo para a versão inicial</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFactory}
                    className="px-4 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resetar Tudo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-950 px-5 sm:px-6 py-4 border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
          >
            Cancelar
          </button>

          <button
            id="btn-save-all-settings"
            type="button"
            onClick={() => handleSaveAll()}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Todas as Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
