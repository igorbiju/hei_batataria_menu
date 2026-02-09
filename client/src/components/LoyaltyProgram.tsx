import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Zap, TrendingUp } from 'lucide-react';

interface ClientePontos {
  telefone: string;
  pontos: number;
  totalGasto: number;
  ultimaCompra: string;
}

interface ResgateOpcao {
  pontos: number;
  desconto: number;
  descricao: string;
}

const opcoesResgate: ResgateOpcao[] = [
  { pontos: 50, desconto: 5, descricao: 'R$ 5,00 de desconto' },
  { pontos: 100, desconto: 10, descricao: 'R$ 10,00 de desconto' },
  { pontos: 150, desconto: 15, descricao: 'R$ 15,00 de desconto' },
  { pontos: 200, desconto: 25, descricao: 'R$ 25,00 de desconto' },
  { pontos: 300, desconto: 50, descricao: 'R$ 50,00 de desconto' },
];

export default function LoyaltyProgram() {
  const [telefone, setTelefone] = useState('');
  const [clienteInfo, setClienteInfo] = useState<ClientePontos | null>(null);
  const [pontosResgate, setPontosResgate] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState('');

  const buscarCliente = () => {
    if (!telefone) {
      setMensagem('Por favor, digite seu telefone!');
      return;
    }

    // Carregar clientes do localStorage
    const clientesArmazenados = localStorage.getItem('clientes_fidelidade_hei_batataria');
    const clientes = clientesArmazenados ? JSON.parse(clientesArmazenados) : {};

    if (clientes[telefone]) {
      setClienteInfo(clientes[telefone]);
      setMensagem('');
      setPontosResgate(null);
    } else {
      setMensagem('Cliente não encontrado. Crie uma conta na próxima compra!');
      setClienteInfo(null);
    }
  };

  const resgatarPontos = (pontosNecessarios: number, desconto: number) => {
    if (!clienteInfo) return;

    if (clienteInfo.pontos < pontosNecessarios) {
      setMensagem('Você não tem pontos suficientes!');
      return;
    }

    // Atualizar pontos do cliente
    const clientesArmazenados = localStorage.getItem('clientes_fidelidade_hei_batataria');
    const clientes = clientesArmazenados ? JSON.parse(clientesArmazenados) : {};

    clientes[telefone] = {
      ...clienteInfo,
      pontos: clienteInfo.pontos - pontosNecessarios
    };

    localStorage.setItem('clientes_fidelidade_hei_batataria', JSON.stringify(clientes));

    // Criar cupom de resgate
    const codigoCupom = `FIEL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const cuponsArmazenados = localStorage.getItem('cupons_hei_batataria');
    const cupons = cuponsArmazenados ? JSON.parse(cuponsArmazenados) : [];

    const novoCupom = {
      codigo: codigoCupom,
      desconto: desconto,
      tipo: 'fixo',
      ativo: true
    };

    cupons.push(novoCupom);
    localStorage.setItem('cupons_hei_batataria', JSON.stringify(cupons));

    setClienteInfo({
      ...clienteInfo,
      pontos: clienteInfo.pontos - pontosNecessarios
    });

    setPontosResgate(desconto);
    setMensagem(`✓ Cupom criado: ${codigoCupom} - R$ ${desconto.toFixed(2)} de desconto!`);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-3 border-amber-300 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="w-8 h-8 text-amber-600" />
        <h2 className="text-3xl font-bold text-amber-900">Programa de Fidelidade</h2>
      </div>

      <p className="text-amber-800 mb-6">
        Acumule <strong>1 ponto a cada R$ 1,00</strong> gasto e resgate por descontos incríveis!
      </p>

      {!clienteInfo ? (
        <div className="bg-white rounded-lg p-6 border-2 border-amber-300 mb-6">
          <p className="text-gray-700 mb-4">Consulte seus pontos acumulados:</p>
          <div className="flex gap-2 mb-4">
            <input
              type="tel"
              placeholder="Digite seu telefone (com DDD)"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarCliente()}
              className="flex-1 p-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
            <Button
              onClick={buscarCliente}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 rounded-lg"
            >
              Consultar
            </Button>
          </div>
          {mensagem && (
            <p className={`text-sm font-semibold ${
              mensagem.includes('✓') ? 'text-green-600' : 'text-red-600'
            }`}>
              {mensagem}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Info do Cliente */}
          <div className="bg-white rounded-lg p-6 border-2 border-green-400">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Seus Pontos</p>
                <p className="text-3xl font-bold text-amber-600 flex items-center gap-2">
                  <Zap className="w-8 h-8" />
                  {clienteInfo.pontos}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Gasto</p>
                <p className="text-3xl font-bold text-green-600">
                  R$ {clienteInfo.totalGasto.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Compra</p>
                <p className="text-lg font-bold text-gray-800">
                  {clienteInfo.ultimaCompra || 'Sem compras'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setClienteInfo(null);
                setTelefone('');
                setMensagem('');
                setPontosResgate(null);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Consultar outro cliente
            </button>
          </div>

          {/* Opções de Resgate */}
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Resgate seus Pontos
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {opcoesResgate.map((opcao) => (
                <button
                  key={opcao.pontos}
                  onClick={() => resgatarPontos(opcao.pontos, opcao.desconto)}
                  disabled={clienteInfo.pontos < opcao.pontos}
                  className={`p-4 rounded-lg border-2 font-bold transition ${
                    clienteInfo.pontos >= opcao.pontos
                      ? 'bg-white border-amber-400 text-amber-900 hover:bg-amber-50 cursor-pointer'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <p className="text-lg">{opcao.pontos} pontos</p>
                  <p className="text-sm text-green-600 font-bold">{opcao.descricao}</p>
                </button>
              ))}
            </div>
          </div>

          {pontosResgate !== null && (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
              <p className="text-green-700 font-bold text-center">
                ✓ {mensagem}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info sobre o programa */}
      <div className="mt-8 bg-amber-100 rounded-lg p-4 border-2 border-amber-300">
        <p className="text-sm text-amber-900">
          <strong>💡 Como funciona:</strong> A cada compra realizada, você acumula pontos automaticamente. 
          Resgate seus pontos aqui para ganhar cupons de desconto exclusivos!
        </p>
      </div>
    </div>
  );
}
