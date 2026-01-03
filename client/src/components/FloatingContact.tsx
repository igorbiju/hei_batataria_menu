import { MessageCircle } from 'lucide-react';

interface FloatingContactProps {
  phone: string;
}

export default function FloatingContact({ phone }: FloatingContactProps) {
  const whatsappLink = `https://wa.me/55${phone.replace(/\D/g, '')}?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido.`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contato via WhatsApp"
    >
      {/* Botão flutuante */}
      <div className="relative">
        {/* Pulso de fundo */}
        <div className="absolute inset-0 bg-[#EF2B2D] rounded-full animate-pulse opacity-75"></div>

        {/* Botão principal */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#EF2B2D] rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 hover:scale-110 cursor-pointer">
          <MessageCircle size={28} className="text-white" />
        </div>

        {/* Texto ao hover */}
        <div className="absolute bottom-full right-0 mb-3 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg text-sm font-accent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none">
          {phone}
        </div>
      </div>
    </a>
  );
}
