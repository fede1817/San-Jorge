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
    COALESCE(
      json_agg(
        jsonb_build_object(
          'id', t.id,
          'fecha', t.fecha,
          'diagnostico', t.diagnostico,
          'procedimiento', t.procedimiento,
          'observaciones', t.observaciones,
          'estado', t.estado,
          'proxima_consulta', t.proxima_consulta
        )
      ) FILTER (WHERE t.id IS NOT NULL), '[]'
    ) AS tratamientos
  FROM pacientes p
  LEFT JOIN tratamientos t ON p.id = t.paciente_id
  WHERE p.odontologo_id = $1
  GROUP BY p.id, p.nombre, p.apellido, p.telefono
  ORDER BY MIN(t.proxima_consulta) ASC
  `,
    [odontologoId]
  );

  res.json(result.rows);
});

// Crear paciente
router.post("/", verificarToken, async (req, res) => {
  const odontologoId = req.odontologoId;
  const { nombre, apellido, telefono } = req.body;

  await pool.query(
    "INSERT INTO pacientes (nombre, apellido, telefono, odontologo_id) VALUES ($1, $2, $3, $4)",
    [nombre, apellido, telefono, odontologoId]
  );

  res.status(201).json({ mensaje: "Paciente creado" });
});

// Actualizar paciente
router.put("/:id", verificarToken, async (req, res) => {
  const { nombre, apellido, telefono } = req.body;
  const { id } = req.params;

  await pool.query(
    "UPDATE pacientes SET nombre=$1, apellido=$2, telefono=$3 WHERE id=$4",
    [nombre, apellido, telefono, id]
  );

  res.json({ mensaje: "Paciente actualizado" });
});

// Eliminar paciente
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tratamientos WHERE paciente_id = $1", [id]);
  await pool.query("DELETE FROM pacientes WHERE id = $1", [id]);
  res.json({ mensaje: "Paciente eliminado" });
});

// Agregar tratamiento a un paciente
router.post("/:id/tratamiento", verificarToken, async (req, res) => {
  const pacienteId = req.params.id;
  const odontologoId = req.odontologoId;
  const {
    fecha,
    diagnostico,
    procedimiento,
    observaciones,
    estado,
    proxima_consulta,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO tratamientos 
        (paciente_id, odontologo_id, fecha, diagnostico, procedimiento, observaciones, estado, proxima_consulta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        pacienteId,
        odontologoId,
        fecha,
        diagnostico,
        procedimiento,
        observaciones,
        estado,
        proxima_consulta,
      ]
    );

    res.status(201).json({ mensaje: "Tratamiento guardado" });
  } catch (error) {
    console.error("Error al guardar tratamiento:", error);
    res.status(500).json({ mensaje: "Error al guardar tratamiento" });
  }
});

module.exports = router;
