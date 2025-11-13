const prisma = require("../prismaClient.js");
const bcrypt = require("bcrypt");

const getAllUsuarios = () => {
  return prisma.usuario.findMany({
    where: { removido: false },
  });
};

const getUsuarioByID = (id) => {
  return prisma.usuario.findFirst({
    where: { id: id, removido: false },
  });
};

const createUsuario = async (usuarioData) => {
  const hashSenha = await bcrypt.hash(usuarioData.senha, 10);

  const usuarioDataComHash = {
    ...usuarioData,
    senha: hashSenha, // Substitui a senha original pelo hash
  };

  return prisma.usuario.create({
    data: usuarioDataComHash,
  });
};

const updateUsuario = async (id, usuarioData) => {
  return prisma.usuario.update({
    where: { id: id },
    data: usuarioData,
  });
};

const deleteUsuario = (id) => {
  return prisma.usuario.update({
    where: { id: id },
    data: { removido: true },
  });
};

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
