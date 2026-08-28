export interface BeerProduct {
  id: string;
  name: string;
  style: string;
  tagline: string;
  description: string;
  abv: number; // % Alcohol
  ibu: number; // Bitterness
  colorHex: string;
  badge?: string;
  pricePerLiter?: number;
  availableSizes: ('20L' | '30L' | '50L' | 'Growler')[];
  price20L?: number;
  price30L?: number;
  price50L?: number;
  priceGrowler?: number;
  temperature: string;
  pairings: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
}

export interface TrustBadge {
  id: string;
  title: string;
  subtitle: string;
  icon: 'Truck' | 'Beer' | 'ShieldCheck' | 'MessageCircle' | 'Zap' | 'Award' | 'Clock';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PromoBannerConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  targetBeerId?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'whatsapp' | 'instagram' | 'maps' | 'calculator' | 'catalog' | 'order' | 'pix' | 'call' | 'custom';
  whatsappMessage?: string;
  url?: string;
  highlight?: boolean;
  enabled?: boolean;
  colorScheme: 'green' | 'amber' | 'blue' | 'purple' | 'slate' | 'red';
}

export interface DistributorConfig {
  name: string;
  tagline: string;
  slogan: string;
  logoUrl?: string;
  primaryPhone: string; // E.g. "5511999999999"
  supportPhone: string; // E.g. "5511988888888"
  whatsappWelcomeMessage?: string;
  supportWelcomeMessage?: string;
  instagramUser: string; // E.g. "santteochopp"
  address: string;
  cityState: string;
  googleMapsUrl: string;
  pixKey: string;
  pixKeyType: 'CNPJ' | 'CPF' | 'Telefone' | 'E-mail' | 'Chave Aleatória';
  workingHoursWeekday: string;
  workingHoursWeekend: string;
  deliveryZones: string[];
  bannerBadge: string;
  freeChopeiraOnKegs: boolean;
  promoBanner: PromoBannerConfig;
  trustBadges: TrustBadge[];
  faqs: FAQItem[];
  quickActions?: QuickAction[];
}

export interface OrderState {
  beerId: string;
  kegSize: '20L' | '30L' | '50L' | 'Growler';
  quantity: number;
  tapType: 'eletrica-220v' | 'eletrica-110v' | 'gelo' | 'nenhuma';
  eventDate: string;
  eventTime: string;
  deliveryType: 'entrega' | 'retirada';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string;
  includeCups: boolean;
  includeIce: boolean;
}

