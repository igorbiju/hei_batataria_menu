import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface MenuItem {
  sabor: string;
  descricao: string;
  preco: string;
}

interface OrderFormProps {
  menuItems: MenuItem[];
}

interface PedidoItem {
  sabor: string;
  quantidade: number;
}

export default function OrderForm({ menuItems }: OrderFormProps) {
  const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
  const [selectedSabor, setSelectedSabor] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [cidade, setCidade] = useState('');

  const adicionarSabor = () => {
    if (!selectedSabor) {
      alert('Por favor, selecione um sabor!');
      return;
    }

    const itemExistente = pedidoItems.find(item => item.sabor === selectedSabor);
    
    if (itemExistente) {
      // Se o sabor já existe, aumenta a quantidade
      setPedidoItems(pedidoItems.map(item =>
        item.sabor === selectedSabor
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      ));
    } else {
      // Adiciona novo sabor
      setPedidoItems([...pedidoItems, { sabor: selectedSabor, quantidade }]);
    }

    // Reset dos campos
    setSelectedSabor('');
    setQuantidade(1);
  };

  const removerSabor = (sabor: string) => {
    setPedidoItems(pedidoItems.filter(item => item.sabor !== sabor));
  };

  const calcularFrete = () => {
    if (!cidade) return 0;

    const cidadeNormalizada = cidade.toLowerCase().trim();
    const totalBatatas = pedidoItems.reduce((sum, item) => sum + item.quantidade, 0);
    
    // Verifica se é Ivaiporã (com várias variações de digitação)
    if (cidadeNormalizada === 'ivaipora' || cidadeNormalizada === 'ivaiporã' || cidadeNormalizada === 'ivaiporá') {
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

    pedidoItems.forEach(item => {
      const sabor = menuItems.find(m => m.sabor === item.sabor);
      if (sabor) {
        const preco = parseFloat(sabor.preco.replace('R$', '').replace(',', '.'));
        const itemTotal = preco * item.quantidade;
        subtotal += itemTotal;
        detalhePedido += `${item.quantidade}x ${sabor.sabor}\n${sabor.descricao}\n*Subtotal:* R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
      }
    });

    const frete = calcularFrete();
    const total = (subtotal + frete).toFixed(2).replace('.', ',');

    // Montar mensagem para WhatsApp
    const mensagem = `Olá! Gostaria de fazer um pedido na HEI! BATATARIA

*Cliente:* ${nomeCliente}
*Telefone:* ${telefoneCliente}
*Cidade:* ${cidade}
*Endereço:* ${enderecoEntrega}

*Pedido:*
${detalhePedido}
*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}
*Frete:* R$ ${frete.toFixed(2).replace('.', ',')}
*TOTAL:* R$ ${total}`;

    // Número do WhatsApp (sem formatação)
    const numeroWhatsApp = '5543988697421';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
  };

  // Calcular subtotal e total
  let subtotal = 0;
  let totalBatatas = 0;

  pedidoItems.forEach(item => {
    const sabor = menuItems.find(m => m.sabor === item.sabor);
    if (sabor) {
      const preco = parseFloat(sabor.preco.replace('R$', '').replace(',', '.'));
      subtotal += preco * item.quantidade;
      totalBatatas += item.quantidade;
    }
  });

  const frete = calcularFrete();
  const total = subtotal + frete;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-red-500">
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">Faça seu Pedido</h2>

      <div className="space-y-4">
        {/* Nome do Cliente */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seu Nome *
          </label>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Telefone do Cliente */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seu Telefone/WhatsApp *
          </label>
          <input
            type="tel"
            value={telefoneCliente}
            onChange={(e) => setTelefoneCliente(e.target.value)}
            placeholder="(43) 9-9999-9999"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Cidade de Entrega */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sua Cidade *
          </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: Ivaiporã, Apucarana, etc..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ivaiporã: R$ 10 | Outras cidades: R$ 30 (R$ 20 com 4+ batatas)
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Digite "Ivaiporã" ou "Ivaipora")
          </p>
        </div>

        {/* Endereço de Entrega */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Endereço de Entrega *
          </label>
          <input
            type="text"
            value={enderecoEntrega}
            onChange={(e) => setEnderecoEntrega(e.target.value)}
            placeholder="Rua, número, complemento..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Seção de Adição de Sabores */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Adicionar Sabores</h3>

          {/* Seleção de Sabor */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Escolha o Sabor *
            </label>
            <select
              value={selectedSabor}
              onChange={(e) => setSelectedSabor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Selecione um sabor...</option>
              {menuItems.map((item) => (
                <option key={item.sabor} value={item.sabor}>
                  {item.sabor} - {item.preco}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição do Sabor Selecionado */}
          {selectedSabor && (
            <div className="bg-white p-3 rounded-lg border-l-4 border-orange-500 mb-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Ingredientes: </span>
                {menuItems.find(item => item.sabor === selectedSabor)?.descricao}
              </p>
            </div>
          )}

          {/* Quantidade */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantidade
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                −
              </button>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-20 px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Botão Adicionar */}
          <Button
            onClick={adicionarSabor}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            + Adicionar Sabor ao Pedido
          </Button>
        </div>

        {/* Lista de Sabores Adicionados */}
        {pedidoItems.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sabores no Pedido</h3>
            <div className="space-y-2">
              {pedidoItems.map((item) => {
                const sabor = menuItems.find(m => m.sabor === item.sabor);
                const preco = sabor ? parseFloat(sabor.preco.replace('R$', '').replace(',', '.')) : 0;
                const itemTotal = preco * item.quantidade;

                return (
                  <div key={item.sabor} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.quantidade}x {item.sabor}</p>
                      <p className="text-sm text-gray-600">R$ {itemTotal.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button
                      onClick={() => removerSabor(item.sabor)}
                      className="ml-2 text-red-500 hover:text-red-700 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resumo do Pedido com Frete */}
        {pedidoItems.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-700 font-semibold">Resumo do Pedido:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Total de batatas</span>
                <span>{totalBatatas}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Frete ({cidade || 'cidade não informada'})</span>
                <span className="font-semibold">R$ {frete.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-red-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botão Enviar via WhatsApp */}
        <Button
          onClick={handleEnviarPedido}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition text-lg"
          disabled={pedidoItems.length === 0}
        >
          <MessageCircle size={20} />
          Enviar Pedido via WhatsApp
        </Button>
      </div>
    </div>
  );
}
