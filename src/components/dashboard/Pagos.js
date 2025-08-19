import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Pagos = ({ paciente }) => {
  const [conceptos, setConceptos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    const fetchConceptos = async () => {
      try {
        const res = await fetch("/api/pacientes/conceptos"); // Cambiado a /api/pagos/conceptos
        const data = await res.json();
        setConceptos(data);
      } catch (error) {
        toast.error("Error al cargar conceptos de pago");
      }
    };
    fetchConceptos();
  }, []);

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

  const aumentarCantidad = (index) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index].cantidad += 1;
    setDetalles(nuevosDetalles);
  };

  const disminuirCantidad = (index) => {
    const nuevosDetalles = [...detalles];
    if (nuevosDetalles[index].cantidad > 1) {
      nuevosDetalles[index].cantidad -= 1;
      setDetalles(nuevosDetalles);
    }
  };

  const eliminarConcepto = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  const handleGuardarPago = async () => {
    try {
      const res = await fetch("/api/pacientes/pagos", {
        // Cambiado a /api/pagos
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          paciente_id: paciente.id,
          detalles: detalles,
          metodo_pago: metodoPago,
          notas: notas,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || "Error al guardar pago");
      }

      toast.success("Pago registrado correctamente");
      setDetalles([]);
      setNotas("");
    } catch (error) {
      console.error("Error al registrar pago:", error);
      toast.error(error.message || "Ocurrió un error al registrar el pago");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FiDollarSign className="mr-2" /> Registro de Pagos
      </h2>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Conceptos disponibles:</h3>
        <div className="flex flex-wrap gap-2">
          {conceptos.map((concepto) => (
            <button
              key={concepto.id}
              onClick={() => agregarConcepto(concepto)}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              {concepto.nombre} (${concepto.precio_base})
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Detalles del pago:</h3>
        {detalles.length === 0 ? (
          <p className="text-gray-500">No hay conceptos agregados</p>
        ) : (
          <div className="space-y-2">
            {detalles.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-2">
                <div className="flex-1">
                  <p>{item.nombre}</p>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => disminuirCantidad(index)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="mx-2">{item.cantidad}</span>
                    <button
                      onClick={() => aumentarCantidad(index)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p>${(item.precio_unitario * item.cantidad).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => eliminarConcepto(index)}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  <FiTrash2 className="text-red-500" />
                </button>
              </div>
            ))}
            <div className="font-bold text-right mt-4">
              Total: $
              {detalles
                .reduce(
                  (sum, item) => sum + item.precio_unitario * item.cantidad,
                  0
                )
                .toFixed(2)}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Método de pago</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Notas</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full p-2 border rounded"
          rows="2"
        />
      </div>

      <button
        onClick={handleGuardarPago}
        disabled={detalles.length === 0}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
      >
        <FiSave className="mr-2" /> Registrar Pago
      </button>
    </div>
  );
};

export default Pagos;
