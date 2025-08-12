import { useState, useRef, useEffect } from "react";

function DoctorSelect({
  doctores,
  value,
  onChange,
  showLabel = true, // Nuevo prop para controlar el label
  labelText = "Filtrar por Doctor", // Texto customizable
  placeholder = "Buscar doctor...", // Placeholder customizable
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filtrar doctores según el término de búsqueda
  const filteredDoctores = doctores.filter((doctor) =>
    doctor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Obtener el doctor seleccionado
  const selectedDoctor = doctores.find((d) => d.id == value);

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      {showLabel && (
        <label className="block text-gray-700 text-sm font-medium mb-1">
          {labelText}
        </label>
      )}

      {/* Input de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={
            isOpen
              ? searchTerm
              : selectedDoctor
              ? selectedDoctor.nombre
              : "Seleccionar doctor"
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div
            className={`p-2 hover:bg-blue-50 cursor-pointer ${
              !value ? "bg-blue-100" : ""
            }`}
            onClick={() => {
              onChange(null);
              setSearchTerm("");
              setIsOpen(false);
            }}
          >
            {showLabel ? "Todos los doctores" : "Seleccionar doctor"}
          </div>

          {filteredDoctores.length > 0 ? (
            filteredDoctores.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-2 hover:bg-blue-50 cursor-pointer ${
                  value == doctor.id ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  onChange(doctor.id);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
              >
                <div className="font-medium">{doctor.nombre}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No se encontraron doctores</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DoctorSelect;
