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
  FiX,
} from "react-icons/fi";
import Sidebar from "../components/dashboard/Sidebar";
import Pacientes from "../components/dashboard/Pacientes";
import Citas from "../components/dashboard/Citas";
import StatsCards from "../components/dashboard/StatsCards";
import VerTratamientosModal from "../components/modals/VerTratamientosModal";
import PacienteModal from "../components/modals/PacienteModal";
import CitaModal from "../components/modals/CitaModal";
import Pagos from "../components/dashboard/Pagos";

export default function Dashboard() {
  // Estados principales
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setListaDoctores] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState({ pacientes: true, citas: true });
  const [sidebarOpen, setSidebarOpen] = useState(false); // Cambiado a false por defecto en móviles
  const [userData, setUserData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Nuevo sistema de secciones
  const [currentSection, setCurrentSection] = useState("pacientes"); // 'pacientes', 'citas', 'pagos'

  // Estados para modales
  const [modalPacienteOpen, setModalPacienteOpen] = useState(false);
  const [currentPaciente, setCurrentPaciente] = useState({});
  const [verModalOpen, setVerModalOpen] = useState(false);
  const [pacienteParaVer, setPacienteParaVer] = useState(null);
  const [modalCitaOpen, setModalCitaOpen] = useState(false);
  const [currentCita, setCurrentCita] = useState(null);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // En móviles, cerramos el sidebar automáticamente
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }

      // En escritorio, aseguramos que el sidebar esté abierto
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const handleEditCita = (cita) => {
    setCurrentCita(cita);
    setModalCitaOpen(true);
  };

  const handleCloseCitaModal = () => {
    setModalCitaOpen(false);
    setCurrentCita(null);
  };

  // Funciones para fetch data (sin cambios)
  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar pacientes");
      const data = await res.json();

      const normalizedData = data.map((paciente) => ({
        ...paciente,
        odontologo_id:
          paciente.doctorid ||
          paciente.doctorId ||
          paciente.odontologo_id ||
          null,
        doctorNombre: paciente.doctornombre || paciente.doctorNombre || "",
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
      console.log(data);
      setListaDoctores(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Funciones de manejo (sin cambios)
  const handleSavePaciente = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const metodo = currentPaciente.id ? "PUT" : "POST";
      const url = currentPaciente.id
        ? `http://localhost:3001/api/pacientes/${currentPaciente.id}`
        : "http://localhost:3001/api/pacientes";

      const datosPaciente = {
        nombre: currentPaciente.nombre,
        apellido: currentPaciente.apellido,
        telefono: currentPaciente.telefono,
        email: currentPaciente.email,
      };

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

      // Actualizar AMBAS listas
      fetchPacientes();
      fetchCitas(); // ← ¡Esto es lo que faltaba!
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveCita = async (citaData) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const metodo = citaData.id ? "PUT" : "POST";
      let url = "";

      if (citaData.id) {
        url = `http://localhost:3001/api/pacientes/citas/${citaData.id}`;
      } else {
        url = `http://localhost:3001/api/pacientes/${citaData.paciente_id}/tratamiento`;
      }

      const datosCita = {
        fecha: citaData.fecha,
        hora: citaData.hora,
        procedimiento: citaData.procedimiento,
        estado: citaData.estado || "programado",
      };

      if (user?.especialidad === "Administrador" && citaData.odontologo_id) {
        datosCita.odontologo_id = citaData.odontologo_id;
      } else if (!citaData.id) {
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
      fetchCitas();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Sesión cerrada");
    navigate("/");
  };

  // Formateadores (sin cambios)
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

  // Efectos iniciales (sin cambios)
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

    if (user.especialidad === "Administrador") {
      fetchDoctores();
    }
  }, [navigate]);

  // Componente placeholder para pagos (puedes reemplazarlo después)
  const PagosSection = () => (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Módulo de Pagos
        </h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente
        </p>
      </div>
    </div>
  );

  // Función para cambiar sección (cierra sidebar en móviles)
  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Overlay para móviles cuando el sidebar está abierto */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        user={userData}
        currentSection={currentSection}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSectionChange={handleSectionChange}
        onAddPatient={() => {
          setCurrentPaciente({});
          setModalPacienteOpen(true);
          if (isMobile) setSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isMobile={isMobile}
      />

      <div className="flex-1 overflow-auto relative">
        {/* Botón de menú móvil */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-20 bg-teal-600 text-white p-2 rounded-md shadow-lg"
          >
            <FiMenu size={24} />
          </button>
        )}

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8 pt-16 md:pt-8">
          <div className="max-w-6xl mx-auto">
            {/* Sección de Pacientes */}
            {currentSection === "pacientes" && (
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
                  doctores={doctores}
                />
              </>
            )}

            {/* Sección de Citas */}
            {currentSection === "citas" && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Próximas Citas
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setCurrentSection("pacientes")}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FiArrowLeft /> Pacientes
                    </button>
                    <button
                      onClick={() => setModalCitaOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
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
                  onEdit={handleEditCita}
                  onDelete={handleDeleteCita}
                />
              </>
            )}

            {/* Sección de Pagos (Placeholder) */}
            {currentSection === "pagos" && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Gestión de Pagos
                  </h1>
                  <button
                    onClick={() => setCurrentSection("pacientes")}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiArrowLeft /> Volver
                  </button>
                </div>

                <Pagos />
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
        onSave={handleSaveCita}
        pacientes={pacientes}
        odontologoId={userData?.id}
        isAdmin={userData?.especialidad === "Administrador"}
        doctores={doctores}
        cita={currentCita}
      />
    </div>
  );
}
