import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Trash2, Power, Eye, EyeOff } from 'lucide-react';

interface Cupom {
  codigo: string;
  desconto: number;
  tipo: 'percentual' | 'fixo';
  ativo: boolean;
}

interface AdminState {
  isLoggedIn: boolean;
  cupons: Cupom[];
}

export default function Admin() {
  const [adminState, setAdminState] = useState<AdminState>({
    isLoggedIn: false,
    cupons: [
      { codigo: 'BEMVINDO10', desconto: 10, tipo: 'percentual', ativo: true },
      { codigo: 'PROMO20', desconto: 20, tipo: 'percentual', ativo: false },
    ]
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Novo cupom
  const [novoCupomCodigo, setNovoCupomCodigo] = useState('');
  const [novoCupomDesconto, setNovoCupomDesconto] = useState('');
  const [novoCupomTipo, setNovoCupomTipo] = useState<'percentual' | 'fixo'>('percentual');

  const handleLogin = () => {
    if (username === 'igorbiju' && password === 'Heloisa@2022') {
      setAdminState({ ...adminState, isLoggedIn: true });
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Usuário ou senha incorretos!');
    }
  };

  const handleLogout = () => {
    setAdminState({ ...adminState, isLoggedIn: false });
  };

  const adicionarCupom = () => {
    if (!novoCupomCodigo || !novoCupomDesconto) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const cupomJaExiste = adminState.cupons.some(c => c.codigo.toUpperCase() === novoCupomCodigo.toUpperCase());
    if (cupomJaExiste) {
      alert('Este cupom já existe!');
      return;
    }

    const novoCupom: Cupom = {
      codigo: novoCupomCodigo.toUpperCase(),
      desconto: parseFloat(novoCupomDesconto),
      tipo: novoCupomTipo,
      ativo: true
    };

    setAdminState({
      ...adminState,
      cupons: [...adminState.cupons, novoCupom]
    });

    setNovoCupomCodigo('');
    setNovoCupomDesconto('');
    setNovoCupomTipo('percentual');
  };

  const removerCupom = (codigo: string) => {
    setAdminState({
      ...adminState,
      cupons: adminState.cupons.filter(c => c.codigo !== codigo)
    });
  };

  const toggleCupom = (codigo: string) => {
    setAdminState({
      ...adminState,
      cupons: adminState.cupons.map(c =>
        c.codigo === codigo ? { ...c, ativo: !c.ativo } : c
      )
    });
  };

  if (!adminState.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EF2B2D] via-[#FF6B35] to-[#EF2B2D] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-[#EF2B2D] mb-2">HEI! BATATARIA</h1>
          <p className="text-center text-gray-600 mb-8">Painel Administrativo</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#EF2B2D]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#EF2B2D]"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#EF2B2D] to-[#FF6B35] hover:from-[#D41F1F] hover:to-[#E55A2B] text-white font-bold py-3 rounded-lg text-lg"
            >
              Entrar
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Painel restrito para administradores
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#EF2B2D] to-[#FF6B35] text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">HEI! BATATARIA</h1>
            <p className="text-sm opacity-90">Painel Administrativo - Gerenciamento de Cupons</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-white text-[#EF2B2D] hover:bg-gray-100 font-bold px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Adicionar Novo Cupom */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Criar Novo Cupom
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Código do Cupom</label>
                <input
                  type="text"
                  placeholder="Ex: PROMO15"
                  value={novoCupomCodigo}
                  onChange={(e) => setNovoCupomCodigo(e.target.value.toUpperCase())}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor do Desconto</label>
                <input
                  type="number"
                  placeholder="Ex: 15"
                  value={novoCupomDesconto}
                  onChange={(e) => setNovoCupomDesconto(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Desconto</label>
                <select
                  value={novoCupomTipo}
                  onChange={(e) => setNovoCupomTipo(e.target.value as 'percentual' | 'fixo')}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="percentual">Percentual (%)</option>
                  <option value="fixo">Valor Fixo (R$)</option>
                </select>
              </div>

              <Button
                onClick={adicionarCupom}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Cupom
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-300">
              <h3 className="text-lg font-bold text-green-600 mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total de Cupons:</span>
                  <span className="text-2xl font-bold text-green-600">{adminState.cupons.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cupons Ativos:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {adminState.cupons.filter(c => c.ativo).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cupons Inativos:</span>
                  <span className="text-2xl font-bold text-gray-600">
                    {adminState.cupons.filter(c => !c.ativo).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>💡 Dica:</strong> Ative apenas os cupons que deseja disponibilizar para os clientes. Os cupons inativos não aparecerão no formulário de pedidos.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Cupons */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cupons Cadastrados</h2>

          {adminState.cupons.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum cupom cadastrado. Crie um novo cupom acima!</p>
          ) : (
            <div className="space-y-3">
              {adminState.cupons.map((cupom) => (
                <div
                  key={cupom.codigo}
                  className={`p-4 rounded-lg border-2 flex justify-between items-center ${
                    cupom.ativo
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800">{cupom.codigo}</p>
                    <p className="text-sm text-gray-600">
                      {cupom.tipo === 'percentual'
                        ? `${cupom.desconto}% de desconto`
                        : `R$ ${cupom.desconto.toFixed(2)} de desconto`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCupom(cupom.codigo)}
                      className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                        cupom.ativo
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {cupom.ativo ? 'Ativo' : 'Inativo'}
                    </button>

                    <button
                      onClick={() => removerCupom(cupom.codigo)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
