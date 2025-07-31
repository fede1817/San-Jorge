import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PacienteModal from "./PacienteModal";
import TratamientoModal from "./TratamientoModal";
import VerTratamientosModal from "./VerTratamientosModal";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

function Dashboard() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paciente, setPaciente] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [verModalOpen, setVerModalOpen] = useState(false);
  const [pacienteParaVer, setPacienteParaVer] = useState(null);

  const verTratamientos = (p) => {
    setPacienteParaVer(p);
    setVerModalOpen(true);
  };

  const abrirModalProcedimiento = (p) => {
    setPacienteSeleccionado(p);
    setModalOpen(true);
  };

  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Error al cargar pacientes");

      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
    if (
      !window.confirm(
        "¿Está seguro de eliminar este paciente y todos sus tratamientos?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/pacientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error("Error al eliminar paciente");

      toast.success("Paciente eliminado correctamente");
      fetchPacientes();
    } catch (error) {
      toast.error(error.message);
    }
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
    try {
      const token = localStorage.getItem("token");
      const metodo = paciente.id ? "PUT" : "POST";
      const url = paciente.id
        ? `http://localhost:3001/api/pacientes/${paciente.id}`
        : "http://localhost:3001/api/pacientes";

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(paciente),
      });

      if (!res.ok)
        throw new Error(paciente.id ? "Error al actualizar" : "Error al crear");

      toast.success(paciente.id ? "Paciente actualizado" : "Paciente creado");
      setModalAbierto(false);
      setPaciente({});
      fetchPacientes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiUser className="text-teal-600" /> Panel de Pacientes
            </h1>
            <p className="text-gray-600">
              Gestión integral de pacientes odontológicos
            </p>
          </div>

          <button
            onClick={abrirModalAgregar}
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
          >
            <FiPlus /> Nuevo Paciente
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Pacientes
            </h3>
            <p className="text-2xl font-bold text-teal-600">
              {pacientes.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">
              Próximas Citas
            </h3>
            <p className="text-2xl font-bold text-blue-600">-</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">
              Tratamientos Activos
            </h3>
            <p className="text-2xl font-bold text-amber-600">-</p>
          </div>
        </div>

        {/* Tabla de pacientes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : pacientes.length === 0 ? (
            <div className="text-center p-8">
              <FiUser className="mx-auto text-4xl text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-500">
                No hay pacientes registrados
              </h3>
              <button
                onClick={abrirModalAgregar}
                className="mt-4 text-teal-600 hover:text-teal-800 font-medium"
              >
                Agregar primer paciente
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Paciente
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contacto
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Última Visita
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pacientes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                            <FiUser />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {p.nombre} {p.apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {p.tratamientos?.length || 0} tratamientos
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {p.telefono}
                        </div>
                        <div className="text-sm text-gray-500">-</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">-</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => abrirModalProcedimiento(p)}
                            className="flex items-center text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                            title="Agregar tratamiento"
                          >
                            <FiFileText className="mr-1" /> Tratamiento
                          </button>
                          <button
                            onClick={() => verTratamientos(p)}
                            className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                            title="Ver historial"
                          >
                            <FiCalendar className="mr-1" /> Historial
                          </button>
                          <button
                            onClick={() => abrirModalEditar(p)}
                            className="text-amber-600 hover:text-amber-800 p-1"
                            title="Editar"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => eliminarPaciente(p.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Eliminar"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
            fetchPacientes();
            toast.success("Tratamiento registrado");
          }}
        />
      )}

      {pacienteParaVer && (
        <VerTratamientosModal
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
          paciente={pacienteParaVer}
        />
      )}
    </div>
  );
}

export default Dashboard;
