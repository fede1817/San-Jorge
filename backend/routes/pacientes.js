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
    o.id as "doctorId", 
    CONCAT(o.nombre, ' ', o.apellido) as "doctorNombre",
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

router.get("/doctores", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        CONCAT(nombre, ' ', apellido) as nombre,
        especialidad,
        email,
        matricula
      FROM odontologos_unificados
      ORDER BY nombre ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    res.status(500).json({ mensaje: "Error al obtener doctores" });
  }
});
// Crear paciente
// Crear paciente (POST)
router.post("/", verificarToken, async (req, res) => {
  const odontologoId = req.odontologoId;
  const rol = req.rol;
  const { nombre, apellido, telefono, email, odontologo_id } = req.body;

  // Determinar el odontólogo asignado
  const odontologoAsignado =
    rol === "Administrador" && odontologo_id ? odontologo_id : odontologoId;

  try {
    await pool.query(
      "INSERT INTO pacientes (nombre, apellido, telefono, email, odontologo_id) VALUES ($1, $2, $3, $4, $5)",
      [nombre, apellido, telefono, email, odontologoAsignado]
    );

    res.status(201).json({ mensaje: "Paciente creado" });
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({ mensaje: "Error al crear paciente" });
  }
});

// Actualizar paciente (PUT)
router.put("/:id", verificarToken, async (req, res) => {
  const rol = req.rol;
  const { nombre, apellido, telefono, email, odontologo_id } = req.body;
  const { id } = req.params;

  try {
    if (rol === "Administrador") {
      // Admin puede cambiar el doctor asignado
      await pool.query(
        "UPDATE pacientes SET nombre=$1, apellido=$2, telefono=$3, email=$4, odontologo_id=$5 WHERE id=$6",
        [nombre, apellido, telefono, email, odontologo_id, id]
      );
    } else {
      // Odontólogo normal solo puede actualizar datos básicos
      await pool.query(
        "UPDATE pacientes SET nombre=$1, apellido=$2, telefono=$3, email=$4 WHERE id=$5",
        [nombre, apellido, telefono, email, id]
      );
    }

    res.json({ mensaje: "Paciente actualizado" });
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    res.status(500).json({ mensaje: "Error al actualizar paciente" });
  }
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
          p.apellido AS paciente_apellido,
          p.telefono,
          o.id AS odontologo_id,
          CONCAT(o.nombre, ' ', o.apellido) AS odontologo_nombre
        FROM tratamientos t
        JOIN pacientes p ON t.paciente_id = p.id
        LEFT JOIN odontologos_unificados o ON t.odontologo_id = o.id
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
          p.apellido AS paciente_apellido,
          p.telefono,
          o.id AS odontologo_id,
          CONCAT(o.nombre, ' ', o.apellido) AS odontologo_nombre
        FROM tratamientos t
        JOIN pacientes p ON t.paciente_id = p.id
        LEFT JOIN odontologos_unificados o ON t.odontologo_id = o.id
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
  const odontologoTokenId = req.odontologoId; // ID del token
  const rol = req.rol; // Obtenemos el rol del usuario
  const {
    fecha,
    diagnostico,
    procedimiento,
    observaciones,
    estado,
    proxima_consulta,
    hora,
    odontologo_id, // ID que viene del frontend (solo para admins)
  } = req.body;

  // Determinar qué odontólogo_id usar
  const odontologoAsignado =
    rol === "Administrador" && odontologo_id
      ? odontologo_id
      : odontologoTokenId;

  try {
    await pool.query(
      `INSERT INTO tratamientos 
        (paciente_id, odontologo_id, fecha, diagnostico, procedimiento, observaciones, estado, proxima_consulta, hora)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        pacienteId,
        odontologoAsignado, // Usamos el odontólogo determinado
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

router.delete("/citas/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const odontologoId = req.odontologoId;
  const rol = req.rol;

  try {
    // Verificar si la cita existe y pertenece al odontólogo (si no es admin)
    const citaExistente = await pool.query(
      "SELECT * FROM tratamientos WHERE id = $1",
      [id]
    );

    if (citaExistente.rows.length === 0) {
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    }

    const cita = citaExistente.rows[0];

    // Si no es admin, verificar que la cita pertenezca al odontólogo
    if (rol !== "Administrador" && cita.odontologo_id !== odontologoId) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    // Eliminar la cita
    await pool.query("DELETE FROM tratamientos WHERE id = $1", [id]);

    res.json({ mensaje: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    res.status(500).json({ mensaje: "Error al eliminar cita" });
  }
});

router.put("/citas/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, procedimiento, estado, odontologo_id } = req.body;
  const usuarioId = req.odontologoId;
  const rol = req.rol;

  try {
    // Verificar si la cita existe
    const citaExistente = await pool.query(
      "SELECT * FROM tratamientos WHERE id = $1",
      [id]
    );

    if (citaExistente.rows.length === 0) {
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    }

    const cita = citaExistente.rows[0];

    // Si no es admin, verificar que la cita pertenezca al odontólogo
    if (rol !== "Administrador" && cita.odontologo_id !== usuarioId) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    // Determinar el odontólogo_id a usar
    const odontologoIdFinal =
      rol === "Administrador" ? odontologo_id || cita.odontologo_id : usuarioId;

    // Actualizar la cita
    const result = await pool.query(
      `UPDATE tratamientos 
       SET fecha = $1, hora = $2, procedimiento = $3, estado = $4, odontologo_id = $5
       WHERE id = $6 
       RETURNING *`,
      [fecha, hora, procedimiento, estado, odontologoIdFinal, id]
    );

    res.json({
      mensaje: "Cita actualizada correctamente",
      cita: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ mensaje: "Error al actualizar cita" });
  }
});

module.exports = router;
