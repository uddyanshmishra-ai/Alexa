const express = require("express");
const router = express.Router();
const controller = require("../controllers/commandController");

router.post("/", controller.createCommand);
router.get("/", controller.getCommands);
router.get("/:id", controller.getCommandById);
router.put("/:id", controller.updateCommand);
router.delete("/:id", controller.deleteCommand);

module.exports = router;
