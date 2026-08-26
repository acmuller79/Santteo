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

export interface DistributorConfig {
  name: string;
  tagline: string;
  slogan: string;
  logoUrl?: string;
  primaryPhone: string; // E.g. "5511999999999"
  supportPhone: string; // E.g. "5511988888888"
  instagramUser: string; // E.g. "distribuidoradechopp"
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
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'whatsapp' | 'instagram' | 'maps' | 'calculator' | 'catalog' | 'order' | 'pix' | 'call';
  whatsappMessage?: string;
  url?: string;
  highlight?: boolean;
  colorScheme: 'green' | 'amber' | 'blue' | 'purple' | 'slate';
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
