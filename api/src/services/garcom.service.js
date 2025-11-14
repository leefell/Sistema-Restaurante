const prisma = require("../prismaClient.js");
const bcrypt = require("bcrypt");

const getAllGarcom = () => {
  return prisma.garcom.findMany({
    where: { removido: false },
  });
};

const getGarcomByID = (id) => {
  return prisma.garcom.findFirst({
    where: { id: id, removido: false },
  });
};

/*
const getMesasByGarcomID = (id) => {
  return prisma.mesa.findMany({
    where: { garcomId: id },
  });
};
*/

const createGarcom = async (garcomData) => {
  return prisma.garcom.create({
    data: garcomData,
  });
};

const updateGarcom = async (id, garcomData) => {
  return prisma.garcom.update({
    where: { id: id },
    data: garcomData,
  });
};

const deleteGarcom = async (id) => {
  return prisma.garcom.update({
    where: { id: id },
    data: { removido: true },
  });
};

module.exports = {
  getAllGarcom,
  getGarcomByID,
  createGarcom,
  updateGarcom,
  deleteGarcom,
};
