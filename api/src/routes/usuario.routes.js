const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.post("/login", usuarioController.loginUsuario);
router.get("/me", authMiddleware, usuarioController.getMe);
router.get("/", usuarioController.getAllUsuarios);
router.get("/:id", usuarioController.getUsuarioByID);
router.post("/", usuarioController.createUsuario);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
