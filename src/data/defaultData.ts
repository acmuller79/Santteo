import { BeerProduct, DistributorConfig, QuickAction, TrustBadge, FAQItem } from '../types';
import santteoLogo from '../assets/images/santteo_shield_logo.jpg';

export const DEFAULT_TRUST_BADGES: TrustBadge[] = [
  {
    id: 'badge-1',
    title: 'Entrega Pontual',
    subtitle: 'Balneário Camboriú e Região',
    icon: 'Truck'
  },
  {
    id: 'badge-2',
    title: 'Chopp Sempre Gelado',
    subtitle: 'Direto da câmara fria',
    icon: 'Beer'
  },
  {
    id: 'badge-3',
    title: 'Chopeiras Testadas',
    subtitle: 'Higienizadas a cada uso',
    icon: 'ShieldCheck'
  },
  {
    id: 'badge-4',
    title: 'Plantão WhatsApp',
    subtitle: '(47) 99753-8325',
    icon: 'MessageCircle'
  }
];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'A chopeira acompanha o barril?',
    answer: 'Sim! Em pedidos de barris de 30L ou 50L fornecemos a chopeira com kit completo regulado, cilindro de CO2 e instalação no seu evento sem complicação.'
  },
  {
    id: 'faq-2',
    question: 'Vocês entregam e instalam em Balneário Camboriú e Região?',
    answer: 'Sim! Entregamos pontualmente em Balneário Camboriú e Região, realizamos toda a instalação da chopeira e deixamos o chopp na temperatura ideal para você servir.'
  },
  {
    id: 'faq-3',
    question: 'Quais tamanhos de barril estão disponíveis?',
    answer: 'Trabalhamos exclusivamente com os tamanhos de 30 Litros e 50 Litros, garantindo o melhor padrão de qualidade, temperatura e custo-benefício.'
  },
  {
    id: 'faq-4',
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos PIX oficial (CNPJ: 68.615.867/0001-95 - Titular: Renan da Silva Rocha) e Cartões de Crédito (com opção de parcelamento em até 12x) ou Débito.'
  },
  {
    id: 'faq-5',
    question: 'Quanto tempo antes devo fazer o pedido?',
    answer: 'Recomendamos reservar com antecedência para garantir chopeiras no fim de semana. Para pedidos de última hora, consulte disponibilidade no WhatsApp!'
  }
];

export const DEFAULT_CONFIG: DistributorConfig = {
  name: 'Santtêo',
  tagline: 'Distribuição & Fornecimento de Chopp',
  slogan: 'Barris de 30L e 50L • Chopeiras Elétricas • Balneário Camboriú e Região',
  logoUrl: santteoLogo,
  primaryPhone: '5547997538325',
  supportPhone: '5547997538325',
  whatsappWelcomeMessage: 'Olá! Gostaria de fazer um pedido de chopp Santtêo para entrega em Balneário Camboriú e Região.',
  supportWelcomeMessage: 'Olá! Preciso de atendimento técnico sobre a chopeira ou evento em Balneário Camboriú e Região.',
  instagramUser: 'santteochopp',
  address: 'Balneário Camboriú e Região',
  cityState: 'Balneário Camboriú e Região',
  googleMapsUrl: 'https://maps.google.com/?q=Balneario+Camboriu+SC',
  pixKey: '68.615.867/0001-95',
  pixKeyType: 'CNPJ',
  pixName: 'Renan da Silva Rocha',
  workingHoursWeekday: 'Segunda a Sexta: 08:00 às 20:00',
  workingHoursWeekend: 'Sábado e Domingo: 08:00 às 22:00 (Plantão p/ Eventos)',
  deliveryZones: ['Balneário Camboriú e Região'],
  bannerBadge: '⚡ Chopp Santtêo em Balneário Camboriú e Região • Chopeiras Inclusas',
  freeChopeiraOnKegs: true,
  promoBanner: {
    enabled: true,
    title: 'Chopeira Elétrica Inclusa nos Barris de 30L e 50L',
    subtitle: 'Levamos o kit completo regulado com CO2 e instalação no seu evento em Balneário Camboriú e Região!',
    buttonText: 'Aproveitar Promoção',
    targetBeerId: 'pilsen-puro-malte'
  },
  trustBadges: DEFAULT_TRUST_BADGES,
  faqs: DEFAULT_FAQS
};

