import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Plus, Minus, Gift, Check } from 'lucide-react';

interface MenuItem {
  sabor: string;
  descricao: string;
  preco: string;
  disponivel?: boolean;
}

interface Cupom {
  codigo: string;
  desconto: number;
  tipo: 'percentual' | 'fixo';
  ativo: boolean;
}

interface OrderFormProps {
  menuItems: MenuItem[];
  cuponsDisponiveis?: Cupom[];
}

interface PedidoItem {
  sabor: string;
  quantidade: number;
  adicionais: string[];
}

// Mapeamento de cupons de desconto disponíveis
const cuponsdisponveis: { [key: string]: { desconto: number; tipo: 'percentual' | 'fixo'; descricao: string } } = {
  'PROMO10': { desconto: 10, tipo: 'percentual', descricao: '10% de desconto' },
  'PROMO20': { desconto: 20, tipo: 'percentual', descricao: '20% de desconto' },
  'DESCONTO5': { desconto: 5, tipo: 'fixo', descricao: 'R$ 5,00 de desconto' },
  'DESCONTO10': { desconto: 10, tipo: 'fixo', descricao: 'R$ 10,00 de desconto' },
  'FRETEGRATIS': { desconto: 100, tipo: 'percentual', descricao: 'Frete grátis' },
};

// Mapeamento de quais adicionais estão disponíveis em cada sabor
const adicionaisDisponiveis: { [key: string]: string[] } = {
  'BACON COM CHEDDAR': ['catupiry', 'calabresa', 'muçarela'],
  'BACON COM CATUPIRY': ['cheddar', 'bacon', 'calabresa', 'muçarela'],
  'CALABRESA COM CHEDDAR': ['bacon', 'catupiry', 'muçarela'],
  'CALABRESA COM CATUPIRY': ['bacon', 'cheddar', 'muçarela'],
  'CARNE COM CHEDDAR': ['bacon', 'calabresa', 'catupiry', 'muçarela'],
  'CARNE COM CATUPIRY': ['bacon', 'calabresa', 'cheddar', 'muçarela'],
  'PALMITO COM CHEDDAR': ['bacon', 'calabresa', 'catupiry', 'muçarela'],
  'PALMITO COM CATUPIRY': ['bacon', 'calabresa', 'cheddar', 'muçarela'],
  'PIZZA': ['bacon', 'calabresa', 'catupiry', 'cheddar', 'muçarela'],
  'HOT DOG (NOVO!)': ['bacon', 'calabresa', 'cheddar', 'catupiry', 'muçarela'],
  'STROGONOFF DE FRANGO': ['bacon', 'calabresa', 'cheddar', 'catupiry', 'muçarela'],
  'STROGONOFF DE FRANGO (ESPECIAL!)': ['bacon', 'calabresa', 'cheddar', 'catupiry', 'muçarela'],
  'COSTELA': ['bacon', 'calabresa', 'cheddar', 'catupiry', 'muçarela']
};

