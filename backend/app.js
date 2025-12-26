const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/commandRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");
const llmRoutes = require("./routes/llmRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/commands", commandRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/llm", llmRoutes);

module.exports = app;
