import { useState, useEffect } from "react";

export default function Table({
  data,
  columns,
  itemsPerPage = 10,
  isAdmin = false,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calcular el total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Obtener los datos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Función para cambiar de página
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Modificar las columnas para agregar la columna de doctor si es admin
  const modifiedColumns = isAdmin
    ? [
        ...columns.slice(0, 1), // Primera columna (Paciente)
        {
          header: "Doctor",
          render: (row) => (
            <div className="text-sm text-gray-900">
              {row.doctorNombre || "Sin asignar"}
            </div>
          ),
        },
        ...columns.slice(1), // Resto de columnas
      ]
    : columns;

  // Vista para móviles - Tarjetas
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {currentData.map((row, rowIndex) => (
        <div key={rowIndex} className="bg-white rounded-lg shadow-md p-4">
          <div className="space-y-3">
            {modifiedColumns.map((column, colIndex) => (
              <div key={colIndex} className="flex justify-between items-start">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {column.header}:
                </span>
                <div className="text-right text-sm text-gray-900 max-w-xs overflow-hidden">
                  {column.render
                    ? column.render(row[column.accessor] || row, row)
                    : column.format
                    ? column.format(row[column.accessor])
                    : row[column.accessor]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Vista para escritorio - Tabla tradicional
  const DesktopView = () => (
    <div className="hidden md:block bg-white rounded-xl shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {modifiedColumns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {modifiedColumns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-4 whitespace-nowrap">
                  {column.render
                    ? column.render(row[column.accessor] || row, row)
                    : column.format
                    ? column.format(row[column.accessor])
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {/* Vista móvil */}
      <MobileView />

      {/* Vista escritorio */}
      <DesktopView />

      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 mt-4">
        <div className="text-sm text-gray-500 mb-2 sm:mb-0">
          Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de{" "}
          {data.length} registros
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            «
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            ‹
          </button>

          {/* Mostrar números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-2 py-1 rounded-md text-sm ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
