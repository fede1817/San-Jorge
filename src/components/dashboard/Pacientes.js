import { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import EmptyState from "./EmptyState";
import Table from "./Table";
import Swal from "sweetalert2";
import DoctorSelect from "../ui/DoctorSelect";

export default function Pacientes({
  pacientes,
  loading,
  onEdit,
  onDelete,
  onViewTreatments,
  formatFecha,
  isAdmin = false, // Nueva prop para identificar si es admin
  doctores = [], // Lista de doctores para el filtro
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState([]);

  const formatNombreCompleto = (nombre, apellido) => {
    return `${nombre || ""} ${apellido || ""}`.trim();
  };
  // Filtrar pacientes basado en búsqueda y selección de doctor
  useEffect(() => {
    let result = [...pacientes];

    // Filtrar por doctor si está seleccionado y es admin
    if (isAdmin && selectedDoctor) {
      result = result.filter((paciente) => paciente.doctorId == selectedDoctor);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (paciente) =>
          (paciente.nombre || "").toLowerCase().includes(term) ||
          (paciente.apellido || "").toLowerCase().includes(term) ||
          (paciente.telefono || "").toLowerCase().includes(term) ||
          (paciente.email || "").toLowerCase().includes(term)
      );
    }

    setFilteredPacientes(result);
  }, [pacientes, searchTerm, selectedDoctor, isAdmin]);

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
        confirmButton: "px-4 py-2 rounded-md hover:bg-teal-700 transition",
        cancelButton: "px-4 py-2 rounded-md hover:bg-gray-300 transition",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El paciente ha sido eliminado correctamente.",
          icon: "success",
          confirmButtonColor: "#0d9488",
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
              {formatNombreCompleto(row.nombre, row.apellido)}
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
            placeholder="Buscar pacientes..."
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

      {/* Tabla de pacientes */}
      {filteredPacientes.length === 0 ? (
        <EmptyState
          icon={<FiUser size={48} />}
          title={
            searchTerm || selectedDoctor
              ? "No se encontraron resultados"
              : "No hay pacientes registrados"
          }
        />
      ) : (
        <Table data={filteredPacientes} columns={columns} isAdmin={isAdmin} />
      )}
    </div>
  );
}
