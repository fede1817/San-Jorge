import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PacienteModal from "./PacienteModal";
import TratamientoModal from "./TratamientoModal";

function Dashboard() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paciente, setPaciente] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const abrirModal = (p) => {
    setPacienteSeleccionado(p);
    setModalOpen(true);
  };

  const fetchPacientes = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/pacientes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    setPacientes(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchPacientes();
  }, [navigate]);

  const eliminarPaciente = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3001/api/pacientes/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    fetchPacientes();
  };

  const abrirModalAgregar = () => {
    setPaciente({});
    setModalAbierto(true);
  };

  const abrirModalEditar = (p) => {
    setPaciente(p);
    setModalAbierto(true);
  };

  const guardarPaciente = async () => {
    const token = localStorage.getItem("token");
    const metodo = paciente.id ? "PUT" : "POST";
    const url = paciente.id
      ? `http://localhost:3001/api/pacientes/${paciente.id}`
      : "http://localhost:3001/api/pacientes";

    await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(paciente),
    });

    setModalAbierto(false);
    setPaciente({});
    fetchPacientes();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Mis Pacientes</h2>

        <button
          onClick={abrirModalAgregar}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Agregar paciente
        </button>

        <div className="space-y-4">
          {pacientes.map((p) => (
            <div
              key={p.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
            >
              <h4 className="text-lg font-semibold text-gray-800">
                {p.nombre} {p.apellido}
              </h4>
              <p className="text-gray-600">📞 Teléfono: {p.telefono}</p>
              <p className="text-gray-600">🦷 Tratamiento: {p.procedimiento}</p>
              <p className="text-gray-600">
                📅 Próxima consulta: {p.proxima_consulta}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => abrirModal(p)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Agregar Tratamiento
                </button>
                <button
                  onClick={() => abrirModalEditar(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarPaciente(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modales */}
      <PacienteModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarPaciente}
        paciente={paciente}
        setPaciente={setPaciente}
      />

      {pacienteSeleccionado && (
        <TratamientoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          paciente={pacienteSeleccionado}
          onGuardar={() => {
            console.log("Tratamiento guardado");
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
