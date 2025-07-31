import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Necesario para accesibilidad
Modal.setAppElement("#root");

const VerTratamientosModal = ({ isOpen, onClose, paciente }) => {
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTratamientos = async () => {
      if (!isOpen || !paciente?.id) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/pacientes/${paciente.id}/tratamiento`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setTratamientos(data);
      } catch (err) {
        console.error("Error fetching tratamientos:", err);
        setError(err.message);
        toast.error("Error al cargar tratamientos");
      } finally {
        setLoading(false);
      }
    };

    fetchTratamientos();
  }, [isOpen, paciente]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Historial de Tratamientos"
      className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto mt-10 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Historial de Tratamientos - {paciente?.nombre} {paciente?.apellido}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Reintentar
          </button>
        </div>
      ) : tratamientos.length === 0 ? (
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-blue-800">
            No se encontraron tratamientos registrados
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnóstico
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedimiento
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Consulta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tratamientos.map((tratamiento, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(tratamiento.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs">
                    {tratamiento.diagnostico}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                    {tratamiento.procedimiento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        tratamiento.estado === "Completado"
                          ? "bg-green-100 text-green-800"
                          : tratamiento.estado === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tratamiento.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tratamiento.proxima_consulta
                      ? new Date(
                          tratamiento.proxima_consulta
                        ).toLocaleDateString()
                      : "No programada"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default VerTratamientosModal;
