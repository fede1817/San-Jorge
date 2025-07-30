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

  const abrirModalProcedimiento = (p) => {
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

  const verTratamientos = (paciente) => {
    if (paciente.tratamientos && paciente.tratamientos.length > 0) {
      alert(
        `Tratamientos de ${paciente.nombre} ${paciente.apellido}:\n\n` +
          paciente.tratamientos
            .map(
              (t, i) =>
                `${i + 1}. ${t.fecha}: ${t.diagnostico} - ${t.procedimiento}`
            )
            .join("\n")
      );
    } else {
      alert("Este paciente aún no tiene tratamientos.");
    }
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
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Apellido</th>
                <th className="p-2 border">Teléfono</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.nombre}</td>
                  <td className="p-2 border">{p.apellido}</td>
                  <td className="p-2 border">{p.telefono}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => abrirModalProcedimiento(p)}
                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Agregar Tratamiento
                    </button>
                    <button
                      onClick={() => abrirModalEditar(p)}
                      className="text-sm bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarPaciente(p.id)}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => verTratamientos(p)}
                      className="text-sm bg-gray-700 text-white px-2 py-1 rounded"
                    >
                      Ver tratamientos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            fetchPacientes();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
