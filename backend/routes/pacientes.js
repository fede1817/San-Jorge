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
