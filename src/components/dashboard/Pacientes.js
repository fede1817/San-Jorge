import { FiUser, FiPhone, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import EmptyState from "./EmptyState";
import Table from "./Table";

export default function Pacientes({
  pacientes,
  loading,
  onEdit,
  onDelete,
  onViewTreatments,
  formatFecha,
}) {
  if (pacientes.length === 0) {
    return (
      <EmptyState
        icon={<FiUser size={48} />}
        title="No hay pacientes registrados"
      />
    );
  }

  const columns = [
    {
      header: "Paciente",
      render: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
            <FiUser />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.nombre} {row.apellido}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contacto",
      render: (row) => (
        <>
          <div className="flex items-center gap-1">
            {row.telefono && <FiPhone className="text-gray-400" />}
            <span>{row.telefono?.replace(/-/g, "") || "Sin teléfono"}</span>
          </div>
          <div className="text-xs text-gray-500">
            {row.email
              ? row.email.substring(0, 15) +
                (row.email.length > 15 ? "..." : "")
              : ""}
          </div>
        </>
      ),
    },
    {
      header: "Tratamientos",
      render: (row) => (
        <div className="text-sm text-gray-900">
          {row.tratamientos?.length || 0}{" "}
          {row.tratamientos?.length === 1 ? "tratamiento" : "tratamientos"}
        </div>
      ),
    },
    {
      header: "Última Visita",
      render: (row) => (
        <div className="text-sm text-gray-500">
          {row.tratamientos?.length > 0
            ? formatFecha(
                row.tratamientos.reduce((a, b) =>
                  new Date(a.fecha) > new Date(b.fecha) ? a : b
                ).fecha
              )
            : "N/A"}
        </div>
      ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onViewTreatments(row)}
            className="text-gray-600 hover:text-gray-800 p-1"
            title="Ver tratamientos"
          >
            <FiCalendar />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="text-amber-600 hover:text-amber-800 p-1"
            title="Editar"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return <Table data={pacientes} columns={columns} />;
}
