import React, { useState } from "react";
import Modal from "react-modal";

// Necesario para accesibilidad
Modal.setAppElement("#root");

const TratamientoModal = ({ isOpen, onClose, paciente, onGuardar }) => {
  const [form, setForm] = useState({
    fecha: "",
    diagnostico: "",
    procedimiento: "",
    observaciones: "",
    estado: "",
    proxima_consulta: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Este es el fragmento que te falta: la función para guardar
  const guardarTratamiento = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/pacientes/${paciente.id}/tratamiento`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        onGuardar();
        onClose();
        setForm({});
      } else {
        alert("Error al guardar tratamiento");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar tratamiento");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Nuevo Tratamiento"
      className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto mt-20 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Nuevo tratamiento para {paciente.nombre} {paciente.apellido}
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Diagnóstico</label>
          <input
            type="text"
            name="diagnostico"
            value={form.diagnostico}
            onChange={handleChange}
            placeholder="Diagnóstico"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">
            Procedimiento
          </label>
          <input
            type="text"
            name="procedimiento"
            value={form.procedimiento}
            onChange={handleChange}
            placeholder="Procedimiento"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Estado</label>
          <input
            type="text"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            placeholder="Estado"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">
            Próxima consulta
          </label>
          <input
            type="date"
            name="proxima_consulta"
            value={form.proxima_consulta}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={guardarTratamiento}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TratamientoModal;