export const DEFAULT_BEERS: BeerProduct[] = [
  {
    id: 'pilsen-puro-malte',
    name: 'Pilsen Puro Malte',
    style: 'Pilsen Artesanal',
    tagline: 'O mais pedido! Leve, refrescante e dourado.',
    description: 'Produzido 100% com malte de cevada selecionado e lúpulos nobres. Espuma cremosa, colarinho persistente e sabor limpo. A escolha perfeita para churrascos, festas de família e aniversários.',
    abv: 4.8,
    ibu: 12,
    colorHex: '#E5A93C',
    badge: 'Campeão de Vendas',
    availableSizes: ['30L', '50L'],
    price30L: 380,
    price50L: 590,
    temperature: '0°C a 2°C',
    pairings: 'Churrasco, petiscos fritos, hambúrgueres e queijos leves',
  },
  {
    id: 'chopp-ipa',
    name: 'American IPA',
    style: 'India Pale Ale',
    tagline: 'Aromático, cítrico e com amargor marcante.',
    description: 'Cerveja marcante com generosa adição de lúpulos americanos no dry-hopping. Notas tropicais de maracujá e manga, corpo médio e final seco e refrescante para os amantes de cerveja lupulada.',
    abv: 6.2,
    ibu: 48,
    colorHex: '#C67A1D',
    badge: 'Para Apaixonados por Lúpulo',
    availableSizes: ['30L', '50L'],
    price30L: 490,
    price50L: 750,
    temperature: '3°C a 5°C',
    pairings: 'Carnes defumadas, costela ao barbecue, queijos maturados e burgers gourmet',
  },
  {
    id: 'chopp-vinho',
    name: 'Chopp de Vinho Tinto',
    style: 'Draft Wine Beer',
    tagline: 'Doce, aveludado e irresistível.',
    description: 'A combinação equilibrada entre o chopp pilsen leve e o suco concentrado de uvas bordô selecionadas. Refrescante, adocicado e de cor púrpura intensa.',
    abv: 5.5,
    ibu: 8,
    colorHex: '#72173C',
    badge: 'Sucesso em Festas',
    availableSizes: ['30L', '50L'],
    price30L: 420,
    price50L: 660,
    temperature: '1°C a 3°C',
    pairings: 'Sobremesas, massas, tábuas de frios e noites festivas',
  },
  {
    id: 'weissbier',
    name: 'Weissbier Trigo Alemão',
    style: 'Cerveja de Trigo',
    tagline: 'Cremosa com notas de banana e cravo.',
    description: 'Clássica receita bávara não filtrada. Corpo aveludado, turvação natural de trigo, espuma densa e aromas delicados frutados e especiarias.',
    abv: 5.2,
    ibu: 14,
    colorHex: '#DDA83A',
    badge: 'Super Refrescante',
    availableSizes: ['30L', '50L'],
    price30L: 440,
    price50L: 680,
    temperature: '2°C a 4°C',
    pairings: 'Peixes, frutos do mar, saladas e comidas alemãs',
  },
  {
    id: 'chopp-black',
    name: 'Dunkel / Black Malt',
    style: 'Chopp Escuro',
    tagline: 'Notas tostadas de café e chocolate suave.',
    description: 'Cerveja escura de baixa fermentação com maltes torrados especiais. Dulçor sutil na medida certa, sem amargor excessivo e com sensação sedosa na boca.',
    abv: 4.6,
    ibu: 16,
    colorHex: '#2B1A13',
    badge: 'Saboroso e Encorpado',
    availableSizes: ['30L', '50L'],
    price30L: 410,
    price50L: 640,
    temperature: '4°C a 6°C',
    pairings: 'Carnes vermelhas assadas, fondue, queijos fortes e chocolates',
  },
  {
    id: 'session-apa',
    name: 'Session APA',
    style: 'American Pale Ale',
    tagline: 'Amargor suave, muito aroma e alta drinkability.',
    description: 'Leve como um pilsen, aromática como uma IPA. Perfeita para beber a tarde inteira com os amigos sem cansar o paladar.',
    abv: 4.4,
    ibu: 26,
    colorHex: '#D8942B',
    badge: 'Ideal para Churrasco',
    availableSizes: ['30L', '50L'],
    price30L: 450,
    price50L: 700,
    temperature: '2°C a 4°C',
    pairings: 'Linguiças artesanais, picanha, petiscos de boteco e frango a passarinho',
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'falar-vendedor',
    title: 'Falar com Vendedor no WhatsApp',
    subtitle: 'Atendimento imediato para dúvidas e orçamentos',
    icon: 'MessageCircle',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Gostaria de falar com um atendente para tirar dúvidas e fazer um orçamento de chopp.',
    highlight: true,
    enabled: true,
    colorScheme: 'green',
  },
  {
    id: 'montar-pedido',
    title: 'Monte seu Pedido Online',
    subtitle: 'Escolha barril, chopeira, data e envie direto no WhatsApp',
    icon: 'Beer',
    type: 'order',
    highlight: true,
    enabled: true,
    colorScheme: 'amber',
  },
  {
    id: 'calculadora',
    title: 'Calculadora de Chopp p/ Eventos',
    subtitle: 'Calcule a quantidade exata de litros para seus convidados',
    icon: 'Calculator',
    type: 'calculator',
    enabled: true,
    colorScheme: 'blue',
  },
  {
    id: 'ver-cardapio',
    title: 'Ver Catálogo Completo de Barris',
    subtitle: 'Preços, estilos artesanais, IBU, ABV e barris disponíveis',
    icon: 'BookOpen',
    type: 'catalog',
    enabled: true,
    colorScheme: 'amber',
  },
  {
    id: 'instagram',
    title: 'Nosso Instagram Oficial',
    subtitle: 'Fotos de eventos, vídeos das chopeiras e novidades',
    icon: 'Instagram',
    type: 'instagram',
    enabled: true,
    colorScheme: 'purple',
  },
  {
    id: 'maps',
    title: 'Como Chegar / Localização',
    subtitle: 'Veja no mapa para retirada ou verificar raio de entrega',
    icon: 'MapPin',
    type: 'maps',
    enabled: true,
    colorScheme: 'slate',
  },
  {
    id: 'suporte-chopeira',
    title: 'Plantão Técnico & Chopeiras',
    subtitle: 'Dúvidas de regulagem de gás, temperatura ou emergência',
    icon: 'Wrench',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Preciso de suporte técnico sobre a chopeira ou instalação do barril durante meu evento.',
    enabled: true,
    colorScheme: 'slate',
  },
  {
    id: 'pix-pagamento',
    title: 'Chave PIX e Formas de Pagamento',
    subtitle: 'Copiar chave PIX rápida e consultar parcelamento',
    icon: 'CreditCard',
    type: 'pix',
    enabled: true,
    colorScheme: 'green',
  }
];

export const FREQUENT_QUESTIONS = DEFAULT_FAQS;

