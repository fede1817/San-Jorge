import React, { useState, useEffect } from "react";
import { FiUser, FiPhone, FiSave, FiX, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import DoctorSelect from "../ui/DoctorSelect";

function PacienteModal({
  isOpen,
  onClose,
  onSave,
  paciente,
  setPaciente,
  isAdmin = false,
  doctores = [],
}) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Efecto para sincronizar el doctor seleccionado con los datos del paciente
  useEffect(() => {
    if (paciente && paciente.odontologo_id) {
      setSelectedDoctor(paciente.odontologo_id.toString());
    } else {
      setSelectedDoctor(null);
    }
  }, [paciente, isOpen]);

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);
    setPaciente((prev) => ({ ...prev, odontologo_id: doctorId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!paciente.nombre || !paciente.apellido || !paciente.telefono) {
      toast.warn("Nombre, apellido y teléfono son obligatorios");
      return;
    }

    // Validación de teléfono
    if (!/^[0-9]{10,15}$/.test(paciente.telefono.replace(/\D/g, ""))) {
      toast.warn("El teléfono debe contener solo números (10-15 dígitos)");
      return;
    }

    // Validación de email opcional pero si existe debe ser válido
    if (paciente.email && !/\S+@\S+\.\S+/.test(paciente.email)) {
      toast.warn("Por favor ingresa un email válido");
      return;
    }

    // Preparar datos para la confirmación
    const doctorAsignado =
      isAdmin && selectedDoctor
        ? doctores.find((d) => d.id == selectedDoctor)?.nombre
        : null;

    const result = await Swal.fire({
      title: paciente.id ? "¿Actualizar paciente?" : "¿Crear nuevo paciente?",
      html: `
        <div class="text-left">
          <p><strong>Nombre:</strong> ${paciente.nombre}</p>
          <p><strong>Apellido:</strong> ${paciente.apellido}</p>
          <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
          ${
            paciente.email
              ? `<p><strong>Email:</strong> ${paciente.email}</p>`
              : ""
          }
          ${
            isAdmin && doctorAsignado
              ? `<p><strong>Doctor asignado:</strong> ${doctorAsignado}</p>`
              : isAdmin
              ? "<p><strong>Doctor asignado:</strong> No asignado</p>"
              : ""
          }
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#6b7280",
      confirmButtonText: paciente.id ? "Sí, actualizar" : "Sí, crear",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await onSave();
        Swal.fire({
          title: paciente.id ? "¡Paciente actualizado!" : "¡Paciente creado!",
          text: `Los datos del paciente se han ${
            paciente.id ? "actualizado" : "guardado"
          } correctamente.`,
          icon: "success",
          confirmButtonColor: "#0d9488",
        });
        onClose();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `No se pudo ${
            paciente.id ? "actualizar" : "crear"
          } el paciente: ${error.message}`,
          icon: "error",
          confirmButtonColor: "#0d9488",
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-teal-600 p-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FiUser className="mr-2" />
            {paciente.id ? "Editar Paciente" : "Nuevo Paciente"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asignar a Doctor
                </label>
                <DoctorSelect
                  doctores={doctores}
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  showLabel={false}
                  placeholder="Seleccionar doctor"
                />
              </div>
            )}

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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Solo números (10-15 dígitos)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="nombre@correo.com"
                  value={paciente.email || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

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
