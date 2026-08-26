import confetti from 'canvas-confetti';
import { BeerProduct, DistributorConfig, OrderState } from '../types';

export function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) {
    return digits;
  }
  // If Brazilian format without country code (e.g. 11999998888)
  if (digits.length >= 10 && digits.length <= 11) {
    return `55${digits}`;
  }
  return digits;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const part1 = digits.slice(4, 9);
    const part2 = digits.slice(9);
    return `(${ddd}) ${part1}-${part2}`;
  }
  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7);
    return `(${ddd}) ${part1}-${part2}`;
  }
  return phone;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function buildDirectWhatsAppUrl(phone: string, text: string): string {
  const cleaned = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function openWhatsApp(phone: string, text: string): void {
  const url = buildDirectWhatsAppUrl(phone, text);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function generateOrderWhatsAppMessage(
  order: OrderState,
  beer: BeerProduct | undefined,
  config: DistributorConfig,
  estimatedTotal: number
): string {
  const tapNames: Record<string, string> = {
    'eletrica-220v': 'Chopeira Elétrica (220V)',
    'eletrica-110v': 'Chopeira Elétrica (110V)',
    'gelo': 'Chopeira a Gelo com Serpentina',
    'nenhuma': 'Não preciso de chopeira (já possuo)',
  };

  const lines: string[] = [
    `🍻 *NOVO PEDIDO DE CHOPP - ${config.name.toUpperCase()}*`,
    `--------------------------------------`,
    `👤 *Cliente:* ${order.customerName || 'Não informado'}`,
    `📱 *Telefone/WhatsApp:* ${order.customerPhone || 'Não informado'}`,
    ``,
    `🍺 *ESTILO DO CHOPP:*`,
    `• Cerveja: *${beer?.name || 'Não selecionado'}* (${beer?.style || ''})`,
    `• Tamanho/Tipo: *${order.kegSize}*`,
    `• Quantidade de barris: *${order.quantity} un.*`,
    ``,
    `🔌 *EQUIPAMENTO & ACESSÓRIOS:*`,
    `• Chopeira: ${tapNames[order.tapType] || order.tapType}`,
    order.includeCups ? `• Incluir Copos descartáveis 400ml: Sim` : ``,
    order.includeIce ? `• Incluir Saco de Gelo (para chopeira a gelo): Sim` : ``,
    ``,
    `📅 *DATA & LOCAL DO EVENTO:*`,
    `• Data do Evento: *${order.eventDate || 'A combinar'}*`,
    order.eventTime ? `• Horário previsto: ${order.eventTime}` : ``,
    `• Modalidade: *${order.deliveryType === 'entrega' ? '🚚 Entrega e Instalação no local' : '🏢 Retirada no Balcão'}*`,
    order.deliveryType === 'entrega' && order.deliveryAddress
      ? `• Endereço: ${order.deliveryAddress}`
      : ``,
    order.notes ? `• Observações: ${order.notes}` : ``,
    `--------------------------------------`,
    `💰 *VALOR ESTIMADO DO PEDIDO:* *${formatCurrency(estimatedTotal)}*`,
    `_(Consulte taxa de entrega e eventuais condições de parcelamento)_`,
    ``,
    `Olá! Preenchi os dados no site e gostaria de confirmar a disponibilidade e fechar o pedido!`
  ];

  return lines.filter((l) => l !== '').join('\n');
}

export function triggerOrderConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#D97706', '#10B981', '#3B82F6', '#EF4444'],
    });
  } catch (e) {
    // Graceful fallback if confetti fails
    console.debug('Confetti error:', e);
  }
}
