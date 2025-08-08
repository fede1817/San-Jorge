const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Login odontólogo
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM odontologos_unificados WHERE email = $1",
    [email]
  );
  const odontologo = result.rows[0];

  if (!odontologo)
    return res.status(401).json({ mensaje: "Credenciales inválidas" });

  const passwordOk = await bcrypt.compare(password, odontologo.password_hash);
  if (!passwordOk)
    return res.status(401).json({ mensaje: "Contraseña incorrecta" });

  // 🟢 Incluir especialidad como rol
  const token = jwt.sign(
    { id: odontologo.id, rol: odontologo.especialidad }, // 👈 AQUÍ se incluye el "rol"
    "secreto_super_seguro",
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: {
      nombre: odontologo.nombre,
      apellido: odontologo.apellido,
      especialidad: odontologo.especialidad,
      email: odontologo.email,
      matricula: odontologo.matricula,
    },
  });
});

// Registro odontólogo
router.post("/register", async (req, res) => {
  const { nombre, apellido, email, password, matricula, especialidad } =
    req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO odontologos_unificados 
      (nombre, apellido, email, password_hash, matricula, especialidad)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [nombre, apellido, email, hash, matricula, especialidad]
  );

  res.status(201).json({ mensaje: "Odontólogo registrado correctamente" });
});

module.exports = router;
