import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Trash2, Power, Eye, EyeOff, Edit2 } from 'lucide-react';

interface Cupom {
  codigo: string;
  desconto: number;
  tipo: 'percentual' | 'fixo';
  ativo: boolean;
}

interface MenuItem {
  sabor: string;
  preco: string;
}

interface AdminState {
  isLoggedIn: boolean;
  cupons: Cupom[];
  menuItems: MenuItem[];
}

export default function Admin() {
  // Carregar cupons e menu do localStorage
  const cuponsArmazenados = localStorage.getItem('cupons_hei_batataria');
  const cuponsIniciais = cuponsArmazenados ? JSON.parse(cuponsArmazenados) : [];
  
  const menuArmazenado = localStorage.getItem('menu_hei_batataria');
  const menuInicial = menuArmazenado ? JSON.parse(menuArmazenado) : [
    { sabor: 'BACON COM CHEDDAR', preco: 'R$ 24,90' },
    { sabor: 'BACON COM CATUPIRY', preco: 'R$ 24,90' },
    { sabor: 'CALABRESA COM CHEDDAR', preco: 'R$ 24,90' },
    { sabor: 'CALABRESA COM CATUPIRY', preco: 'R$ 24,90' },
    { sabor: 'CARNE COM CHEDDAR', preco: 'R$ 24,90' },
    { sabor: 'CARNE COM CATUPIRY', preco: 'R$ 24,90' },
    { sabor: 'PALMITO COM CHEDDAR', preco: 'R$ 24,90' },
    { sabor: 'PALMITO COM CATUPIRY', preco: 'R$ 24,90' },
    { sabor: 'PIZZA', preco: 'R$ 24,90' },
    { sabor: 'HOT DOG (NOVO!)', preco: 'R$ 24,90' },
    { sabor: 'STROGONOFF DE FRANGO (ESPECIAL!)', preco: 'R$ 29,90' },
    { sabor: 'COSTELA', preco: 'R$ 34,90' }
  ];

  const [adminState, setAdminState] = useState<AdminState>({
    isLoggedIn: false,
    cupons: cuponsIniciais,
    menuItems: menuInicial
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Novo cupom
  const [novoCupomCodigo, setNovoCupomCodigo] = useState('');
  const [novoCupomDesconto, setNovoCupomDesconto] = useState('');
  const [novoCupomTipo, setNovoCupomTipo] = useState<'percentual' | 'fixo'>('percentual');
  
  // Edicao de precos
  const [precoEditando, setPrecoEditando] = useState<string | null>(null);
  const [novoPreco, setNovoPreco] = useState('');

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
    window.location.href = '/';
  };

  const atualizarPreco = (sabor: string, novoValor: string) => {
    if (!novoValor) {
      alert('Por favor, digite um valor!');
      return;
    }
    const novosItems = adminState.menuItems.map(item =>
      item.sabor === sabor ? { ...item, preco: novoValor } : item
    );
    setAdminState({
      ...adminState,
      menuItems: novosItems
    });
    localStorage.setItem('menu_hei_batataria', JSON.stringify(novosItems));
    setPrecoEditando(null);
    setNovoPreco('');
    alert('Preco atualizado com sucesso!');
  };

  const cancelarEdicaoPreco = () => {
    setPrecoEditando(null);
    setNovoPreco('');
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

    const novosCupons = [...adminState.cupons, novoCupom];
    const novoState = {
      ...adminState,
      cupons: novosCupons
    };
    
    setAdminState(novoState);
    localStorage.setItem('cupons_hei_batataria', JSON.stringify(novosCupons));

    setNovoCupomCodigo('');
    setNovoCupomDesconto('');
    setNovoCupomTipo('percentual');
    alert('Cupom criado com sucesso!');
  };

  const removerCupom = (codigo: string) => {
    const novosCupons = adminState.cupons.filter(c => c.codigo !== codigo);
    setAdminState({
      ...adminState,
      cupons: novosCupons
    });
    localStorage.setItem('cupons_hei_batataria', JSON.stringify(novosCupons));
  };

  const toggleCupom = (codigo: string) => {
    const novosCupons = adminState.cupons.map(c =>
      c.codigo === codigo ? { ...c, ativo: !c.ativo } : c
    );
    setAdminState({
      ...adminState,
      cupons: novosCupons
    });
    localStorage.setItem('cupons_hei_batataria', JSON.stringify(novosCupons));
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
          <p className="text-center text-xs text-gray-500 mt-2">
            <a href="/" className="text-blue-600 hover:underline">Voltar para o cardápio</a>
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

        {/* Edicao de Precos */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Edit2 className="w-6 h-6" />
            Promocao Relampago - Editar Precos
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {adminState.menuItems.map((item) => (
              <div key={item.sabor} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{item.sabor}</p>
                    <p className="text-lg font-bold text-[#EF2B2D]">{item.preco}</p>
                  </div>
                </div>
                {precoEditando === item.sabor ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Ex: R$ 19,90"
                      value={novoPreco}
                      onChange={(e) => setNovoPreco(e.target.value)}
                      className="w-full p-2 border-2 border-blue-500 rounded-lg focus:outline-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => atualizarPreco(item.sabor, novoPreco)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelarEdicaoPreco}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setPrecoEditando(item.sabor);
                      setNovoPreco(item.preco);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar Preco
                  </button>
                )}
              </div>
            ))}
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
