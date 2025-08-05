import { FiUser, FiX } from "react-icons/fi";
import EmptyState from "./EmptyState";
import LoadingSpinner from "../ui/LoadingSpinner";
import Table from "./Table";
import { FiCalendar } from "react-icons/fi";

export default function Citas({
  citas,
  loading,
  onCancel,
  formatFecha,
  formatHora,
}) {
  if (loading) return <LoadingSpinner />;

  if (citas.length === 0) {
    return (
      <EmptyState
        icon={<FiCalendar size={48} />}
        title="No hay citas programadas"
      />
    );
  }

  const columns = [
    { header: "Paciente", accessor: "paciente_nombre" },
    { header: "Fecha", accessor: "fecha", format: formatFecha },
    { header: "Hora", accessor: "hora", format: formatHora },
    { header: "Procedimiento", accessor: "procedimiento" },
    {
      header: "Estado",
      accessor: "estado",
      render: (estado) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            estado === "programado"
              ? "bg-blue-100 text-blue-800"
              : estado === "completado"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {estado}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (_, row) =>
        row.estado === "programado" && (
          <button
            onClick={() => onCancel(row.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Cancelar cita"
          >
            <FiX size={18} />
          </button>
        ),
    },
  ];

  return <Table data={citas} columns={columns} />;
}
