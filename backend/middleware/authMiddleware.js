const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res.status(401).json({ mensaje: "Token no proporcionado" });

  jwt.verify(token, "secreto_super_seguro", (err, decoded) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido" });
    req.odontologoId = decoded.id;
    next();
  });
}

module.exports = verificarToken;
