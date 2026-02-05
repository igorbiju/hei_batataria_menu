import { Flame } from 'lucide-react';

interface MenuCardProps {
  sabor: string;
  descricao: string;
  preco: string;
  isNew?: boolean;
  imagem?: string;
}

// Mapa de imagens para cada sabor
const imagemMap: Record<string, string> = {
  'BACON COM CHEDDAR': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/ilWzeK2OBSP8gEukNsNFkj-img-1_1770326833000_na1fn_YmF0YXRhLWJhY29uLWNoZWRkYXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'BACON COM CATUPIRY': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/ilWzeK2OBSP8gEukNsNFkj-img-2_1770326835000_na1fn_YmF0YXRhLWJhY29uLWNhdHVwaXJ5.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'CALABRESA COM CHEDDAR': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/ilWzeK2OBSP8gEukNsNFkj-img-3_1770326829000_na1fn_YmF0YXRhLWNhbGFicmVzYS1jaGVkZGFy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'CALABRESA COM CATUPIRY': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/ilWzeK2OBSP8gEukNsNFkj-img-4_1770326833000_na1fn_YmF0YXRhLWNhbGFicmVzYS1jYXR1cGlyeQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'CARNE COM CHEDDAR': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/ilWzeK2OBSP8gEukNsNFkj-img-5_1770326835000_na1fn_YmF0YXRhLWNhcm5lLWNoZWRkYXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'CARNE COM CATUPIRY': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/JF6TopStEFVytyAyy3HpC6-img-1_1770326858000_na1fn_YmF0YXRhLWNhcm5lLWNhdHVwaXJ5.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'PALMITO COM CHEDDAR': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/JF6TopStEFVytyAyy3HpC6-img-2_1770326861000_na1fn_YmF0YXRhLXBhbG1pdG8tY2hlZGRhcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'PALMITO COM CATUPIRY': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/JF6TopStEFVytyAyy3HpC6-img-3_1770326862000_na1fn_YmF0YXRhLXBhbG1pdG8tY2F0dXBpcnk.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'PIZZA': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/JF6TopStEFVytyAyy3HpC6-img-4_1770326859000_na1fn_YmF0YXRhLXBpenph.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'HOT DOG (NOVO!)': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/JF6TopStEFVytyAyy3HpC6-img-5_1770326863000_na1fn_YmF0YXRhLWhvdGRvZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'STROGONOFF DE FRANGO (ESPECIAL!)': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/xNzacHHouaLTPBxP3Pb4Tw-img-1_1770326889000_na1fn_YmF0YXRhLXN0cm9nb25vZmY.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
  'COSTELA': 'https://private-us-east-1.manuscdn.com/sessionFile/Nr14IlTnA1Lzfd8COBHpfe/sandbox/xNzacHHouaLTPBxP3Pb4Tw-img-2_1770326887000_na1fn_YmF0YXRhLWNvc3RlbGE.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80',
};

export default function MenuCard({ sabor, descricao, preco, isNew }: MenuCardProps) {
  const imagemUrl = imagemMap[sabor];

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-100">
      {/* Badge de novo */}
      {isNew && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF6B35] to-[#EF2B2D] text-white px-3 py-1 text-xs font-accent font-bold rounded-bl-lg z-10">
          NOVO!
        </div>
      )}

      {/* Imagem do produto */}
      {imagemUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <img
            src={imagemUrl}
            alt={sabor}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
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
