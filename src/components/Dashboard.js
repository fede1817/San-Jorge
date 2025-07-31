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
  FiMenu,
  FiLogOut,
  FiHome,
  FiClock,
} from "react-icons/fi";

function Dashboard() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paciente, setPaciente] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [verModalOpen, setVerModalOpen] = useState(false);
  const [pacienteParaVer, setPacienteParaVer] = useState(null);

  // Función para obtener pacientes
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

  // Función para abrir modal de agregar paciente
  const abrirModalAgregar = () => {
    setPaciente({});
    setModalAbierto(true);
  };

  // Función para guardar paciente
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

  // Función para ver tratamientos
  const verTratamientos = (p) => {
    setPacienteParaVer(p);
    setVerModalOpen(true);
  };

  // Función para abrir modal de procedimiento
  // const abrirModalProcedimiento = (p) => {
  //   setPacienteSeleccionado(p);
  //   setModalOpen(true);
  // };

  // Función para eliminar paciente
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

  // Función para abrir modal de edición
  const abrirModalEditar = (p) => {
    setPaciente(p);
    setModalAbierto(true);
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // 1. Limpiar el almacenamiento local
      localStorage.clear(); // Limpia todo por seguridad

      // 2. Mostrar notificación
      toast.dismiss(); // Cierra toasts anteriores
      const toastId = toast.loading("Cerrando sesión...");

      // Pequeña pausa para mejor experiencia de usuario
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Actualizar el toast
      toast.update(toastId, {
        render: "Sesión cerrada correctamente",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // 4. Redireccionar
      navigate("/login", { replace: true }); // Evita volver atrás con el navegador

      // 5. Forzar recarga si es necesario (opcional)
      window.location.reload();
    } catch (error) {
      console.error("Error en logout:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/login");
      return;
    }

    setUserData(user);
    fetchPacientes();
  }, [navigate]);

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    if (!fechaString) return "No registrada";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(fechaString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel Lateral */}
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

        {/* Perfil del usuario */}
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

        {/* Menú */}
        <nav className="flex-1 p-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-700 mb-2"
          >
            <FiHome size={20} />
            {sidebarOpen && <span>Inicio</span>}
          </button>
          <button
            onClick={abrirModalAgregar}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-700 mb-2"
          >
            <FiPlus size={20} />
            {sidebarOpen && <span>Nuevo Paciente</span>}
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-700 mb-2">
            <FiClock size={20} />
            {sidebarOpen && <span>Próximas Citas</span>}
          </button>
        </nav>

        {/* Botón de cierre de sesión */}
        <div className="p-4 border-t border-teal-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-teal-200 hover:text-white transition-colors duration-200"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {sidebarOpen ? "Panel de Pacientes" : "Pacientes"}
              </h1>
              <p className="text-gray-600">
                {pacientes.length}{" "}
                {pacientes.length === 1
                  ? "paciente registrado"
                  : "pacientes registrados"}
              </p>
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
                      {pacientes.map((p) => {
                        const ultimoTratamiento =
                          p.tratamientos?.length > 0
                            ? p.tratamientos.reduce((a, b) =>
                                new Date(a.fecha) > new Date(b.fecha) ? a : b
                              )
                            : null;

                        return (
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
                                  {/* <div className="text-xs text-gray-500">
                                    ID: {p.id}
                                  </div> */}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {p.telefono}
                              </div>
                              <div className="text-xs text-gray-500">-</div>
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
                                {ultimoTratamiento
                                  ? formatFecha(ultimoTratamiento.fecha)
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {/* <button
                                  onClick={() => abrirModalProcedimiento(p)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Agregar tratamiento"
                                >
                                  <FiFileText />
                                </button> */}
                                <button
                                  onClick={() => verTratamientos(p)}
                                  className="text-gray-600 hover:text-gray-800 p-1"
                                  title="Ver tratamientos"
                                >
                                  <FiCalendar />
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
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

      {/* {pacienteSeleccionado && (
        <TratamientoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          paciente={pacienteSeleccionado}
          onGuardar={() => {
            fetchPacientes();
            toast.success("Tratamiento registrado");
          }}
        />
      )} */}

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
