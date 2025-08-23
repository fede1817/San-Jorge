const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const pacientesRoutes = require("./routes/pacientes");
const pagosRoutes = require("./routes/pagos");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/login", authRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/pagos", pagosRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
