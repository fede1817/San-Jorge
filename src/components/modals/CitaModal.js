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
  cita = null,
}) {
  const [formData, setFormData] = useState({
    paciente_id: "",
    fecha: new Date(),
    hora: "09:00",
    procedimiento: "",
    estado: "programado",
    odontologo_id: odontologoId,
  });

  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);

  // Función para formatear la hora en formato de 24 horas
  const formatHora24 = (horaString) => {
    if (!horaString) return "";

    // Si ya está en formato 24h, simplemente devolverlo
    if (horaString.includes(":")) {
      const [hours, minutes] = horaString.split(":");
      return `${hours.padStart(2, "0")}:${minutes}`;
    }

    return horaString;
  };

  useEffect(() => {
    if (cita) {
      // Modo edición - asegurar que la hora esté en formato 24h
      setFormData({
        paciente_id: cita.paciente_id || "",
        fecha: cita.fecha ? new Date(cita.fecha) : new Date(),
        hora: formatHora24(cita.hora) || "09:00",
        procedimiento: cita.procedimiento || "",
        estado: cita.estado || "programado",
        odontologo_id: cita.odontologo_id || odontologoId,
      });
    } else {
      // Modo creación
      setFormData({
        paciente_id: "",
        fecha: new Date(),
        hora: "09:00",
        procedimiento: "",
        estado: "programado",
        odontologo_id: odontologoId,
      });
    }
  }, [cita, odontologoId, isOpen]);

  useEffect(() => {
    if (isAdmin && formData.odontologo_id) {
      const pacientesDelDoctor = pacientes.filter(
        (p) => p.doctorId == formData.odontologo_id
      );
      setPacientesFiltrados(pacientesDelDoctor);

      if (
        formData.paciente_id &&
        !pacientesDelDoctor.some((p) => p.id == formData.paciente_id)
      ) {
        setFormData((prev) => ({ ...prev, paciente_id: "" }));
      }
    } else {
      setPacientesFiltrados(pacientes);
    }
  }, [formData.odontologo_id, pacientes, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paciente_id) {
      toast.error("Seleccione un paciente");
      return;
    }

    const pacienteSeleccionado = pacientes.find(
      (p) => p.id === formData.paciente_id
    );
    const doctorAsignado = isAdmin
      ? doctores.find((d) => d.id == formData.odontologo_id)?.nombre
      : null;

    // Formatear la hora para mostrar en el mensaje de confirmación
    const horaFormateada = formatHora24(formData.hora);

    const result = await Swal.fire({
      title: cita ? "¿Actualizar cita?" : "¿Confirmar cita?",
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
          <p><strong>Fecha:</strong> ${formData.fecha.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${horaFormateada}</p>
          ${
            formData.procedimiento
              ? `<p><strong>Procedimiento:</strong> ${formData.procedimiento}</p>`
              : ""
          }
          ${cita ? `<p><strong>Estado:</strong> ${formData.estado}</p>` : ""}
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#6b7280",
      confirmButtonText: cita ? "Sí, actualizar" : "Sí, agendar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "text-left rounded-lg",
        confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
        cancelButton: "px-4 py-2 rounded-md hover:bg-gray-200 transition",
      },
    });

    if (result.isConfirmed) {
      const citaParaEnviar = {
        ...formData,
        fecha: formData.fecha.toISOString().split("T")[0],
        hora: horaFormateada, // Asegurar que la hora esté en formato 24h
        odontologo_id: isAdmin ? formData.odontologo_id : odontologoId,
      };

      if (cita) {
        citaParaEnviar.id = cita.id;
      }

      try {
        await onSave(citaParaEnviar);
        Swal.fire({
          title: cita ? "¡Cita actualizada!" : "¡Cita agendada!",
          text: cita
            ? "La cita se ha actualizado correctamente."
            : "La cita se ha programado correctamente.",
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
          text: cita
            ? "No se pudo actualizar la cita."
            : "No se pudo agendar la cita.",
          icon: "error",
          confirmButtonColor: "#0d9488",
        });
      }
    }
  };

  const handleDoctorChange = (doctorId) => {
    setFormData((prev) => ({ ...prev, odontologo_id: doctorId }));
  };

  const handleClose = () => {
    setFormData({
      paciente_id: "",
      fecha: new Date(),
      hora: "09:00",
      procedimiento: "",
      estado: "programado",
      odontologo_id: odontologoId,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {cita ? "Editar Cita" : "Programar Nueva Cita"}
          </h2>
          <button
            onClick={handleClose}
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
                value={formData.odontologo_id}
                onChange={handleDoctorChange}
                showLabel={false}
              />
            </div>
          )}

          {cita && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="programado">Programado</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          )}

          <SearchableSelect
            pacientes={isAdmin ? pacientesFiltrados : pacientes}
            value={formData.paciente_id}
            onChange={(pacienteId) =>
              setFormData({ ...formData, paciente_id: pacienteId })
            }
            disabled={isAdmin && !formData.odontologo_id}
            placeholder={
              isAdmin && !formData.odontologo_id
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
                selected={formData.fecha}
                onChange={(date) => setFormData({ ...formData, fecha: date })}
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
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
                step="600"
                pattern="[0-9]{2}:[0-9]{2}" // Asegura formato HH:MM
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Procedimiento
            </label>
            <input
              type="text"
              value={formData.procedimiento}
              onChange={(e) =>
                setFormData({ ...formData, procedimiento: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Ej: Limpieza dental, Ortodoncia..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            >
              {cita ? "Actualizar Cita" : "Guardar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
