import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSave,
  FiX,
  FiCalendar,
  FiFileText,
  FiClipboard,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";

// Necesario para accesibilidad
Modal.setAppElement("#root");

const TratamientoModal = ({ isOpen, onClose, paciente, onGuardar }) => {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    diagnostico: "",
    procedimiento: "",
    observaciones: "",
    estado: "Pendiente",
    proxima_consulta: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardarTratamiento = async () => {
    // Validación básica
    if (!form.diagnostico || !form.procedimiento) {
      toast.warn("Diagnóstico y Procedimiento son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/pacientes/${paciente.id}/tratamiento`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...form,
            odontologo_id: JSON.parse(localStorage.getItem("user")).id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          res.status === 401 ? "No autorizado" : "Error del servidor"
        );
      }

      toast.success("Tratamiento registrado exitosamente");
      onGuardar();
      onClose();
      setForm({
        fecha: new Date().toISOString().split("T")[0],
        diagnostico: "",
        procedimiento: "",
        observaciones: "",
        estado: "Pendiente",
        proxima_consulta: "",
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Nuevo Tratamiento"
      className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto my-8 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      closeTimeoutMS={200}
    >
      <div className="p-6">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Nuevo Tratamiento Odontológico
            </h2>
            <p className="text-gray-600">
              Paciente:{" "}
              <span className="font-medium">
                {paciente.nombre} {paciente.apellido}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Cerrar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-800 mb-1 flex items-center">
                <FiCalendar className="mr-2" /> Fecha del Tratamiento
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiFileText className="mr-2" /> Diagnóstico
              </label>
              <textarea
                name="diagnostico"
                value={form.diagnostico}
                onChange={handleChange}
                placeholder="Ej: Caries en molar inferior derecho"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiClipboard className="mr-2" /> Procedimiento Realizado
              </label>
              <textarea
                name="procedimiento"
                value={form.procedimiento}
                onChange={handleChange}
                placeholder="Ej: Obturación composite en pieza 46"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
                required
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado del Tratamiento
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiCalendar className="mr-2" /> Próxima Consulta
              </label>
              <input
                type="date"
                name="proxima_consulta"
                value={form.proxima_consulta}
                onChange={handleChange}
                min={form.fecha}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiEye className="mr-2" /> Observaciones
              </label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                placeholder="Notas adicionales sobre el tratamiento"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
              />
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <FiX className="mr-2" /> Cancelar
          </button>
          <button
            type="button"
            onClick={guardarTratamiento}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Guardar Tratamiento
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TratamientoModal;
