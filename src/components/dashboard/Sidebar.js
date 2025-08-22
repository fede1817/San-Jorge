import {
  FiPlus,
  FiUser,
  FiMenu,
  FiLogOut,
  FiHome,
  FiClock,
  FiX,
} from "react-icons/fi";
import { FaRegMoneyBillAlt } from "react-icons/fa";

export default function Sidebar({
  open,
  user,
  currentSection, // 'pacientes', 'citas', 'pagos'
  onToggle,
  onSectionChange,
  onAddPatient,
  onLogout,
  isMobile = false,
}) {
  return (
    <div
      className={`bg-teal-800 text-white flex flex-col duration-300
    ${
      isMobile
        ? `fixed inset-y-0 left-0 z-40 transform transition-transform ${
            open ? "translate-x-0 w-64" : "-translate-x-full w-64"
          }`
        : `transition-[width] ${open ? "w-64" : "w-20"}`
    }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-teal-700">
        <div className="flex items-center gap-2 overflow-hidden">
          {open ? (
            <h1 className="text-xl font-bold whitespace-nowrap transition-opacity duration-200">
              San Jorge
            </h1>
          ) : (
            <div className="w-8 h-8 bg-teal-700 rounded-full"></div>
          )}
        </div>
        <button onClick={onToggle} className="p-1 rounded-lg hover:bg-teal-700">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* User */}
      <div className="p-4 flex items-center gap-3 border-b border-teal-700">
        <div className="bg-teal-600 rounded-full p-2">
          <FiUser size={20} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
          }`}
        >
          <p className="font-medium">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-xs text-teal-200">{user?.especialidad}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {[
          { key: "pacientes", label: "Pacientes", icon: <FiHome size={20} /> },
          { key: "citas", label: "Citas", icon: <FiClock size={20} /> },
          {
            key: "pagos",
            label: "Pagos",
            icon: <FaRegMoneyBillAlt size={20} />,
          },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => onSectionChange(item.key)}
            className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors ${
              currentSection === item.key ? "bg-teal-700" : "hover:bg-teal-700"
            }`}
          >
            {item.icon}
            <span
              className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}

        {/* Nuevo Paciente */}
        <button
          onClick={onAddPatient}
          className="w-full flex items-center p-3 rounded-lg hover:bg-teal-700 mb-2 transition-colors"
        >
          <FiPlus size={20} />
          <span
            className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
            }`}
          >
            Nuevo Paciente
          </span>
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-teal-700">
        <button
          onClick={onLogout}
          className="flex items-center text-teal-200 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-teal-700"
        >
          <FiLogOut size={20} />
          <span
            className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
              open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
            }`}
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </div>
  );
}
