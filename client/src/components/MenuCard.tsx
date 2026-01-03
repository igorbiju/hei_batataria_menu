import { Flame } from 'lucide-react';

interface MenuCardProps {
  sabor: string;
  descricao: string;
  preco: string;
  isNew?: boolean;
}

export default function MenuCard({ sabor, descricao, preco, isNew }: MenuCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-100">
      {/* Badge de novo */}
      {isNew && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF6B35] to-[#EF2B2D] text-white px-3 py-1 text-xs font-accent font-bold rounded-bl-lg z-10">
          NOVO!
        </div>
      )}

      {/* Ícone de chama no canto */}
      <div className="absolute top-3 left-3 text-[#FFD700] opacity-60 group-hover:opacity-100 transition-opacity">
        <Flame size={20} />
      </div>

      {/* Conteúdo */}
      <div className="p-5 space-y-3">
        {/* Nome do sabor */}
        <h3 className="font-heading text-lg text-[#EF2B2D] leading-tight">
          {sabor}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {descricao}
        </p>

        {/* Preço */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Preço</span>
          <span className="font-accent text-xl text-[#FF6B35] font-bold">
            {preco}
          </span>
        </div>
      </div>

      {/* Efeito de hover - barra colorida na base */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF2B2D] via-[#FFD700] to-[#FF6B35] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
}
