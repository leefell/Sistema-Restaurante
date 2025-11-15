const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produto.controller.js");

router.get("/", produtoController.getAllProdutos);
router.get("/:id", produtoController.getProdutoByID);
router.post("/", produtoController.createProduto);
router.put("/:id", produtoController.updateProduto);
router.delete("/:id", produtoController.deleteProduto);

module.exports = router;
