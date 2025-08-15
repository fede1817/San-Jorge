import { useState, useEffect } from "react";
import { FiUser, FiX, FiSearch, FiCalendar } from "react-icons/fi";
import EmptyState from "./EmptyState";
import LoadingSpinner from "../ui/LoadingSpinner";
import Table from "./Table";
import DoctorSelect from "../ui/DoctorSelect";
import Swal from "sweetalert2";

export default function Citas({
  citas,
  loading,
  onCancel,
  formatFecha,
  formatHora,
  isAdmin = false,
  doctores = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [filteredCitas, setFilteredCitas] = useState([]);

  // Filtrar citas basado en búsqueda y selección de doctor
  useEffect(() => {
    let result = [...citas];

    // Filtrar por doctor si está seleccionado y es admin
    if (isAdmin && selectedDoctor) {
      result = result.filter((cita) => cita.odontologo_id == selectedDoctor);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (cita) =>
          cita.paciente_nombre?.toLowerCase().includes(term) ||
          cita.procedimiento?.toLowerCase().includes(term) ||
          cita.telefono?.toLowerCase().includes(term)
      );
    }

    setFilteredCitas(result);
  }, [citas, searchTerm, selectedDoctor, isAdmin]);

  const handleCancelWithConfirmation = (id, pacienteNombre) => {
    Swal.fire({
      title: "¿Cancelar cita?",
      html: `
        <div class="text-left">
          <p>Estás a punto de cancelar la cita de:</p>
          <p class="font-bold">${pacienteNombre}</p>
          <p class="text-red-600 mt-2">Esta acción cambiará el estado de la cita a "cancelado"</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantener",
      customClass: {
        popup: "text-left",
        confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
        cancelButton: "px-4 py-2 rounded-md hover:bg-gray-300 transition",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onCancel(id);
      }
    });
  };

  if (loading) return <LoadingSpinner />;

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
              {row.paciente_nombre} {row.paciente_apellido}
            </div>
            <div className="text-xs text-gray-500">{row.telefono}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Fecha y Hora",
      render: (row) => (
        <div className="text-sm text-gray-900">
          <div>{formatFecha(row.fecha)}</div>
          <div className="text-xs text-gray-500">{formatHora(row.hora)}</div>
        </div>
      ),
    },
    {
      header: "Procedimiento",
      accessor: "procedimiento",
      render: (procedimiento) => {
        // Convertir a string si no lo es (maneja null, undefined, números, etc.)
        const procedimientoStr = String(procedimiento || "");
        return (
          <div className="text-sm text-gray-900">
            {procedimientoStr.length > 30
              ? `${procedimientoStr.substring(0, 30)}...`
              : procedimientoStr}
          </div>
        );
      },
    },
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
          <div className="flex justify-end">
            <button
              onClick={() =>
                handleCancelWithConfirmation(row.id, row.paciente_nombre)
              }
              className="text-red-600 hover:text-red-800 p-1"
              title="Cancelar cita"
            >
              <FiX size={18} />
            </button>
          </div>
        ),
    },
  ];

  // Modificar columnas para admin si es necesario
  const modifiedColumns = isAdmin
    ? [
        ...columns.slice(0, 1), // Primera columna (Paciente)
        {
          header: "Doctor",
          render: (row) => (
            <div className="text-sm text-gray-900">
              {doctores.find((d) => d.id == row.odontologo_id)?.nombre ||
                "Sin asignar"}
            </div>
          ),
        },
        ...columns.slice(1), // Resto de columnas
      ]
    : columns;

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Buscar citas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div className="w-full md:w-1/3">
            <DoctorSelect
              doctores={doctores}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
            />
          </div>
        )}
      </div>

      {/* Tabla de citas */}
      {filteredCitas.length === 0 ? (
        <EmptyState
          icon={<FiCalendar size={48} />}
          title={
            searchTerm || selectedDoctor
              ? "No se encontraron resultados"
              : "No hay citas programadas"
          }
        />
      ) : (
        <Table data={filteredCitas} columns={modifiedColumns} />
      )}
    </div>
  );
}
