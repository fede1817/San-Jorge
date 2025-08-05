import React from "react";
import { FiUser, FiPhone, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PacienteModal({ isOpen, onClose, onSave, paciente, setPaciente }) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!paciente.nombre || !paciente.apellido || !paciente.telefono) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }

    // Validación de teléfono
    if (!/^[0-9]{10,15}$/.test(paciente.telefono)) {
      toast.warn("El teléfono debe contener solo números (10-15 dígitos)");
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-teal-600 p-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FiUser className="mr-2" />
            {paciente.id ? "Editar Paciente" : "Nuevo Paciente"}
          </h3>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: María"
                  value={paciente.nombre || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ej: González"
                  value={paciente.apellido || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Ej: 5512345678"
                  value={paciente.telefono || ""}
                  onChange={handleChange}
                  pattern="[0-9]{10,15}"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Solo números (10-15 dígitos)
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <FiX className="mr-2" /> Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <FiSave className="mr-2" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PacienteModal;
