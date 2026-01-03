import MenuCard from '@/components/MenuCard';
import FloatingContact from '@/components/FloatingContact';
import { ChefHat } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MenuItem {
  sabor: string;
  descricao: string;
  preco: string;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const items: MenuItem[] = [
      {
        sabor: 'BACON COM CHEDDAR',
        descricao: 'Batata cozida recheada com bacon, cheddar, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'BACON COM CATUPIRY',
        descricao: 'Batata cozida recheada com bacon, catupiry, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'CALABRESA COM CHEDDAR',
        descricao: 'Batata cozida recheada com calabresa, cheddar, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'CALABRESA COM CATUPIRY',
        descricao: 'Batata cozida recheada com calabresa, catupiry, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'CARNE COM CHEDDAR',
        descricao: 'Batata cozida recheada com carne, cheddar, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'CARNE COM CATUPIRY',
        descricao: 'Batata cozida recheada com carne, catupiry, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'PALMITO COM CHEDDAR',
        descricao: 'Batata cozida recheada com palmito, cheddar, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'PALMITO COM CATUPIRY',
        descricao: 'Batata cozida recheada com palmito, catupiry, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'PIZZA',
        descricao: 'Batata cozida recheada com presunto, milho, muçarela, tomate e orégano.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'HOT DOG (NOVO!)',
        descricao: 'Batata cozida recheada com salsicha ao molho, milho e tomate.',
        preco: 'R$ 24,90'
      },
      {
        sabor: 'STROGONOFF DE FRANGO',
        descricao: 'Batata cozida recheada com strogonoff de frango, milho e tomate.',
        preco: 'R$ 29,90'
      }
    ];

    setMenuItems(items);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EF2B2D] via-[#FF6B35] to-[#EF2B2D] pt-12 pb-16">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Logo */}
            <div className="animate-bounce" style={{ animationDuration: '2s' }}>
              <img
                src="/images/logo.png"
                alt="HEI! BATATARIA"
                className="h-40 w-auto drop-shadow-2xl"
              />
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h1 className="font-display text-5xl md:text-6xl text-white drop-shadow-lg">
                HEI! BATATARIA
              </h1>
              <p className="text-xl text-white/90 font-light">
                Batatas recheadas deliciosas e irresistíveis
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white border border-white/30">
              <ChefHat size={20} />
              <span className="font-accent">Escolha seu sabor favorito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Título da seção */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-[#EF2B2D] mb-2">
              Nosso Cardápio
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFD700] to-[#FF6B35] mx-auto rounded-full"></div>
          </div>

          {/* Grid de produtos */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin mb-4">
                  <ChefHat size={48} className="text-[#EF2B2D]" />
                </div>
                <p className="text-gray-600">Carregando cardápio...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`
                  }}
                >
                  <MenuCard
                    sabor={item.sabor}
                    descricao={item.descricao}
                    preco={item.preco}
                    isNew={item.sabor.includes('NOVO!')}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção de informações */}
      <section className="py-12 bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-display text-[#FFD700]">11</div>
              <p className="text-gray-300">Sabores disponíveis</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display text-[#FF6B35]">100%</div>
              <p className="text-gray-300">Qualidade garantida</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display text-[#EF2B2D]">Fresco</div>
              <p className="text-gray-300">Preparado na hora</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Sobre */}
            <div>
              <h3 className="font-heading text-lg text-[#EF2B2D] mb-3">
                Sobre HEI! BATATARIA
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Somos especialistas em batatas recheadas deliciosas, preparadas com ingredientes frescos e de qualidade. Venha nos visitar e aproveite nossos sabores incríveis!
              </p>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-heading text-lg text-[#EF2B2D] mb-3">
                Contato
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  <span className="font-accent text-[#FF6B35]">Telefone:</span> (43) 9-8869-7421
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-accent text-[#FF6B35]">Pedidos:</span> Via WhatsApp
                </p>
                <a
                  href="https://wa.me/5543988697421?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-[#EF2B2D] text-white rounded-lg text-sm font-accent hover:bg-[#C41E3A] transition-colors duration-300"
                >
                  Fazer Pedido
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; 2025 HEI! BATATARIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Botão flutuante de contato */}
      <FloatingContact phone="(43) 9-8869-7421" />

      {/* Animação de fade-in */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
