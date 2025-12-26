const express = require("express");
const router = express.Router();
const controller = require("../controllers/preferencesController");

router.post("/", controller.createPreferences);
router.get("/", controller.getPreferences);
router.put("/:id", controller.updatePreferences);

module.exports = router;
