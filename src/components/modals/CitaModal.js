import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiClock, FiUser, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import SearchableSelect from "../ui/SearchableSelect";
export default function CitaModal({
  isOpen,
  onClose,
  onSave,
  pacientes,
  odontologoId,
}) {
  const [cita, setCita] = useState({
    paciente_id: "",
    fecha: new Date(),
    hora: "09:00",
    procedimiento: "",
    estado: "programado",
    odontologo_id: odontologoId,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cita.paciente_id) {
      toast.error("Seleccione un paciente");
      return;
    }

    const citaParaEnviar = {
      ...cita,
      fecha: cita.fecha.toISOString().split("T")[0],
      odontologo_id: odontologoId,
    };

    onSave(citaParaEnviar);
    onClose();
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

        <form onSubmit={handleSubmit}>
          <SearchableSelect
            pacientes={pacientes}
            value={cita.paciente_id}
            onChange={(pacienteId) =>
              setCita({ ...cita, paciente_id: pacienteId })
            }
          />

          <div className="mb-4">
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

          <div className="mb-4">
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

          <div className="mb-4">
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
