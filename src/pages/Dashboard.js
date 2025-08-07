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

  // Funciones para fetch data
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

  // Funciones de manejo
  const handleSavePaciente = async () => {
    try {
      const token = localStorage.getItem("token");
      const metodo = currentPaciente.id ? "PUT" : "POST";
      const url = currentPaciente.id
        ? `http://localhost:3001/api/pacientes/${currentPaciente.id}`
        : "http://localhost:3001/api/pacientes";

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentPaciente),
      });

      if (!res.ok)
        throw new Error(
          currentPaciente.id ? "Error al actualizar" : "Error al crear"
        );

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
      const res = await fetch(
        `http://localhost:3001/api/pacientes/${citaData.paciente_id}/tratamiento`,
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

      toast.success("Cita programada correctamente");
      setModalCitaOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelCita = async (id) => {
    if (!window.confirm("¿Está seguro de cancelar esta cita?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/pacientes/${id}/cancelar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al cancelar cita");

      setCitas(
        citas.map((cita) =>
          cita.id === id ? { ...cita, estado: "cancelado" } : cita
        )
      );
      toast.success("Cita cancelada correctamente");
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
                  onCancel={handleCancelCita}
                  formatFecha={formatFecha}
                  formatHora={formatHora}
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
        onSave={handleSaveCita}
        pacientes={pacientes}
        odontologoId={userData?.id}
      />
    </div>
  );
}
