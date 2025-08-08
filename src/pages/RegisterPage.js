import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    matricula: "",
    especialidad: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    // Validación de campos
    if (!Object.values(formData).every((field) => field.trim() !== "")) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.warn("Ingrese un email válido");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/login/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.status === 201) {
        toast.success("✅ Registro exitoso. Redirigiendo...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data.error || "❌ Error al registrar");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="w-full max-w-2xl mx-4 my-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Encabezado */}
          <div className="bg-teal-600 py-6 px-8 text-center">
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Registro Odontológico
            </h1>
            <p className="text-teal-100 mt-1">
              Complete sus datos profesionales
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Información Personal
              </h2>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                name="nombre"
                type="text"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Apellido *
              </label>
              <input
                name="apellido"
                type="text"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email *
              </label>
              <input
                name="email"
                type="email"
                placeholder="juan.perez@clinica.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Contraseña *
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Información Profesional
              </h2>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Matrícula/Cédula *
              </label>
              <input
                name="matricula"
                type="text"
                placeholder="12345678"
                value={formData.matricula}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Especialidad *
              </label>
              <select
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">Seleccione...</option>
                <option value="Ortodoncia">Ortodoncia</option>
                <option value="Endodoncia">Endodoncia</option>
                <option value="Periodoncia">Periodoncia</option>
                <option value="Odontopediatría">Odontopediatría</option>
                <option value="Cirugía">Cirugía</option>
                <option value="Estética">Estética</option>
                <option value="General">General</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-6">
              <button
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-medium text-white shadow-md transition duration-200 ${
                  loading
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  "Registrarse"
                )}
              </button>
            </div>

            <div className="md:col-span-2 text-center mt-4">
              <button
                onClick={() => navigate("/")}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium"
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>
            © {new Date().getFullYear()} OdontoClinic - Todos los derechos
            reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
