import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const NuevoPagoModal = ({ isOpen, onClose, onSave }) => {
  const [pacientes, setPacientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [formData, setFormData] = useState({
    paciente_id: "",
    metodo_pago: "efectivo",
    notas: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchPacientes();
      fetchConceptos();
    }
  }, [isOpen]);

  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      toast.error("Error al cargar pacientes");
    }
  };

  const fetchConceptos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pagos/conceptos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      setConceptos(data);
    } catch (error) {
      toast.error("Error al cargar conceptos");
    }
  };

  const agregarConcepto = (concepto) => {
    setDetalles([
      ...detalles,
      {
        concepto_id: concepto.id,
        nombre: concepto.nombre,
        precio_unitario: concepto.precio_base,
        cantidad: 1,
        descuento: 0,
      },
    ]);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index].cantidad = nuevaCantidad;
    setDetalles(nuevosDetalles);
  };

  const eliminarConcepto = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paciente_id) {
      toast.error("Seleccione un paciente");
      return;
    }

    if (detalles.length === 0) {
      toast.error("Agregue al menos un concepto de pago");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paciente_id: formData.paciente_id,
          detalles: detalles,
          metodo_pago: formData.metodo_pago,
          notas: formData.notas,
        }),
      });

      if (!res.ok) throw new Error("Error al registrar pago");

      toast.success("Pago registrado correctamente");
      onSave();
      // Reset form
      setFormData({ paciente_id: "", metodo_pago: "efectivo", notas: "" });
      setDetalles([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const total = detalles.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Registrar Nuevo Pago</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paciente *
            </label>
            <select
              value={formData.paciente_id}
              onChange={(e) =>
                setFormData({ ...formData, paciente_id: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Seleccionar paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nombre} {paciente.apellido} - {paciente.telefono}
                </option>
              ))}
            </select>
          </div>

          {/* Conceptos de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conceptos de Pago *
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {conceptos.map((concepto) => (
                <button
                  key={concepto.id}
                  type="button"
                  onClick={() => agregarConcepto(concepto)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="font-medium">{concepto.nombre}</div>
                  <div className="text-sm text-gray-600">
                    ${concepto.precio_base}
                  </div>
                </button>
              ))}
            </div>

            {/* Detalles agregados */}
            {detalles.length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Detalles del pago</h4>
                {detalles.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.nombre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(index, item.cantidad - 1)
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(index, item.cantidad + 1)
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.precio_unitario * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarConcepto(index)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 mt-4 border-t">
                  <span className="font-bold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Método de Pago y Notas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={formData.metodo_pago}
                onChange={(e) =>
                  setFormData({ ...formData, metodo_pago: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Notas adicionales sobre el pago..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={detalles.length === 0 || !formData.paciente_id}
              className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              <FiSave className="mr-2" /> Registrar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPagoModal;
