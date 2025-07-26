const express = require("express");
const pool = require("../db");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

// Obtener pacientes del odontólogo autenticado
router.get("/", verificarToken, async (req, res) => {
  const odontologoId = req.odontologoId;

  const result = await pool.query(
    `
    SELECT 
      p.id, p.nombre, p.apellido, p.telefono,
      t.procedimiento, t.proxima_consulta
    FROM pacientes p
    LEFT JOIN tratamientos t ON p.id = t.paciente_id
    WHERE p.odontologo_id = $1
    ORDER BY t.proxima_consulta ASC
  `,
    [odontologoId]
  );

  res.json(result.rows);
});

module.exports = router;

router.post("/", verificarToken, async (req, res) => {
  const odontologoId = req.odontologoId;
  const { nombre, apellido, telefono } = req.body;

  await pool.query(
    "INSERT INTO pacientes (nombre, apellido, telefono, odontologo_id) VALUES ($1, $2, $3, $4)",
    [nombre, apellido, telefono, odontologoId]
  );

  res.status(201).json({ mensaje: "Paciente creado" });
});

router.put("/:id", verificarToken, async (req, res) => {
  const { nombre, apellido, telefono } = req.body;
  const { id } = req.params;

  await pool.query(
    "UPDATE pacientes SET nombre=$1, apellido=$2, telefono=$3 WHERE id=$4",
    [nombre, apellido, telefono, id]
  );

  res.json({ mensaje: "Paciente actualizado" });
});

router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM pacientes WHERE id=$1", [id]);
  res.json({ mensaje: "Paciente eliminado" });
});
