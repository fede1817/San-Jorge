import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [matricula, setMatricula] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch("http://localhost:3001/api/login/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        apellido,
        email,
        password,
        matricula,
        especialidad,
      }),
    });

    const data = await res.json();
    if (res.status === 201) {
      setMensaje("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMensaje(data.error || "Error al registrar.");
    }
  };

  return (
    <div>
      <h2>Registro de Odontólogo</h2>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="ci"
        placeholder="Cedula de indentidad"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
      />
      <input
        type="especialidad"
        placeholder="Especialidad"
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
      />

      <button onClick={handleRegister}>Registrarse</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default RegisterPage;
