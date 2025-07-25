const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Login odontólogo
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query(
    "SELECT * FROM odontologos WHERE email = $1",
    [email]
  );
  const odontologo = result.rows[0];

  if (!odontologo)
    return res.status(401).json({ mensaje: "Credenciales inválidas" });

  const passwordOk = await bcrypt.compare(password, odontologo.password_hash);
  if (!passwordOk)
    return res.status(401).json({ mensaje: "Contraseña incorrecta" });

  const token = jwt.sign({ id: odontologo.id }, "secreto_super_seguro", {
    expiresIn: "8h",
  });
  res.json({ token });
});

// Registro (opcional)
router.post("/register", async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO odontologos (nombre, apellido, email, password_hash) VALUES ($1, $2, $3, $4)",
    [nombre, apellido, email, hash]
  );
  res.status(201).json({ mensaje: "Odontólogo registrado" });
});

module.exports = router;
