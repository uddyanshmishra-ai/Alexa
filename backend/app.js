const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/commandRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/commands", commandRoutes);
app.use("/api/preferences", preferencesRoutes);

module.exports = app;
