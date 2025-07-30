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
      setMensaje("✅ Registro exitoso. Redirigiendo...");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMensaje(data.error || "❌ Error al registrar.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Registro de Odontólogo
        </h2>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          placeholder="Cédula de identidad"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Registrarse
        </button>

        {mensaje && (
          <p className="mt-4 text-center text-sm text-gray-600">{mensaje}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
