import React from "react";

function PacienteModal({ isOpen, onClose, onSave, paciente, setPaciente }) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div style={modalEstilo}>
      <h3>{paciente.id ? "Editar paciente" : "Nuevo paciente"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={paciente.nombre || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={paciente.apellido || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={paciente.telefono || ""}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

const modalEstilo = {
  position: "fixed",
  top: "20%",
  left: "30%",
  right: "30%",
  padding: "2rem",
  background: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};

export default PacienteModal;
