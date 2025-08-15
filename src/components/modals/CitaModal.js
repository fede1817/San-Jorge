import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiClock, FiUser, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SearchableSelect from "../ui/SearchableSelect";
import DoctorSelect from "../ui/DoctorSelect";

export default function CitaModal({
  isOpen,
  onClose,
  onSave,
  pacientes,
  odontologoId,
  isAdmin = false,
  doctores = [],
}) {
  const [cita, setCita] = useState({
    paciente_id: "",
    fecha: new Date(),
    hora: "09:00",
    procedimiento: "",
    estado: "programado",
    odontologo_id: odontologoId,
  });
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  useEffect(() => {
    if (isAdmin && cita.odontologo_id) {
      const pacientesDelDoctor = pacientes.filter(
        (p) => p.doctorId == cita.odontologo_id
      );
      setPacientesFiltrados(pacientesDelDoctor);

      // Resetear paciente seleccionado si no está en la nueva lista
      if (
        cita.paciente_id &&
        !pacientesDelDoctor.some((p) => p.id == cita.paciente_id)
      ) {
        setCita((prev) => ({ ...prev, paciente_id: "" }));
      }
    } else {
      setPacientesFiltrados(pacientes);
    }
  }, [cita.odontologo_id, pacientes, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cita.paciente_id) {
      toast.error("Seleccione un paciente");
      return;
    }

    // Mostrar confirmación antes de guardar
    const pacienteSeleccionado = pacientes.find(
      (p) => p.id === cita.paciente_id
    );
    const doctorAsignado = isAdmin
      ? doctores.find((d) => d.id == cita.odontologo_id)?.nombre
      : null;

    const result = await Swal.fire({
      title: "¿Confirmar cita?",
      html: `
        <div class="text-left">
          <p><strong>Paciente:</strong> ${pacienteSeleccionado?.nombre || ""} ${
        pacienteSeleccionado?.apellido || ""
      }</p>
          ${
            isAdmin
              ? `<p><strong>Doctor asignado:</strong> ${
                  doctorAsignado || "No asignado"
                }</p>`
              : ""
          }
          <p><strong>Fecha:</strong> ${cita.fecha.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${cita.hora}</p>
          ${
            cita.procedimiento
              ? `<p><strong>Procedimiento:</strong> ${cita.procedimiento}</p>`
              : ""
          }
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, agendar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "text-left rounded-lg",
        confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
        cancelButton: "px-4 py-2 rounded-md hover:bg-gray-200 transition",
      },
    });

    if (result.isConfirmed) {
      const citaParaEnviar = {
        ...cita,
        fecha: cita.fecha.toISOString().split("T")[0],
        // Usar el odontologo_id seleccionado o el del usuario logueado
        odontologo_id: isAdmin ? cita.odontologo_id : odontologoId,
      };

      // Resetear el formulario
      setCita({
        paciente_id: "",
        fecha: new Date(),
        hora: "09:00",
        procedimiento: "",
        estado: "programado",
        odontologo_id: odontologoId,
      });

      try {
        await onSave(citaParaEnviar);
        Swal.fire({
          title: "¡Cita agendada!",
          text: "La cita se ha programado correctamente.",
          icon: "success",
          confirmButtonColor: "#0d9488",
          customClass: {
            confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
          },
        });
        onClose();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo agendar la cita.",
          icon: "error",
          confirmButtonColor: "#0d9488",
        });
      }
    }
  };

  const handleDoctorChange = (doctorId) => {
    setCita((prev) => ({ ...prev, odontologo_id: doctorId }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Programar Nueva Cita</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdmin && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Asignar a Doctor *
              </label>
              <DoctorSelect
                doctores={doctores}
                value={cita.odontologo_id}
                onChange={handleDoctorChange}
                showLabel={false}
              />
            </div>
          )}

          <SearchableSelect
            pacientes={isAdmin ? pacientesFiltrados : pacientes}
            value={cita.paciente_id}
            onChange={(pacienteId) =>
              setCita({ ...cita, paciente_id: pacienteId })
            }
            disabled={isAdmin && !cita.odontologo_id}
            placeholder={
              isAdmin && !cita.odontologo_id
                ? "Seleccione un doctor primero"
                : "Buscar paciente"
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Fecha *
              </label>
              <DatePicker
                selected={cita.fecha}
                onChange={(date) => setCita({ ...cita, fecha: date })}
                minDate={new Date()}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Hora *
              </label>
              <input
                type="time"
                value={cita.hora}
                onChange={(e) => setCita({ ...cita, hora: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Procedimiento
            </label>
            <input
              type="text"
              value={cita.procedimiento}
              onChange={(e) =>
                setCita({ ...cita, procedimiento: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Ej: Limpieza dental, Ortodoncia..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
