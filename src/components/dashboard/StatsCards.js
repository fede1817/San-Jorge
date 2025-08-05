export default function StatsCards({ pacientes, citas }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">Total Pacientes</h3>
        <p className="text-2xl font-bold text-teal-600">{pacientes.length}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">Próximas Citas</h3>
        <p className="text-2xl font-bold text-blue-600">{citas.length}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">
          Tratamientos Activos
        </h3>
        <p className="text-2xl font-bold text-amber-600">-</p>
      </div>
    </div>
  );
}
