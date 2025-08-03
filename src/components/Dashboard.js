import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PacienteModal from "./PacienteModal";
import VerTratamientosModal from "./VerTratamientosModal";
import CitaModal from "./CitaModal";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiMenu,
  FiLogOut,
  FiHome,
  FiClock,
  FiPhone,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";

function Dashboard() {
  // Estados principales
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState({ pacientes: true, citas: true });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paciente, setPaciente] = useState({});
  const [verModalOpen, setVerModalOpen] = useState(false);
  const [pacienteParaVer, setPacienteParaVer] = useState(null);
  const [modalCitaOpen, setModalCitaOpen] = useState(false);
  const [showCitas, setShowCitas] = useState(false);

  const abrirModalAgregar = () => {
    setPaciente({});
    setModalAbierto(true);
  };
  // Obtener pacientes
  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar pacientes");
      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, pacientes: false }));
    }
  };

  // Obtener citas programadas
  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes/proximas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar citas");
      const data = await res.json();
      setCitas(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, citas: false }));
    }
  };

  // Cancelar cita
  const cancelarCita = async (id) => {
    if (!window.confirm("¿Está seguro de cancelar esta cita?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/pacientes/${id}/cancelar`, // Ajustado a tu endpoint
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: "cancelado" }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al cancelar cita");
      }

      toast.success("Cita cancelada correctamente");
      fetchCitas(); // Actualizar lista de citas
    } catch (error) {
      toast.error(error.message);
      console.error("Error al cancelar cita:", error);
    }
  };

  const guardarCita = async (citaData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/pacientes/${citaData.paciente_id}/tratamiento`, // Ajustado a tu endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fecha: citaData.fecha,
            hora: citaData.hora,
            procedimiento: citaData.procedimiento,
            odontologo_id: citaData.odontologo_id,
            estado: "programado",
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar cita");
      }

      const data = await res.json();
      toast.success("Cita programada correctamente");
      fetchCitas();
    } catch (error) {
      toast.error(error.message);
      console.error("Error al guardar cita:", error);
    }
  };
  // Guardar paciente
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paciente),
      });

      if (!res.ok)
        throw new Error(paciente.id ? "Error al actualizar" : "Error al crear");

      toast.success(paciente.id ? "Paciente actualizado" : "Paciente creado");
      setModalAbierto(false);
      fetchPacientes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Eliminar paciente
  const eliminarPaciente = async (id) => {
    if (!window.confirm("¿Eliminar este paciente y todos sus registros?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/pacientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar paciente");
      toast.success("Paciente eliminado");
      fetchPacientes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Sesión cerrada");
    navigate("/");
  };

  // Efectos iniciales
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/login");
      return;
    }

    setUserData(user);
    fetchPacientes();
    fetchCitas();
  }, [navigate]);

  // Formateadores
  const formatFecha = (fechaString) => {
    if (!fechaString) return "No registrada";
    return new Date(fechaString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatHora = (horaString) => {
    if (!horaString) return "";
    return horaString.substring(0, 5); // HH:MM
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-teal-800 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-teal-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">San Jorge</h1>
          ) : (
            <div className="w-8 h-8 bg-teal-700 rounded-full"></div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-teal-700"
          >
            <FiMenu size={24} />
          </button>
        </div>

        <div className="p-4 flex items-center gap-3 border-b border-teal-700">
          <div className="bg-teal-600 rounded-full p-2">
            <FiUser size={20} />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-medium">{userData?.nombre}</p>
              <p className="text-xs text-teal-200">{userData?.especialidad}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2">
          <button
            onClick={() => setShowCitas(false)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 ${
              !showCitas ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <FiHome size={20} />
            {sidebarOpen && <span>Pacientes</span>}
          </button>
          <button
            onClick={() => {
              setShowCitas(true);
              fetchCitas();
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 ${
              showCitas ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            <FiClock size={20} />
            {sidebarOpen && <span>Citas</span>}
          </button>
          <button
            onClick={abrirModalAgregar}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-700 mb-2"
          >
            <FiPlus size={20} />
            {sidebarOpen && <span>Nuevo Paciente</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-teal-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-teal-200 hover:text-white"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
          {showCitas ? (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Próximas Citas
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCitas(false)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FiArrowLeft /> Pacientes
                  </button>
                  <button
                    onClick={() => setModalCitaOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FiPlus /> Nueva Cita
                  </button>
                </div>
              </div>

              {loading.citas ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : citas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <FiCalendar className="mx-auto text-4xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No hay citas programadas
                  </h3>
                  <button
                    onClick={() => setModalCitaOpen(true)}
                    className="text-teal-600 hover:text-teal-800 font-medium"
                  >
                    Programar primera cita
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Procedimiento
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {citas
                        .filter((cita) => cita.estado !== "cancelado")
                        .map((cita) => (
                          <tr key={cita.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                  <FiUser />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {cita.paciente_nombre}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Tel: {cita.telefono || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatFecha(cita.fecha)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatHora(cita.hora)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {cita.procedimiento || "Consulta"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => cancelarCita(cita.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Cancelar cita"
                              >
                                <FiX size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Panel de Pacientes
                </h1>
                <p className="text-gray-600">
                  {pacientes.length}{" "}
                  {pacientes.length === 1
                    ? "paciente registrado"
                    : "pacientes registrados"}
                </p>
              </div>

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
                  <p className="text-2xl font-bold text-blue-600">
                    {citas.length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Tratamientos Activos
                  </h3>
                  <p className="text-2xl font-bold text-amber-600">-</p>
                </div>
              </div>

              {loading.pacientes ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : pacientes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <FiUser className="mx-auto text-4xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No hay pacientes registrados
                  </h3>
                  <button
                    onClick={() => setModalAbierto(true)}
                    className="text-teal-600 hover:text-teal-800 font-medium"
                  >
                    Agregar primer paciente
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tratamientos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Última Visita
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {p.telefono && (
                                <FiPhone className="text-gray-400" />
                              )}
                              <span>
                                {p.telefono?.replace(/-/g, "") ||
                                  "Sin teléfono"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {p.email
                                ? p.email.substring(0, 15) +
                                  (p.email.length > 15 ? "..." : "")
                                : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {p.tratamientos?.length || 0}{" "}
                              {p.tratamientos?.length === 1
                                ? "tratamiento"
                                : "tratamientos"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {p.tratamientos?.length > 0
                                ? formatFecha(
                                    p.tratamientos.reduce((a, b) =>
                                      new Date(a.fecha) > new Date(b.fecha)
                                        ? a
                                        : b
                                    ).fecha
                                  )
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setPacienteParaVer(p);
                                  setVerModalOpen(true);
                                }}
                                className="text-gray-600 hover:text-gray-800 p-1"
                                title="Ver tratamientos"
                              >
                                <FiCalendar />
                              </button>
                              <button
                                onClick={() => {
                                  setPaciente(p);
                                  setModalAbierto(true);
                                }}
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
          )}
        </div>
      </div>

      {/* Modales */}
      <PacienteModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={() => {
          guardarPaciente();
          fetchPacientes();
        }}
        paciente={paciente}
        setPaciente={setPaciente}
      />

      {pacienteParaVer && (
        <VerTratamientosModal
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
          paciente={pacienteParaVer}
          onCitaAdded={() => {
            fetchCitas();
            fetchPacientes();
          }}
        />
      )}

      <CitaModal
        isOpen={modalCitaOpen}
        onClose={() => setModalCitaOpen(false)}
        onSave={(nuevaCita) => {
          // Esta función maneja el guardado real
          guardarCita(nuevaCita);
        }}
        pacientes={pacientes}
        odontologoId={userData?.id}
      />
    </div>
  );
}

export default Dashboard;
