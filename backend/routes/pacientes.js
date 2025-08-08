const express = require("express");
const pool = require("../db");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

// Obtener pacientes (todos si es admin, propios si no)
router.get("/", verificarToken, async (req, res) => {
  const odontologoId = req.odontologoId;
  const rol = req.rol;

  try {
    let result;

    if (rol === "Administrador") {
      // Admin: ver todos los pacientes con info del doctor
      result = await pool.query(`
        SELECT 
          p.id, p.nombre, p.apellido, p.telefono, p.email,
          o.id as doctorId, 
          CONCAT(o.nombre, ' ', o.apellido) as doctorNombre,
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
        LEFT JOIN odontologos_unificados o ON p.odontologo_id = o.id
        LEFT JOIN tratamientos t ON p.id = t.paciente_id
        GROUP BY p.id, p.nombre, p.apellido, p.telefono, p.email, o.id
        ORDER BY MIN(t.proxima_consulta) ASC
      `);
    } else {
      // Odontólogo: ver solo sus pacientes
      result = await pool.query(
        `
        SELECT 
          p.id, p.nombre, p.apellido, p.telefono, p.email,
          o.id as doctorId, 
          CONCAT(o.nombre, ' ', o.apellido) as doctorNombre,
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
        LEFT JOIN odontologos_unificados o ON p.odontologo_id = o.id
        LEFT JOIN tratamientos t ON p.id = t.paciente_id
        WHERE p.odontologo_id = $1
        GROUP BY p.id, p.nombre, p.apellido, p.telefono, p.email, o.id
        ORDER BY MIN(t.proxima_consulta) ASC
      `,
        [odontologoId]
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).json({ mensaje: "Error al obtener pacientes" });
  }
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

// Ver próximas citas (todas si admin, propias si no)
router.get("/proximas", verificarToken, async (req, res) => {
  const odontologoId = req.odontologoId;
  const rol = req.rol;

  try {
    let result;

    if (rol === "Administrador") {
      result = await pool.query(`
        SELECT 
          t.*,
          p.nombre AS paciente_nombre,
          p.telefono
        FROM tratamientos t
        JOIN pacientes p ON t.paciente_id = p.id
        WHERE t.fecha >= CURRENT_DATE
        ORDER BY 
          CASE WHEN t.estado = 'programado' THEN 1 ELSE 2 END,
          t.fecha, 
          t.hora
      `);
    } else {
      result = await pool.query(
        `
        SELECT 
          t.*,
          p.nombre AS paciente_nombre,
          p.telefono
        FROM tratamientos t
        JOIN pacientes p ON t.paciente_id = p.id
        WHERE t.fecha >= CURRENT_DATE
        AND t.odontologo_id = $1
        ORDER BY 
          CASE WHEN t.estado = 'programado' THEN 1 ELSE 2 END,
          t.fecha, 
          t.hora
      `,
        [odontologoId]
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener próximas citas:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cambiar estado de tratamiento
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tratamientos SET estado = $1 WHERE id = $2 RETURNING *`,
      [estado, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar paciente y sus tratamientos
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tratamientos WHERE paciente_id = $1", [id]);
  await pool.query("DELETE FROM pacientes WHERE id = $1", [id]);
  res.json({ mensaje: "Paciente eliminado" });
});

// Ver tratamientos de un paciente
router.get("/:id/tratamiento", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM tratamientos WHERE paciente_id = $1 ORDER BY fecha DESC",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tratamientos:", error);
    res.status(500).json({ mensaje: "Error al obtener tratamientos" });
  }
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
    hora,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO tratamientos 
        (paciente_id, odontologo_id, fecha, diagnostico, procedimiento, observaciones, estado, proxima_consulta, hora)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        pacienteId,
        odontologoId,
        fecha,
        diagnostico,
        procedimiento,
        observaciones,
        estado,
        proxima_consulta,
        hora,
      ]
    );

    res.status(201).json({ mensaje: "Tratamiento guardado" });
  } catch (error) {
    console.error("Error al guardar tratamiento:", error);
    res.status(500).json({ mensaje: "Error al guardar tratamiento" });
  }
});

// Cancelar tratamiento
router.put("/:id/cancelar", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tratamientos 
       SET estado = 'cancelado' 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
