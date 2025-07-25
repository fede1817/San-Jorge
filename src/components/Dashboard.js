import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchPacientes = async () => {
      const res = await fetch("http://localhost:3001/api/pacientes", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      setPacientes(data);
    };

    fetchPacientes();
  }, [navigate]);

  return (
    <div>
      <h2>Mis Pacientes</h2>
      {pacientes.map((p) => (
        <div key={p.id}>
          <h3>
            {p.nombre} {p.apellido}
          </h3>
          <p>Teléfono: {p.telefono}</p>
          <p>Tratamiento: {p.procedimiento}</p>
          <p>Próxima consulta: {p.proxima_consulta}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
