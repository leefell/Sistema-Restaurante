const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produto.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.get("/", produtoController.getAllProdutos);
router.get("/:id", produtoController.getProdutoByID);
router.post("/", authMiddleware, produtoController.createProduto);
router.put("/:id", authMiddleware, produtoController.updateProduto);
router.delete("/:id", authMiddleware, produtoController.deleteProduto);

module.exports = router;
