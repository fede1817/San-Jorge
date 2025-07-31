import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warn("Por favor complete todos los campos");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        // Asegúrate que el backend devuelva los datos completos del usuario
        localStorage.setItem(
          "user",
          JSON.stringify({
            nombre: data.user.nombre,
            apellido: data.user.apellido,
            especialidad: data.user.especialidad,
            email: data.user.email,
            matricula: data.user.matricula,
          })
        );

        toast.success(`Bienvenido Dr. ${data.user.nombre}`);
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Credenciales inválidas");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-cyan-50">
      <ToastContainer position="top-center" />
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Encabezado con temática dental */}
          <div className="bg-cyan-600 py-6 px-8 text-center">
            <div className="flex justify-center mb-4">
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
            <h1 className="text-3xl font-bold text-white">SAN JORGE</h1>
            <p className="text-cyan-100 mt-1">Personalizando su sonrisa</p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@odontoplus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white shadow-md transition duration-200 ${
                loading
                  ? "bg-cyan-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700"
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
                  Cargando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/register")}
                className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>
            © {new Date().getFullYear()} San Jorge - Todos los derechos
            reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