export default function OrderForm({ menuItems, cuponsDisponiveis = [] }: OrderFormProps) {
  const [selectedSabor, setSelectedSabor] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([]);
  const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
  
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [cidade, setCidade] = useState('');
  
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<Cupom | null>(null);
  const [mensagemCupom, setMensagemCupom] = useState('');

  const obterPreco = (sabor: string): number => {
    const menuArmazenado = localStorage.getItem('menu_hei_batataria');
    if (menuArmazenado) {
      const menu = JSON.parse(menuArmazenado);
      const item = menu.find((m: MenuItem) => m.sabor === sabor);
      if (item) {
        return parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
      }
    }
    
    const item = menuItems.find(m => m.sabor === sabor);
    return item ? parseFloat(item.preco.replace('R$ ', '').replace(',', '.')) : 0;
  };

  const toggleAdicional = (adicional: string) => {
    setAdicionaisSelecionados(prev =>
      prev.includes(adicional)
        ? prev.filter(a => a !== adicional)
        : [...prev, adicional]
    );
  };

  const adicionarAoPedido = () => {
    if (!selectedSabor) {
      alert('Por favor, selecione um sabor!');
      return;
    }

    const novoItem: PedidoItem = {
      sabor: selectedSabor,
      quantidade: quantidade,
      adicionais: adicionaisSelecionados
    };

    setPedidoItems([...pedidoItems, novoItem]);
    setSelectedSabor('');
    setQuantidade(1);
    setAdicionaisSelecionados([]);
  };

  const removerDoPedido = (index: number) => {
    setPedidoItems(pedidoItems.filter((_, i) => i !== index));
  };

  const calcularFrete = (): number => {
    const cidadeNormalizada = cidade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const ivaiporaVariacoes = ['ivaipora', 'ivaiporã', 'ivaipora'];
    
    const ehIvaipora = ivaiporaVariacoes.some(v => cidadeNormalizada.includes(v));
    
    if (ehIvaipora) {
      return 10;
    }
    
    const totalQuantidade = pedidoItems.reduce((sum, item) => sum + item.quantidade, 0);
    return totalQuantidade >= 4 ? 20 : 30;
  };

  const aplicarCupom = () => {
    if (!cupom.trim()) {
      setMensagemCupom('');
      setCupomAplicado(null);
      return;
    }

    const cupomUpper = cupom.toUpperCase();
    const cuponsArmazenados = localStorage.getItem('cupons_hei_batataria');
    const cuponsDisponiveisLocal = cuponsArmazenados ? JSON.parse(cuponsArmazenados) : [];
    
    const cupomEncontrado = cuponsDisponiveisLocal.find(
      (c: Cupom) => c.codigo.toUpperCase() === cupomUpper && c.ativo
    );

    if (cupomEncontrado) {
      setCupomAplicado(cupomEncontrado);
      const descricao = cupomEncontrado.tipo === 'percentual'
        ? `${cupomEncontrado.desconto}% de desconto`
        : `R$ ${cupomEncontrado.desconto.toFixed(2)} de desconto`;
      setMensagemCupom(`✓ Cupom "${cupomUpper}" aplicado! ${descricao}`);
      setCupom('');
    } else {
      setMensagemCupom('✗ Cupom inválido!');
      setCupomAplicado(null);
    }
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setCupom('');
    setMensagemCupom('');
  };

  const calcularDesconto = (subtotal: number): number => {
    if (!cupomAplicado) return 0;
    
    if (cupomAplicado.tipo === 'percentual') {
      return subtotal * (cupomAplicado.desconto / 100);
    } else {
      return cupomAplicado.desconto;
    }
  };

  const handleEnviarPedido = () => {
    if (!nomeCliente || !telefoneCliente || !enderecoEntrega || !cidade) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Telefone, Endereço e Cidade)!');
      return;
    }

    if (pedidoItems.length === 0) {
      alert('Por favor, adicione pelo menos um sabor ao pedido!');
      return;
    }

    // Verificar se algum item foi marcado como esgotado
    const menuArmazenado = localStorage.getItem('menu_hei_batataria');
    const menuAtualizado = menuArmazenado ? JSON.parse(menuArmazenado) : menuItems;
    
    const itensEsgotados = pedidoItems.filter(item => {
      const menuItem = menuAtualizado.find((m: MenuItem) => m.sabor === item.sabor);
      return menuItem && menuItem.disponivel === false;
    });

    if (itensEsgotados.length > 0) {
      const saboresEsgotados = itensEsgotados.map(item => item.sabor).join(', ');
      alert('DESCULPE! Os seguintes sabores estao ESGOTADOS e nao podem ser comprados no momento:\n\n' + saboresEsgotados + '\n\nPor favor, remova-os do pedido e tente novamente.');
      return;
    }

    // Calcular totais
    let subtotal = 0;
    let detalhePedido = '';
    let detalheCupom = '';

    pedidoItems.forEach((item, index) => {
      const precoUnitario = obterPreco(item.sabor);
      const totalAdicionais = item.adicionais.length * 3;
      const precoComAdicionais = precoUnitario + totalAdicionais;
      const totalItem = precoComAdicionais * item.quantidade;

      subtotal += totalItem;

      detalhePedido += `${index + 1}. ${item.sabor} (${item.quantidade}x)\n`;
      detalhePedido += `   Preço unitário: R$ ${precoUnitario.toFixed(2)}\n`;
      
      if (item.adicionais.length > 0) {
        detalhePedido += `   Adicionais: ${item.adicionais.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')} (${item.adicionais.length}x R$ 3,00)\n`;
        detalhePedido += `   Subtotal adicionais: R$ ${(item.adicionais.length * 3).toFixed(2)}\n`;
      }
      
      detalhePedido += `   Total do item: R$ ${totalItem.toFixed(2)}\n\n`;
    });

    const frete = calcularFrete();
    const desconto = calcularDesconto(subtotal);
    const totalComDesconto = subtotal - desconto;
    const total = totalComDesconto + frete;

    if (cupomAplicado) {
      if (cupomAplicado.tipo === 'percentual') {
        detalheCupom = `*Cupom:* ${cupomAplicado.codigo} (${cupomAplicado.desconto}% de desconto)
*Desconto:* -R$ ${desconto.toFixed(2)}
`;
      } else {
        detalheCupom = `*Cupom:* ${cupomAplicado.codigo} (R$ ${cupomAplicado.desconto.toFixed(2)} de desconto)
*Desconto:* -R$ ${Math.min(desconto, subtotal).toFixed(2)}
`;
      }
    }

    const mensagem = `*NOVO PEDIDO HEI! BATATARIA* 🍟\n\n` +
      `*Cliente:* ${nomeCliente}\n` +
      `*Telefone:* ${telefoneCliente}\n` +
      `*Endereço:* ${enderecoEntrega}\n` +
      `*Cidade:* ${cidade}\n\n` +
      `*DETALHES DO PEDIDO:*\n` +
      `${detalhePedido}\n` +
      `*Subtotal:* R$ ${subtotal.toFixed(2)}\n` +
      `${detalheCupom}` +
      `*Frete (${cidade}):* R$ ${frete.toFixed(2)}\n` +
      `*TOTAL:* R$ ${total.toFixed(2)}\n\n` +
      `Obrigado! 😊`;

    // Salvar pontos de fidelidade
    const clientesArmazenados = localStorage.getItem('clientes_fidelidade_hei_batataria');
    const clientes = clientesArmazenados ? JSON.parse(clientesArmazenados) : {};
    
    const pontosCriados = Math.floor(total);
    if (clientes[telefoneCliente]) {
      clientes[telefoneCliente] = {
        ...clientes[telefoneCliente],
        pontos: (clientes[telefoneCliente].pontos || 0) + pontosCriados,
        totalGasto: (clientes[telefoneCliente].totalGasto || 0) + total,
        ultimaCompra: new Date().toLocaleDateString('pt-BR')
      };
    } else {
      clientes[telefoneCliente] = {
        telefone: telefoneCliente,
        pontos: pontosCriados,
        totalGasto: total,
        ultimaCompra: new Date().toLocaleDateString('pt-BR')
      };
    }
    localStorage.setItem('clientes_fidelidade_hei_batataria', JSON.stringify(clientes));

    const numeroWhatsApp = '5543988697421';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
    
    alert('Pedido enviado! Voce acumulou ' + pontosCriados + ' pontos de fidelidade!');
  };

  const obterPontosCliente = () => {
    if (!telefoneCliente) return 0;
    const clientesArmazenados = localStorage.getItem('clientes_fidelidade_hei_batataria');
    const clientes = clientesArmazenados ? JSON.parse(clientesArmazenados) : {};
    return clientes[telefoneCliente]?.pontos || 0;
  };

  const adicionaisDisponivelParaSabor = selectedSabor ? (adicionaisDisponiveis[selectedSabor] || []) : [];
  const pontosCliente = obterPontosCliente();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-500">
        <h2 className="text-4xl font-bold text-red-600 mb-2 flex items-center gap-3">
          <MessageCircle className="w-8 h-8" />
          Faça Seu Pedido
        </h2>
        <p className="text-gray-600 mb-8">Selecione seus sabores, adicione adicionais e envie via WhatsApp!</p>

        {/* Pontos de Fidelidade */}
        {telefoneCliente && pontosCliente > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-8 border-2 border-amber-300">
            <p className="text-amber-900 font-bold">⭐ Seus pontos de fidelidade: <span className="text-2xl text-amber-600">{pontosCliente}</span></p>
            <p className="text-sm text-amber-800 mt-2">Resgate seus pontos no programa de fidelidade para ganhar descontos!</p>
          </div>
        )}

        {/* Seção de Seleção de Sabor */}
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-6 mb-8 border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4">1. Escolha um Sabor</h3>
          
          <select
            value={selectedSabor}
            onChange={(e) => setSelectedSabor(e.target.value)}
            className="w-full p-3 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 font-semibold text-gray-700"
          >
            <option value="">Selecione um sabor...</option>
            {menuItems.filter(item => item.disponivel !== false).map((item) => (
              <option key={item.sabor} value={item.sabor}>
                {item.sabor} - {item.preco}
              </option>
            ))}
          </select>
          
          {menuItems.some(item => item.disponivel === false) && (
            <p className="text-sm text-gray-500 mt-2 italic">
              Alguns sabores estão temporariamente indisponíveis
            </p>
          )}

          {selectedSabor && (
            <div className="bg-white p-4 rounded-lg border-2 border-yellow-300 mb-4 mt-4">
              <p className="text-gray-700 font-semibold mb-2">Descrição:</p>
              <p className="text-gray-600">{menuItems.find(m => m.sabor === selectedSabor)?.descricao}</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4 mt-4">
            <label className="font-semibold text-gray-700">Quantidade:</label>
            <div className="flex items-center gap-2 border-2 border-red-300 rounded-lg">
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="p-2 hover:bg-red-100 transition"
              >
                <Minus className="w-5 h-5 text-red-600" />
              </button>
              <span className="px-4 font-bold text-lg">{quantidade}</span>
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                className="p-2 hover:bg-red-100 transition"
              >
                <Plus className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Adicionais */}
        {selectedSabor && adicionaisDisponivelParaSabor.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl p-6 mb-8 border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-yellow-700 mb-4">2. Adicione Adicionais (R$ 3,00 cada)</h3>
            <p className="text-sm text-gray-600 mb-4">Disponíveis para este sabor:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {adicionaisDisponivelParaSabor.map((adicional) => (
                <button
                  key={adicional}
                  onClick={() => toggleAdicional(adicional)}
                  className={`p-3 rounded-lg font-semibold transition border-2 capitalize ${
                    adicionaisSelecionados.includes(adicional)
                      ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
                      : 'bg-white border-yellow-300 text-gray-700 hover:bg-yellow-50'
                  }`}
                >
                  {adicionaisSelecionados.includes(adicional) && <Check className="w-4 h-4 inline mr-1" />}
                  {adicional}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botão Adicionar ao Pedido */}
        {selectedSabor && (
          <button
            onClick={adicionarAoPedido}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg mb-8 flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Adicionar ao Pedido
          </button>
        )}

        {/* Resumo do Pedido */}
        {pedidoItems.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border-2 border-blue-300">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Seu Pedido</h3>
            
            <div className="space-y-3 mb-4">
              {pedidoItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border-2 border-blue-200 flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.sabor}</p>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantidade}x</p>
                    {item.adicionais.length > 0 && (
                      <p className="text-sm text-gray-600">Adicionais: {item.adicionais.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}</p>
                    )}
                    <p className="text-sm font-semibold text-green-600 mt-2">
                      R$ {((obterPreco(item.sabor) + item.adicionais.length * 3) * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removerDoPedido(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção de Cupom */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border-2 border-purple-300">
          <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Cupom de Desconto
          </h3>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Digite seu cupom..."
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && aplicarCupom()}
              className="flex-1 p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={aplicarCupom}
              className="px-6 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition"
            >
              Aplicar
            </button>
          </div>
          
          {mensagemCupom && (
            <p className={`text-sm font-semibold ${
              mensagemCupom.includes('✓') ? 'text-green-600' : 'text-red-600'
            }`}>
              {mensagemCupom}
            </p>
          )}
          
          {cupomAplicado && (
            <div className="bg-white p-3 rounded-lg border-2 border-green-400 mt-3 flex justify-between items-center">
              <p className="font-bold text-green-600">Cupom aplicado: {cupomAplicado.codigo}</p>
              <button
                onClick={removerCupom}
                className="text-red-600 hover:text-red-700 font-bold"
              >
                Remover
              </button>
            </div>
          )}
        </div>

        {/* Informações do Cliente */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-gray-300">
          <h3 className="text-xl font-bold text-gray-700 mb-4">3. Suas Informações</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Seu nome *"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            
            <input
              type="tel"
              placeholder="Seu telefone com DDD *"
              value={telefoneCliente}
              onChange={(e) => setTelefoneCliente(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            
            <input
              type="text"
              placeholder="Endereço de entrega *"
              value={enderecoEntrega}
              onChange={(e) => setEnderecoEntrega(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            
            <input
              type="text"
              placeholder="Cidade *"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Resumo Final */}
        {pedidoItems.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border-3 border-green-400">
            <h3 className="text-xl font-bold text-green-700 mb-4">Resumo do Pedido</h3>
            
            {(() => {
              let subtotal = 0;
              pedidoItems.forEach(item => {
                const precoUnitario = obterPreco(item.sabor);
                const totalAdicionais = item.adicionais.length * 3;
                const precoComAdicionais = precoUnitario + totalAdicionais;
                subtotal += precoComAdicionais * item.quantidade;
              });
              
              const frete = calcularFrete();
              const desconto = calcularDesconto(subtotal);
              const totalComDesconto = subtotal - desconto;
              const total = totalComDesconto + frete;

              return (
                <div className="space-y-2 text-gray-800 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {cupomAplicado && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({cupomAplicado.codigo}):</span>
                      <span className="font-semibold">-R$ {desconto.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Frete ({cidade}):</span>
                    <span className="font-semibold">R$ {frete.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-green-300 pt-2 flex justify-between text-lg font-bold text-green-700">
                    <span>TOTAL:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Botão Enviar */}
        <button
          onClick={handleEnviarPedido}
          disabled={pedidoItems.length === 0}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition ${
            pedidoItems.length === 0
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#EF2B2D] to-[#FF6B35] hover:from-[#D41F1F] hover:to-[#E55A2B] text-white'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          Enviar Pedido via WhatsApp
        </button>
      </div>
    </div>
  );
}
