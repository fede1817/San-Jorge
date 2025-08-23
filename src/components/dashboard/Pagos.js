import React, { useState, useEffect } from "react";
import { FiDollarSign, FiPlus, FiEye, FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import Modal from "../ui/Modal";
import Table from "./Table";
import NuevoPagoModal from "../modals/NuevoPagoModal";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNuevoPagoModal, setShowNuevoPagoModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/pagos/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar pagos");
      const data = await res.json();
      setPagos(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPago = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este pago?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/pagos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar pago");

      toast.success("Pago eliminado correctamente");
      fetchPagos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      header: "Paciente",
      render: (row) => (
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.paciente_nombre} {row.paciente_apellido}
            </div>
            <div className="text-xs text-gray-500">{row.paciente_telefono}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Fecha",
      accessor: "fecha",
      render: (fecha) => new Date(fecha).toLocaleDateString("es-ES"),
    },
    {
      header: "Monto",
      accessor: "monto_total",
      render: (monto) => (
        <span className="font-semibold">${parseFloat(monto).toFixed(2)}</span>
      ),
    },
    {
      header: "Método",
      accessor: "metodo_pago",
      render: (metodo) => <span className="capitalize">{metodo}</span>,
    },
    {
      header: "Estado",
      accessor: "estado",
      render: (estado) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            estado === "completado"
              ? "bg-green-100 text-green-800"
              : estado === "pendiente"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {estado}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setPagoSeleccionado(row)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Ver detalles"
          >
            <FiEye />
          </button>
          <button
            onClick={() => handleEliminarPago(row.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiDollarSign className="mr-2" /> Gestión de Pagos
        </h1>
        <button
          onClick={() => setShowNuevoPagoModal(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <FiPlus className="mr-2" /> Nuevo Pago
        </button>
      </div>

      {pagos.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No hay pagos registrados
          </h2>
          <p className="text-gray-600 mb-4">
            Comienza registrando tu primer pago
          </p>
          <button
            onClick={() => setShowNuevoPagoModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Registrar Primer Pago
          </button>
        </div>
      ) : (
        <Table data={pagos} columns={columns} />
      )}

      {/* Modal para nuevo pago */}
      <NuevoPagoModal
        isOpen={showNuevoPagoModal}
        onClose={() => setShowNuevoPagoModal(false)}
        onSave={() => {
          fetchPagos();
          setShowNuevoPagoModal(false);
        }}
      />

      {/* Modal para ver detalles del pago */}
      {pagoSeleccionado && (
        <Modal
          isOpen={!!pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
          title={`Detalles del Pago - ${pagoSeleccionado.paciente_nombre}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Paciente:</label>
                <p>
                  {pagoSeleccionado.paciente_nombre}{" "}
                  {pagoSeleccionado.paciente_apellido}
                </p>
              </div>
              <div>
                <label className="font-semibold">Fecha:</label>
                <p>
                  {new Date(pagoSeleccionado.fecha).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div>
                <label className="font-semibold">Monto Total:</label>
                <p className="text-green-600 font-bold">
                  ${parseFloat(pagoSeleccionado.monto_total).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="font-semibold">Método:</label>
                <p className="capitalize">{pagoSeleccionado.metodo_pago}</p>
              </div>
              <div>
                <label className="font-semibold">Estado:</label>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    pagoSeleccionado.estado === "completado"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {pagoSeleccionado.estado}
                </span>
              </div>
            </div>

            {pagoSeleccionado.notas && (
              <div>
                <label className="font-semibold">Notas:</label>
                <p className="text-gray-600">{pagoSeleccionado.notas}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Pagos;
