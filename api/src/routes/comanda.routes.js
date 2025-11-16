const express = require("express");
const router = express.Router();
const comandaController = require("../controllers/comanda.controller.js");

router.get("/", comandaController.getAllComandas);
router.get("/mesa/:mesaId", comandaController.getAllComandasPorMesa);
router.get("/abertas", comandaController.getComandasAbertas);
router.get("/fechadas", comandaController.getComandasFechadas);
router.get("/pagas", comandaController.getComandasPagas);
router.get("/:id", comandaController.getComandaByID);
router.post("/", comandaController.createComanda);
router.put("/:id", comandaController.updateComanda);
router.delete("/:id", comandaController.deleteComanda);

module.exports = router;
