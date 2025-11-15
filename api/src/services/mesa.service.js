const prisma = require("../prismaClient.js");

const getAllMesas = () => {
  return prisma.mesa.findMany({
    where: { removido: false },
  });
};

const getMesaByID = (id) => {
  return prisma.mesa.findFirst({
    where: { id: id, removido: false },
  });
};

const createMesa = (mesaData) => {
  return prisma.mesa.create({
    data: mesaData,
  });
};

const updateMesa = (id, mesaData) => {
  return prisma.mesa.update({
    where: { id: id },
    data: mesaData,
  });
};

const deleteMesa = (id) => {
  return prisma.mesa.update({
    where: { id: id },
    data: { removido: true },
  });
};

module.exports = {
  getAllMesas,
  getMesaByID,
  createMesa,
  updateMesa,
  deleteMesa,
};
