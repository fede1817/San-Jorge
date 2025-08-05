import { useState, useEffect } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import TratamientoModal from "./TratamientoModal";

export default function VerTratamientosModal({
  isOpen,
  onClose,
  paciente,
  onCitaAdded,
}) {
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTratamiento, setCurrentTratamiento] = useState(null);

  useEffect(() => {
    if (isOpen && paciente?.id) {
      fetchTratamientos();
    }
  }, [isOpen, paciente]);

  const fetchTratamientos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/pacientes/proximas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar tratamientos");
      const data = await res.json();
      setTratamientos(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTratamiento = async (tratamientoData) => {
    try {
      const token = localStorage.getItem("token");
      const method = tratamientoData.id ? "PUT" : "POST";
      const url = tratamientoData.id
        ? `http://localhost:3001/api/tratamientos/${tratamientoData.id}`
        : `http://localhost:3001/api/pacientes/${paciente.id}/tratamientos`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tratamientoData),
      });

      if (!res.ok) throw new Error("Error al guardar tratamiento");

      toast.success("Tratamiento guardado correctamente");
      fetchTratamientos();
      setModalOpen(false);
      if (onCitaAdded) onCitaAdded();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteTratamiento = async (id) => {
    if (!window.confirm("¿Eliminar este tratamiento?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/tratamientos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar tratamiento");

      toast.success("Tratamiento eliminado");
      fetchTratamientos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  const formatFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-semibold">
              Tratamientos de {paciente.nombre} {paciente.apellido}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-4 overflow-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : tratamientos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay tratamientos registrados
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Procedimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tratamientos.map((tratamiento) => (
                    <tr key={tratamiento.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {tratamiento.procedimiento}
                        </div>
                        {tratamiento.notas && (
                          <div className="text-xs text-gray-500 mt-1">
                            {tratamiento.notas.substring(0, 50)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFecha(tratamiento.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            tratamiento.estado === "completado"
                              ? "bg-green-100 text-green-800"
                              : tratamiento.estado === "en_proceso"
                              ? "bg-blue-100 text-blue-800"
                              : tratamiento.estado === "cancelado"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tratamiento.estado.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tratamiento.costo ? `$${tratamiento.costo}` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setCurrentTratamiento(tratamiento);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTratamiento(tratamiento.id)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="border-t p-4 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                setCurrentTratamiento(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
            >
              <FiPlus /> Nuevo Tratamiento
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
