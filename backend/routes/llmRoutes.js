const express = require("express");
const router = express.Router();
const controller = require("../controllers/llmController");

router.post("/invoke", controller.invokeLLM);

module.exports = router;
