import { FiUser, FiPhone, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import EmptyState from "./EmptyState";
import Table from "./Table";
import Swal from "sweetalert2";

export default function Pacientes({
  pacientes,
  loading,
  onEdit,
  onDelete,
  onViewTreatments,
  formatFecha,
}) {
  const handleDeleteWithConfirmation = (id, nombreCompleto) => {
    Swal.fire({
      title: "¿Eliminar paciente?",
      html: `
        <div class="text-left">
          <p>Estás a punto de eliminar al paciente:</p>
          <p class="font-bold">${nombreCompleto}</p>
          <p class="text-red-600 mt-2">¡Esta acción no se puede deshacer!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "text-left",
        confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition", // Estilo similar a tus botones
        cancelButton: "px-4 py-2 rounded-md hover:bg-gray-300 transition", // Estilo similar a tus botones
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El paciente ha sido eliminado correctamente.",
          icon: "success",
          confirmButtonColor: "#0d9488", // Color teal-600
          customClass: {
            confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
          },
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

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
            onClick={() =>
              handleDeleteWithConfirmation(
                row.id,
                `${row.nombre} ${row.apellido}`
              )
            }
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
