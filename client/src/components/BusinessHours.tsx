import { Clock } from 'lucide-react';

export default function BusinessHours() {
  const hours = [
    { day: 'Segunda-feira', hours: '18:00 - 23:00' },
    { day: 'Terça-feira', hours: '18:00 - 23:00' },
    { day: 'Quarta-feira', hours: '18:00 - 23:00' },
    { day: 'Quinta-feira', hours: '18:00 - 23:00' },
    { day: 'Sexta-feira', hours: '18:00 - 23:00' },
    { day: 'Sábado', hours: '11:00 - 23:00', highlight: true },
    { day: 'Domingo', hours: '11:00 - 23:00', highlight: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-orange-500">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-orange-500" size={28} />
        <h2 className="text-2xl md:text-3xl font-bold text-red-600">Horário de Funcionamento</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hours.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 transition ${
              item.highlight
                ? 'bg-yellow-50 border-l-yellow-500'
                : 'bg-gray-50 border-l-gray-300'
            }`}
          >
            <p className="font-semibold text-gray-800">{item.day}</p>
            <p className={`text-lg font-bold ${item.highlight ? 'text-yellow-600' : 'text-orange-600'}`}>
              {item.hours}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 border-l-4 border-l-green-500 rounded-lg">
        <p className="text-sm text-green-800">
          <span className="font-semibold">✓ Estamos abertos agora?</span> Verifique os horários acima e faça seu pedido!
        </p>
      </div>
    </div>
  );
}
