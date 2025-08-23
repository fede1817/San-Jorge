import { useState, useEffect } from "react";
import EmptyState from "./EmptyState";
import LoadingSpinner from "../ui/LoadingSpinner";
import Table from "./Table";
import DoctorSelect from "../ui/DoctorSelect";
import Swal from "sweetalert2";
import {
  FiUser,
  FiX,
  FiSearch,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiFilter,
} from "react-icons/fi";

export default function Citas({
  citas,
  loading,
  formatFecha,
  formatHora,
  isAdmin = false,
  doctores = [],
  onEdit,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [dateRange, setDateRange] = useState({
    desde: "",
    hasta: "",
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filteredCitas, setFilteredCitas] = useState([]);

  // Función para obtener solo la parte de la fecha (ignora horas, minutos, etc.)
  const getDatePart = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleDeleteWithConfirmation = (
    id,
    pacienteNombre,
    pacienteApellido
  ) => {
    Swal.fire({
      title: "¿Eliminar cita?",
      html: `
      <div class="text-left">
        <p>Estás a punto de eliminar la cita de:</p>
        <p class="font-bold">${pacienteNombre} ${pacienteApellido}</p>
        <p class="text-red-600 mt-2">¡Esta acción no se puede deshacer!</p>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "La cita se elimino correctamente.",
          icon: "success",
          confirmButtonColor: "#0d9488",
          customClass: {
            confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
          },
        });
      }
    });
  };

  // Filtrar citas basado en búsqueda, doctor y fechas
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

    // FILTRADO POR FECHAS - SOLUCIÓN DEFINITIVA
    if (dateRange.desde || dateRange.hasta) {
      result = result.filter((cita) => {
        const citaDate = getDatePart(cita.fecha);
        if (!citaDate) return false;

        let pasaFiltro = true;

        // Filtro "Desde"
        if (dateRange.desde) {
          const desdeDate = getDatePart(dateRange.desde);
          pasaFiltro = pasaFiltro && citaDate >= desdeDate;
        }

        // Filtro "Hasta" - incluir todo el día seleccionado
        if (dateRange.hasta) {
          const hastaDate = getDatePart(dateRange.hasta);
          const hastaDatePlusOne = new Date(hastaDate);
          hastaDatePlusOne.setDate(hastaDatePlusOne.getDate() + 1);

          pasaFiltro = pasaFiltro && citaDate < hastaDatePlusOne;
        }

        return pasaFiltro;
      });
    }

    setFilteredCitas(result);
  }, [citas, searchTerm, selectedDoctor, dateRange, isAdmin]);

  const clearDateFilter = () => {
    setDateRange({ desde: "", hasta: "" });
  };

  const hasActiveFilters =
    searchTerm || selectedDoctor || dateRange.desde || dateRange.hasta;

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
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(row)}
            className="text-amber-600 hover:text-amber-800 p-1"
            title="Editar cita"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() =>
              handleDeleteWithConfirmation(
                row.id,
                row.paciente_nombre,
                row.paciente_apellido
              )
            }
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar cita"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Modificar columnas para admin si es necesario
  const modifiedColumns = isAdmin
    ? [
        ...columns.slice(0, 1),
        {
          header: "Doctor",
          render: (row) => (
            <div className="text-sm text-gray-900">
              {doctores.find((d) => d.id == row.odontologo_id)?.nombre ||
                "Sin asignar"}
            </div>
          ),
        },
        ...columns.slice(1),
      ]
    : columns;

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4">
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

          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            <FiFilter size={16} />
            <span>Filtrar por Fecha</span>
          </button>
        </div>

        {/* Filtro de fechas */}
        {showDateFilter && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateRange.desde}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, desde: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateRange.hasta}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, hasta: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Botones - full width en móvil, inline en desktop */}
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <button
                onClick={clearDateFilter}
                className="w-full md:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Limpiar
              </button>
              <button
                onClick={() => setShowDateFilter(false)}
                className="w-full md:w-auto px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
              >
                Aplicar
              </button>
            </div>

            {(dateRange.desde || dateRange.hasta) && (
              <div className="mt-3 text-sm text-gray-600">
                <strong>Filtro activo:</strong>
                {dateRange.desde && ` Desde: ${formatFecha(dateRange.desde)}`}
                {dateRange.hasta && ` Hasta: ${formatFecha(dateRange.hasta)}`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Información de filtros activos */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-blue-800">
            <span className="font-medium">Filtros activos:</span>
            {searchTerm && (
              <span className="bg-blue-100 px-2 py-1 rounded-full">
                Búsqueda: "{searchTerm}"
              </span>
            )}
            {selectedDoctor && (
              <span className="bg-blue-100 px-2 py-1 rounded-full">
                Doctor: {doctores.find((d) => d.id == selectedDoctor)?.nombre}
              </span>
            )}
            {dateRange.desde && (
              <span className="bg-blue-100 px-2 py-1 rounded-full">
                Desde: {formatFecha(dateRange.desde)}
              </span>
            )}
            {dateRange.hasta && (
              <span className="bg-blue-100 px-2 py-1 rounded-full">
                Hasta: {formatFecha(dateRange.hasta)}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDoctor("");
                clearDateFilter();
              }}
              className="text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Limpiar todos
            </button>
          </div>
        </div>
      )}

      {/* Tabla de citas */}
      {filteredCitas.length === 0 ? (
        <EmptyState
          icon={<FiCalendar size={48} />}
          title={
            hasActiveFilters
              ? "No se encontraron citas con los filtros aplicados"
              : "No hay citas programadas"
          }
          subtitle={
            hasActiveFilters
              ? "Intenta ajustar los criterios de búsqueda"
              : "No hay citas agendadas para mostrar"
          }
        />
      ) : (
        <div>
          <div className="text-sm text-gray-600 mb-3">
            Mostrando {filteredCitas.length} de {citas.length} citas
            {hasActiveFilters && " (filtradas)"}
          </div>
          <Table data={filteredCitas} columns={modifiedColumns} />
        </div>
      )}
    </div>
  );
}
