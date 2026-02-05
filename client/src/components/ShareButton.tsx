import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShareButton() {
  const handleShare = () => {
    const urlSite = window.location.href;
    const mensagem = `Olá! Conheça o cardápio da HEI! BATATARIA 🍟

Batatas recheadas deliciosas e irresistíveis!

📱 Confira nosso cardápio completo:
${urlSite}

Temos 12 sabores incríveis:
✓ Bacon com Cheddar
✓ Bacon com Catupiry
✓ Calabresa com Cheddar
✓ Calabresa com Catupiry
✓ Carne com Cheddar
✓ Carne com Catupiry
✓ Palmito com Cheddar
✓ Palmito com Catupiry
✓ Pizza
✓ Hot Dog (NOVO!)
✓ Strogonoff de Frango (ESPECIAL!)
✓ Costela

Faça seu pedido direto pelo site! 🚀

Horário de funcionamento:
📅 Segunda a Sexta: 18h às 23h
📅 Sábado e Domingo: 11h às 23h

Telefone: (43) 9-8869-7421`;

    const numeroWhatsApp = '5543988697421';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
  };

  return (
    <Button
      onClick={handleShare}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-110 z-40"
      title="Compartilhar cardápio no WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="hidden sm:inline">Compartilhar</span>
    </Button>
  );
}
