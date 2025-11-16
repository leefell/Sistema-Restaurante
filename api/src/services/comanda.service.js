const prisma = require("../prismaClient.js");

// Puxa todas comandas do sistema que não foram removidas
const getAllComandas = () => {
  return prisma.comanda.findMany({
    where: { removido: false },
    include: {
      mesa: true, // Include the related Mesa
      produtos: {
        include: {
          produto: true, // Include the related Produto in Comanda_Produto
        },
      },
    },
    orderBy: {
      dataAbertura: 'desc', // Show newest first
    }
  });
};

// Puxa todas comandas associadas a uma mesa específica que não foram removidas
const getAllComandasPorMesa = (mesaId) => {
  return prisma.comanda.findMany({
    where: { mesaId: mesaId, removido: false },
  });
};

const getComandasAbertas = () => {
  return prisma.comanda.findMany({
    where: { status: "ABERTA", removido: false },
  });
};

const getComandasFechadas = () => {
  return prisma.comanda.findMany({
    where: { status: "FECHADA", removido: false },
  });
};

const getComandasPagas = () => {
  return prisma.comanda.findMany({
    where: { status: "PAGA", removido: false },
  });
};

const getComandaByID = (id) => {
  return prisma.comanda.findFirst({
    where: { id: id, removido: false },
    include: {
      mesa: true,
      produtos: {
        include: {
          produto: true,
        },
      },
    },
  });
};

const createComanda = async (comandaData) => {
  return prisma.comanda.create({
    data: comandaData,
  });
};

const updateComanda = (id, comandaData) => {
  return prisma.comanda.update({
    where: { id: id },
    data: comandaData,
  });
};

const deleteComanda = (id) => {
  return prisma.comanda.update({
    where: { id: id },
    data: { removido: true },
  });
};

module.exports = {
  getAllComandas,
  getAllComandasPorMesa,
  getComandasAbertas,
  getComandasFechadas,
  getComandasPagas,
  getComandaByID,
  createComanda,
  updateComanda,
  deleteComanda,
};
