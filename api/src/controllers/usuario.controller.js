const usuarioService = require("../services/usuario.service.js");

const getMe = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await usuarioService.getUsuarioByID(usuarioId);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const { senha, ...usuarioSemSenha } = usuario;

    res.status(200).json(usuarioSemSenha);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar dados do usuário." + error.message });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await usuarioService.loginUsuario(email, senha);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ error: "Falha na autenticação: " + error.message });
  }
};

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." + error.message });
  }
};

const getUsuarioByID = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    const usuario = await usuarioService.getUsuarioByID(parsedId);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário." + error.message });
  }
};

const createUsuario = async (req, res) => {
  try {
    const usuarioData = req.body;
    const novoUsuario = await usuarioService.createUsuario(usuarioData);
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário." + error.message });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioAtualizado = await usuarioService.updateUsuario(
      parseInt(id),
      req.body
    );
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar usuário." + error.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioDeletado = await usuarioService.deleteUsuario(parseInt(id));
    res.status(200).json(usuarioDeletado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário." + error.message });
  }
};

module.exports = {
  getMe,
  loginUsuario,
  getAllUsuarios,
  getUsuarioByID,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
