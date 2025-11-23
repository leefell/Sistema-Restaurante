const express = require("express");
const router = express.Router();
const mesaController = require("../controllers/mesa.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.use(authMiddleware);

router.get("/", mesaController.getAllMesas);
router.get("/:id", mesaController.getMesaByID);
router.post("/", mesaController.createMesa);
router.put("/:id", mesaController.updateMesa);
router.delete("/:id", mesaController.deleteMesa);

module.exports = router;