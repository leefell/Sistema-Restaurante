const produtoService = require("../services/produto.service");

const getAllProdutos = async (req, res) => {
  try {
    const produtos = await produtoService.getAllProdutos();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};

const getProdutoByID = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await produtoService.getProdutoByID(parseInt(id));
    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ error: "Produto não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
};

const createProduto = async (req, res) => {
  const produtoData = req.body;
  try {
    const newProduto = await produtoService.createProduto(produtoData);
    res.status(201).json(newProduto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto." });
  }
};

const updateProduto = async (req, res) => {
  const { id } = req.params;
  const produtoData = req.body;
  try {
    const updatedProduto = await produtoService.updateProduto(
      parseInt(id),
      produtoData
    );
    res.status(200).json(updatedProduto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};

const deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduto = await produtoService.deleteProduto(parseInt(id));
    res.status(200).json(deletedProduto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
};

module.exports = {
  getAllProdutos,
  getProdutoByID,
  createProduto,
  updateProduto,
  deleteProduto,
};
