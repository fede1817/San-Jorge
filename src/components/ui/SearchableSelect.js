import { useState, useRef, useEffect } from "react";

function SearchableSelect({ pacientes, value, onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filtrar pacientes según el término de búsqueda
  const filteredPacientes = pacientes.filter((paciente) =>
    `${paciente.nombre} ${paciente.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obtener el nombre del paciente seleccionado
  const selectedPaciente = pacientes.find((p) => p.id === value);

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <label className="block text-gray-700 text-sm font-medium mb-1">
        Paciente *
      </label>

      {/* Input de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={
            isOpen
              ? searchTerm
              : selectedPaciente
              ? `${selectedPaciente.nombre} ${selectedPaciente.apellido}`
              : ""
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Lista desplegable */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredPacientes.length > 0 ? (
            filteredPacientes.map((paciente) => (
              <div
                key={paciente.id}
                className={`p-2 hover:bg-blue-50 cursor-pointer ${
                  value === paciente.id ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  onChange(paciente.id);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
              >
                <div className="font-medium">
                  {paciente.nombre} {paciente.apellido}
                </div>
                <div className="text-sm text-gray-600">{paciente.telefono}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No se encontraron pacientes</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
