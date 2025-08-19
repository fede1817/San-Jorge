import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiPlus,
  FiMenu,
  FiLogOut,
  FiHome,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import Sidebar from "../components/dashboard/Sidebar";
import Pacientes from "../components/dashboard/Pacientes";
import Citas from "../components/dashboard/Citas";
import StatsCards from "../components/dashboard/StatsCards";
import VerTratamientosModal from "../components/modals/VerTratamientosModal";
import PacienteModal from "../components/modals/PacienteModal";
import CitaModal from "../components/modals/CitaModal";

export default function Dashboard() {
  // Estados principales
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setListaDoctores] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState({ pacientes: true, citas: true });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showCitas, setShowCitas] = useState(false);
  const navigate = useNavigate();

  // Estados para modales
  const [modalPacienteOpen, setModalPacienteOpen] = useState(false);
  const [currentPaciente, setCurrentPaciente] = useState({});
  const [verModalOpen, setVerModalOpen] = useState(false);
  const [pacienteParaVer, setPacienteParaVer] = useState(null);
  const [modalCitaOpen, setModalCitaOpen] = useState(false);
  const handleEditCita = (cita) => {
    setCurrentCita(cita);
    setModalCitaOpen(true);
  };

  // Función para manejar la creación de citas

  // Función para cerrar el modal
  const handleCloseCitaModal = () => {
    setModalCitaOpen(false);
    setCurrentCita(null);
  };
  // Funciones para fetch data
  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar pacientes");
      const data = await res.json();

      // Normaliza los nombres de propiedades
      const normalizedData = data.map((paciente) => ({
        ...paciente,
        doctorId: paciente.doctorid || paciente.doctorId,
        doctorNombre: paciente.doctornombre || paciente.doctorNombre,
      }));

      setPacientes(normalizedData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, pacientes: false }));
    }
  };

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

  const fetchDoctores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes/doctores", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar doctores");
      const data = await res.json();
      setListaDoctores(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Funciones de manejo
  const handleSavePaciente = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const metodo = currentPaciente.id ? "PUT" : "POST";
      const url = currentPaciente.id
        ? `http://localhost:3001/api/pacientes/${currentPaciente.id}`
        : "http://localhost:3001/api/pacientes";

      // Preparar datos a enviar
      const datosPaciente = {
        nombre: currentPaciente.nombre,
        apellido: currentPaciente.apellido,
        telefono: currentPaciente.telefono,
        email: currentPaciente.email,
      };

      // Si es admin y hay doctor seleccionado, incluir odontologo_id
      if (
        user?.especialidad === "Administrador" &&
        currentPaciente.odontologo_id
      ) {
        datosPaciente.odontologo_id = currentPaciente.odontologo_id;
      }

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosPaciente),
      });

      if (!res.ok) throw new Error(res.statusText);

      toast.success(
        currentPaciente.id ? "Paciente actualizado" : "Paciente creado"
      );
      setModalPacienteOpen(false);
      fetchPacientes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePaciente = async (id) => {
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

  const handleSaveCita = async (citaData) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // Determinar método y URL
      const metodo = citaData.id ? "PUT" : "POST";
      let url = "";

      if (citaData.id) {
        // Modo edición - usar endpoint de citas
        url = `http://localhost:3001/api/pacientes/citas/${citaData.id}`;
      } else {
        // Modo creación - usar endpoint de pacientes/tratamiento
        url = `http://localhost:3001/api/pacientes/${citaData.paciente_id}/tratamiento`;
      }

      // Preparar datos a enviar
      const datosCita = {
        fecha: citaData.fecha,
        hora: citaData.hora,
        procedimiento: citaData.procedimiento,
        estado: citaData.estado || "programado",
      };

      // Si es admin y hay odontologo_id especificado, incluirlo
      if (user?.especialidad === "Administrador" && citaData.odontologo_id) {
        datosCita.odontologo_id = citaData.odontologo_id;
      } else if (!citaData.id) {
        // En creación, si no es admin, usar el odontologoId del usuario
        datosCita.odontologo_id = user?.id;
      }

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosCita),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            errorData.mensaje ||
            `Error al ${citaData.id ? "actualizar" : "guardar"} cita`
        );
      }

      toast.success(
        citaData.id
          ? "Cita actualizada correctamente"
          : "Cita programada correctamente"
      );
      setModalCitaOpen(false);
      setCurrentCita(null);
      fetchCitas();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCita = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/pacientes/citas/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || "Error al eliminar cita");
      }

      toast.success("Cita eliminada correctamente");
      fetchCitas(); // Recargar citas
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Estado para la cita actual
  const [currentCita, setCurrentCita] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Sesión cerrada");
    navigate("/");
  };

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
    return horaString.substring(0, 5);
  };

  // Efectos iniciales
  // En el useEffect principal, añade:
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

    // Solo cargar doctores completos si es admin
    if (user.especialidad === "Administrador") {
      fetchDoctores();
    }
  }, [navigate]);

  // Elimina la función obtenerListaDoctores ya que no la necesitaremos

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        user={userData}
        showCitas={showCitas}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onShowCitasChange={setShowCitas}
        onAddPatient={() => {
          setCurrentPaciente({});
          setModalPacienteOpen(true);
        }}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {!showCitas ? (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Panel de Pacientes
                  </h1>
                  <p className="text-gray-600">
                    {pacientes.length}{" "}
                    {pacientes.length === 1 ? "paciente" : "pacientes"}
                  </p>
                </div>

                <StatsCards pacientes={pacientes} citas={citas} />

                <Pacientes
                  pacientes={pacientes}
                  loading={loading.pacientes}
                  onEdit={(p) => {
                    setCurrentPaciente(p);
                    setModalPacienteOpen(true);
                  }}
                  onDelete={handleDeletePaciente}
                  onViewTreatments={(p) => {
                    setPacienteParaVer(p);
                    setVerModalOpen(true);
                  }}
                  formatFecha={formatFecha}
                  isAdmin={userData?.especialidad === "Administrador"}
                  doctores={doctores} // Ahora pasamos la lista completa de doctores
                />
              </>
            ) : (
              <>
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

                <Citas
                  citas={citas}
                  loading={loading.citas}
                  formatFecha={formatFecha}
                  formatHora={formatHora}
                  isAdmin={userData?.especialidad === "Administrador"}
                  doctores={doctores}
                  onEdit={handleEditCita} // Pasar función de edición
                  onDelete={handleDeleteCita}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <PacienteModal
        isOpen={modalPacienteOpen}
        onClose={() => setModalPacienteOpen(false)}
        onSave={handleSavePaciente}
        paciente={currentPaciente}
        setPaciente={setCurrentPaciente}
        isAdmin={userData?.especialidad === "Administrador"}
        doctores={doctores}
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
        onClose={handleCloseCitaModal}
        onSave={handleSaveCita} // Usamos la misma función para crear y editar
        pacientes={pacientes}
        odontologoId={userData?.id}
        isAdmin={userData?.especialidad === "Administrador"}
        doctores={doctores}
        cita={currentCita} // Pasar null para crear o la cita para editar
      />
    </div>
  );
}
