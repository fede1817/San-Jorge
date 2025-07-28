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
      const res = await fetch(`/api/pacientes/${paciente.id}/tratamiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        onGuardar();
        onClose();
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
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          width: "400px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <h2>
        Nuevo tratamiento para {paciente.nombre} {paciente.apellido}
      </h2>

      <label>Fecha:</label>
      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
      />

      <label>Diagnóstico:</label>
      <input
        type="text"
        name="diagnostico"
        value={form.diagnostico}
        onChange={handleChange}
        placeholder="Diagnóstico"
      />

      <label>Procedimiento:</label>
      <input
        type="text"
        name="procedimiento"
        value={form.procedimiento}
        onChange={handleChange}
        placeholder="Procedimiento"
      />

      <label>Observaciones:</label>
      <textarea
        name="observaciones"
        value={form.observaciones}
        onChange={handleChange}
        placeholder="Observaciones"
      />

      <label>Estado:</label>
      <input
        type="text"
        name="estado"
        value={form.estado}
        onChange={handleChange}
        placeholder="Estado"
      />

      <label>Próxima consulta:</label>
      <input
        type="date"
        name="proxima_consulta"
        value={form.proxima_consulta}
        onChange={handleChange}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={guardarTratamiento} style={{ marginRight: "10px" }}>
          Guardar
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default TratamientoModal;
