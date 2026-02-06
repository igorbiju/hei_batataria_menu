import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Plus, Minus, Gift, Check } from 'lucide-react';

interface MenuItem {
  sabor: string;
  descricao: string;
  preco: string;
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
  'COSTELA': ['bacon', 'calabresa', 'cheddar', 'catupiry', 'muçarela'],
};

export default function OrderForm({ menuItems, cuponsDisponiveis = [] }: OrderFormProps) {
  const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
  const [selectedSabor, setSelectedSabor] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [cidade, setCidade] = useState('');
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<{ codigo: string; desconto: number; tipo: 'percentual' | 'fixo' } | null>(null);
  const [mensagemCupom, setMensagemCupom] = useState('');

  const adicionarSabor = () => {
    if (!selectedSabor) {
      alert('Por favor, selecione um sabor!');
      return;
    }

    const novoItem: PedidoItem = {
      sabor: selectedSabor,
      quantidade,
      adicionais: adicionaisSelecionados,
    };

    setPedidoItems([...pedidoItems, novoItem]);

    // Reset dos campos
    setSelectedSabor('');
    setQuantidade(1);
    setAdicionaisSelecionados([]);
  };

  const removerSabor = (index: number) => {
    setPedidoItems(pedidoItems.filter((_, i) => i !== index));
  };

  const toggleAdicional = (adicional: string) => {
    setAdicionaisSelecionados(prev =>
      prev.includes(adicional)
        ? prev.filter(a => a !== adicional)
        : [...prev, adicional]
    );
  };

  const calcularFrete = () => {
    if (!cidade) return 0;

    const cidadeNormalizada = cidade.toLowerCase().trim();
    const totalBatatas = pedidoItems.reduce((sum, item) => sum + item.quantidade, 0);
    
    // Remove acentos para comparação mais robusta
    const cidadeSemAcento = cidadeNormalizada
      .replace(/ã/g, 'a')
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
      .replace(/\s+/g, '');
    
    if (cidadeSemAcento === 'ivaipora') {
      return 10;
    } else {
      // Cidades próximas
      if (totalBatatas >= 4) {
        return 20;
      } else {
        return 30;
      }
    }
  };

  const obterPreco = (sabor: string): number => {
    const item = menuItems.find(m => m.sabor === sabor);
    if (!item) return 0;
    const preco = item.preco.replace('R$', '').replace(',', '.').trim();
    return parseFloat(preco);
  };

  const aplicarCupom = () => {
    const cupomUpper = cupom.toUpperCase().trim();
    
    if (!cupomUpper) {
      setMensagemCupom('Por favor, digite um cupom!');
      return;
    }

    const cupomEncontrado = cuponsDisponiveis.find(c => c.codigo === cupomUpper);
    
    if (cupomEncontrado) {
      setCupomAplicado({
        codigo: cupomUpper,
        desconto: cupomEncontrado.desconto,
        tipo: cupomEncontrado.tipo
      });
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

    const numeroWhatsApp = '5543988697421';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const adicionaisDisponivelParaSabor = selectedSabor ? (adicionaisDisponiveis[selectedSabor] || []) : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-500">
        <h2 className="text-4xl font-bold text-red-600 mb-2 flex items-center gap-3">
          <MessageCircle className="w-8 h-8" />
          Faça Seu Pedido
        </h2>
        <p className="text-gray-600 mb-8">Selecione seus sabores, adicione adicionais e envie via WhatsApp!</p>

        {/* Seção de Seleção de Sabor */}
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-6 mb-8 border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4">1. Escolha um Sabor</h3>
          
          <select
            value={selectedSabor}
            onChange={(e) => {
              setSelectedSabor(e.target.value);
              setAdicionaisSelecionados([]);
            }}
            className="w-full p-3 border-2 border-red-300 rounded-lg mb-4 focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="">Selecione um sabor...</option>
            {menuItems.map((item) => (
              <option key={item.sabor} value={item.sabor}>
                {item.sabor} - {item.preco}
              </option>
            ))}
          </select>

          {selectedSabor && (
            <div className="bg-white p-4 rounded-lg border-2 border-yellow-300 mb-4">
              <p className="text-gray-700 font-semibold mb-2">Descrição:</p>
              <p className="text-gray-600">{menuItems.find(m => m.sabor === selectedSabor)?.descricao}</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
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
                      : 'bg-white border-yellow-300 text-gray-700 hover:bg-yellow-100'
                  }`}
                >
                  {adicional === 'muçarela' ? '🧀 Muçarela' : 
                   adicional === 'cheddar' ? '🧀 Cheddar' :
                   adicional === 'catupiry' ? '🧀 Catupiry' :
                   adicional === 'bacon' ? '🥓 Bacon' :
                   adicional === 'calabresa' ? '🌶️ Calabresa' : adicional}
                </button>
              ))}
            </div>

            {adicionaisSelecionados.length > 0 && (
              <div className="mt-4 p-3 bg-white rounded-lg border-2 border-yellow-300">
                <p className="text-sm font-semibold text-gray-700">
                  Adicionais selecionados: {adicionaisSelecionados.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
                </p>
                <p className="text-sm text-yellow-700 font-bold">
                  +R$ {(adicionaisSelecionados.length * 3).toFixed(2)} por unidade
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão Adicionar */}
        <Button
          onClick={adicionarSabor}
          disabled={!selectedSabor}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-lg text-lg mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Adicionar ao Pedido
        </Button>

        {/* Resumo do Pedido */}
        {pedidoItems.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border-2 border-blue-300">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Seu Pedido ({pedidoItems.length} item{pedidoItems.length !== 1 ? 's' : ''})</h3>
            
            <div className="space-y-3 mb-4">
              {pedidoItems.map((item, index) => {
                const precoUnitario = obterPreco(item.sabor);
                const totalAdicionais = item.adicionais.length * 3;
                const precoComAdicionais = precoUnitario + totalAdicionais;
                const totalItem = precoComAdicionais * item.quantidade;

                return (
                  <div key={index} className="bg-white p-3 rounded-lg border-2 border-blue-200 flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.sabor}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantidade}x</p>
                      {item.adicionais.length > 0 && (
                        <p className="text-sm text-yellow-700 font-semibold">
                          Adicionais: {item.adicionais.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        R$ {precoUnitario.toFixed(2)} {item.adicionais.length > 0 && `+ R$ ${totalAdicionais.toFixed(2)} adicionais`} = R$ {totalItem.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removerSabor(index)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Informações do Cliente */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-gray-300">
          <h3 className="text-xl font-bold text-gray-700 mb-4">3. Suas Informações</h3>
          
          <input
            type="text"
            placeholder="Nome completo *"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-red-500"
          />
          
          <input
            type="tel"
            placeholder="Telefone (com DDD) *"
            value={telefoneCliente}
            onChange={(e) => setTelefoneCliente(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-red-500"
          />
          
          <input
            type="text"
            placeholder="Endereço de entrega (Rua, número, complemento) *"
            value={enderecoEntrega}
            onChange={(e) => setEnderecoEntrega(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-red-500"
          />
          
          <input
            type="text"
            placeholder="Cidade (ex: Ivaiporã) *"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Seção de Cupom de Desconto */}
        {pedidoItems.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border-2 border-purple-300">
            <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Cupom de Desconto
            </h3>
            
            {!cupomAplicado ? (
              <div className="space-y-3">
                {cuponsDisponiveis.length > 0 && (
                  <p className="text-sm text-gray-600 mb-3">Cupons disponíveis: {cuponsDisponiveis.map(c => c.codigo).join(', ')}</p>
                )}
                {cuponsDisponiveis.length === 0 && (
                  <p className="text-sm text-red-600 mb-3">Nenhum cupom disponível no momento</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom aqui..."
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && aplicarCupom()}
                    className="flex-1 p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 uppercase"
                  />
                  <Button
                    onClick={aplicarCupom}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 rounded-lg"
                  >
                    Aplicar
                  </Button>
                </div>
                {mensagemCupom && (
                  <p className={`text-sm font-semibold ${
                    mensagemCupom.includes('✓') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mensagemCupom}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border-2 border-green-400 flex justify-between items-center">
                <div>
                  <p className="font-bold text-green-600 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Cupom aplicado: {cupomAplicado.codigo}
                  </p>
                  <p className="text-sm text-gray-600">
                    {cupomAplicado.tipo === 'percentual' 
                      ? `${cupomAplicado.desconto}% de desconto`
                      : `R$ ${cupomAplicado.desconto.toFixed(2)} de desconto`
                    }
                  </p>
                </div>
                <Button
                  onClick={removerCupom}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 rounded-lg"
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Resumo Final */}
        {pedidoItems.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border-3 border-green-400">
            <h3 className="text-xl font-bold text-green-700 mb-4">Resumo do Pedido</h3>
            
            <div className="space-y-2 text-gray-700">
              {(() => {
                const subtotal = pedidoItems.reduce((sum, item) => {
                  const precoUnitario = obterPreco(item.sabor);
                  const totalAdicionais = item.adicionais.length * 3;
                  return sum + ((precoUnitario + totalAdicionais) * item.quantidade);
                }, 0);
                const desconto = calcularDesconto(subtotal);
                const frete = calcularFrete();
                const total = subtotal - desconto + frete;

                return (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    
                    {cupomAplicado && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({cupomAplicado.codigo}):</span>
                        <span className="font-bold">-R$ {desconto.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Frete ({cidade || 'selecione cidade'}):</span>
                      <span className="font-bold">R$ {frete.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t-2 border-green-300 pt-2 flex justify-between text-lg">
                      <span className="font-bold">TOTAL:</span>
                      <span className="font-bold text-green-700">R$ {total.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Botão Enviar */}
        <Button
          onClick={handleEnviarPedido}
          disabled={pedidoItems.length === 0 || !nomeCliente || !telefoneCliente || !enderecoEntrega || !cidade}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          Enviar Pedido via WhatsApp
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          * Campos obrigatórios
        </p>
      </div>
    </div>
  );
}
