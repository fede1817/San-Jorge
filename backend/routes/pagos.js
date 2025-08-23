const express = require("express");
const pool = require("../db");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/pagos - Obtener todos los pagos
router.get("/", verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        pt.nombre AS paciente_nombre,
        pt.apellido AS paciente_apellido,
        pt.telefono AS paciente_telefono
      FROM pagos p
      JOIN pacientes pt ON p.paciente_id = pt.id
      ORDER BY p.fecha DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/pagos/conceptos - Obtener conceptos de pago
router.get("/conceptos", verificarToken, async (req, res) => {
  try {
    const query =
      "SELECT * FROM conceptos_pago WHERE activo = true ORDER BY nombre";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener conceptos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/pagos - Crear nuevo pago
router.post("/", verificarToken, async (req, res) => {
  const { paciente_id, detalles, metodo_pago, notas } = req.body;
  const usuario_id = req.odontologoId;

  try {
    await pool.query("BEGIN");

    // Calcular monto total
    const montoTotal = detalles.reduce((sum, item) => {
      return (
        sum + (item.precio_unitario * item.cantidad - (item.descuento || 0))
      );
    }, 0);

    // Insertar pago principal
    const pagoResult = await pool.query(
      `INSERT INTO pagos 
       (paciente_id, monto_total, metodo_pago, notas, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [paciente_id, montoTotal, metodo_pago, notas, "completado"]
    );

    const pagoId = pagoResult.rows[0].id;

    // Insertar detalles
    for (const detalle of detalles) {
      await pool.query(
        `INSERT INTO detalles_pago 
         (pago_id, concepto_id, cantidad, precio_unitario, descuento)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          pagoId,
          detalle.concepto_id,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.descuento || 0,
        ]
      );
    }

    await pool.query("COMMIT");

    res.status(201).json({
      mensaje: "Pago registrado correctamente",
      pagoId,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al registrar pago:", error);
    res.status(500).json({ error: "Error al registrar pago" });
  }
});

// DELETE /api/pagos/:id - Eliminar pago
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("BEGIN");

    // Primero eliminar detalles
    await pool.query("DELETE FROM detalles_pago WHERE pago_id = $1", [id]);

    // Luego eliminar el pago
    await pool.query("DELETE FROM pagos WHERE id = $1", [id]);

    await pool.query("COMMIT");

    res.json({ mensaje: "Pago eliminado correctamente" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al eliminar pago:", error);
    res.status(500).json({ error: "Error al eliminar pago" });
  }
});

module.exports = router;
