import React from "react";

function PacienteModal({ isOpen, onClose, onSave, paciente, setPaciente }) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{paciente?.id ? "Editar paciente" : "Agregar paciente"}</h3>
        <input
          name="nombre"
          placeholder="Nombre"
          value={paciente.nombre || ""}
          onChange={handleChange}
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={paciente.apellido || ""}
          onChange={handleChange}
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={paciente.telefono || ""}
          onChange={handleChange}
        />
        <div style={{ marginTop: "10px" }}>
          <button onClick={onSave}>Guardar</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "300px",
  },
};

export default PacienteModal;
