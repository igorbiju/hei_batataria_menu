import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface MenuItem {
  sabor: string;
  descricao: string;
  preco: string;
}

interface OrderFormProps {
  menuItems: MenuItem[];
}

export default function OrderForm({ menuItems }: OrderFormProps) {
  const [selectedSabor, setSelectedSabor] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');

  const handleEnviarPedido = () => {
    if (!selectedSabor || !nomeCliente || !telefoneCliente) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const sabor = menuItems.find(item => item.sabor === selectedSabor);
    if (!sabor) return;

    // Extrair preço numérico
    const preco = parseFloat(sabor.preco.replace('R$', '').replace(',', '.'));
    const total = (preco * quantidade).toFixed(2).replace('.', ',');

    // Montar mensagem para WhatsApp
    const mensagem = `Olá! Gostaria de fazer um pedido na HEI! BATATARIA

*Cliente:* ${nomeCliente}
*Telefone:* ${telefoneCliente}
${enderecoEntrega ? `*Endereço:* ${enderecoEntrega}` : ''}

*Pedido:*
${quantidade}x ${sabor.sabor}
${sabor.descricao}

*Valor unitário:* ${sabor.preco}
*Total:* R$ ${total}`;

    // Número do WhatsApp (sem formatação)
    const numeroWhatsApp = '5543988697421';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
  };

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

        {/* Endereço de Entrega */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Endereço de Entrega (opcional)
          </label>
          <input
            type="text"
            value={enderecoEntrega}
            onChange={(e) => setEnderecoEntrega(e.target.value)}
            placeholder="Rua, número, complemento..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Seleção de Sabor */}
        <div>
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
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Ingredientes: </span>
              {menuItems.find(item => item.sabor === selectedSabor)?.descricao}
            </p>
          </div>
        )}

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantidade *
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

        {/* Resumo do Pedido */}
        {selectedSabor && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Resumo:</span>
            </p>
            <p className="text-sm text-gray-700">
              {quantidade}x {selectedSabor}
            </p>
            <p className="text-lg font-bold text-red-600 mt-2">
              Total: R$ {(parseFloat((menuItems.find(item => item.sabor === selectedSabor)?.preco || 'R$ 0').replace('R$', '').replace(',', '.')) * quantidade).toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        {/* Botão Enviar via WhatsApp */}
        <Button
          onClick={handleEnviarPedido}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition text-lg"
        >
          <MessageCircle size={20} />
          Enviar Pedido via WhatsApp
        </Button>
      </div>
    </div>
  );
}
