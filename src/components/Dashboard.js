import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PacienteModal from "./PacienteModal";

function Dashboard() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paciente, setPaciente] = useState({});

  const fetchPacientes = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/pacientes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    setPacientes(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchPacientes();
  }, [navigate]);

  const eliminarPaciente = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3001/api/pacientes/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    fetchPacientes();
  };

  const abrirModalAgregar = () => {
    setPaciente({});
    setModalAbierto(true);
  };

  const abrirModalEditar = (p) => {
    setPaciente(p);
    setModalAbierto(true);
  };

  const guardarPaciente = async () => {
    const token = localStorage.getItem("token");
    const metodo = paciente.id ? "PUT" : "POST";
    const url = paciente.id
      ? `http://localhost:3001/api/pacientes/${paciente.id}`
      : "http://localhost:3001/api/pacientes";

    await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(paciente),
    });

    setModalAbierto(false);
    setPaciente({});
    fetchPacientes();
  };

  return (
    <div>
      <h2>Mis Pacientes</h2>
      <button onClick={abrirModalAgregar}>Agregar paciente</button>
      {pacientes.map((p) => (
        <div key={p.id}>
          <h4>
            {p.nombre} {p.apellido}
          </h4>
          <p>Teléfono: {p.telefono}</p>
          <p>Tratamiento: {p.procedimiento}</p>
          <p>Próxima consulta: {p.proxima_consulta}</p>
          <button onClick={() => abrirModalEditar(p)}>Editar</button>
          <button onClick={() => eliminarPaciente(p.id)}>Eliminar</button>
        </div>
      ))}

      <PacienteModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarPaciente}
        paciente={paciente}
        setPaciente={setPaciente}
      />
    </div>
  );
}

export default Dashboard;
