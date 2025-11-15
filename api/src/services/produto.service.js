const prisma = require("../prismaClient.js");

const getAllProdutos = () => {
  return prisma.produto.findMany({
    where: { removido: false },
  });
};

const getProdutoByID = (id) => {
  return prisma.produto.findFirst({
    where: { id: id, removido: false },
  });
};

const createProduto = (produtoData) => {
  return prisma.produto.create({
    data: produtoData,
  });
};

const updateProduto = (id, produtoData) => {
  return prisma.produto.update({
    where: { id: id },
    data: produtoData,
  });
};

const deleteProduto = (id) => {
  return prisma.produto.update({
    where: { id: id },
    data: { removido: true },
  });
};

module.exports = {
  getAllProdutos,
  getProdutoByID,
  createProduto,
  updateProduto,
  deleteProduto,
};
