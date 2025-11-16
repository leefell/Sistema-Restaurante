const prisma = require("../prismaClient.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const loginUsuario = async (email, senha) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw new Error("Senha inválida.");
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
    expiresIn: "1h", 
  });

  return { token };
};

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
  loginUsuario,
  getAllUsuarios,
  getUsuarioByID,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
