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
      className={`${
        open
          ? isMobile
            ? "w-64 fixed inset-y-0 left-0 z-40"
            : "w-64"
          : isMobile
          ? "w-0 -translate-x-full"
          : "w-20"
      } bg-teal-800 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-teal-700">
        {open ? (
          <h1 className="text-xl font-bold">San Jorge</h1>
        ) : (
          <div className="w-8 h-8 bg-teal-700 rounded-full"></div>
        )}
        <button onClick={onToggle} className="p-1 rounded-lg hover:bg-teal-700">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="p-4 flex items-center gap-3 border-b border-teal-700">
        <div className="bg-teal-600 rounded-full p-2">
          <FiUser size={20} />
        </div>
        {open && (
          <div>
            <p className="font-medium">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-teal-200">{user?.especialidad}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <button
          onClick={() => onSectionChange("pacientes")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
            currentSection === "pacientes" ? "bg-teal-700" : "hover:bg-teal-700"
          }`}
        >
          <FiHome size={20} />
          {open && <span>Pacientes</span>}
        </button>

        <button
          onClick={() => onSectionChange("citas")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
            currentSection === "citas" ? "bg-teal-700" : "hover:bg-teal-700"
          }`}
        >
          <FiClock size={20} />
          {open && <span>Citas</span>}
        </button>

        <button
          onClick={() => onSectionChange("pagos")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
            currentSection === "pagos" ? "bg-teal-700" : "hover:bg-teal-700"
          }`}
        >
          <FaRegMoneyBillAlt size={20} />
          {open && <span>Pagos</span>}
        </button>

        {/* Botón "Nuevo Paciente" siempre visible */}
        <button
          onClick={onAddPatient}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-700 mb-2 transition-colors"
        >
          <FiPlus size={20} />
          {open && <span>Nuevo Paciente</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-teal-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-teal-200 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-teal-700"
        >
          <FiLogOut size={20} />
          {open && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
}
