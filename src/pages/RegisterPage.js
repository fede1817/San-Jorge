import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { API_URL } from "./config";

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
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await fetch(API_URL + "/api/login/register", {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <ToastContainer position="top-center" toastClassName="mt-16 mx-4" />

      <div className="w-full max-w-2xl mx-auto my-4 sm:my-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Encabezado */}
          <div className="bg-teal-600 py-5 sm:py-6 px-6 sm:px-8 text-center">
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 sm:h-12 sm:w-12 text-white"
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Registro Odontológico
            </h1>
            <p className="text-teal-100 mt-1 text-sm sm:text-base">
              Complete sus datos profesionales
            </p>
          </div>

          {/* Formulario */}
          <div className="p-5 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
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
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoComplete="given-name"
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
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoComplete="family-name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email *
              </label>
              <input
                name="email"
                type="email"
                placeholder="juan.perez@sanjorge.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoComplete="email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
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
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoComplete="off"
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
                className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
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

            <div className="md:col-span-2 mt-5 sm:mt-6">
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
