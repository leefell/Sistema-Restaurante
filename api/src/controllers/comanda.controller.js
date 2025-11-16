const comandaService = require("../services/comanda.service.js");

const getAllComandas = async (req, res) => {
  try {
    const comandas = await comandaService.getAllComandas();
    res.status(200).json(comandas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comandas." });
  }
};

const getAllComandasPorMesa = async (req, res) => {
  const { mesaId } = req.params;
  try {
    const comandas = await comandaService.getAllComandasPorMesa(
      parseInt(mesaId)
    );
    res.status(200).json(comandas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comandas por mesa." });
  }
};

const getComandaByID = async (req, res) => {
  const { id } = req.params;
  try {
    const comanda = await comandaService.getComandaByID(parseInt(id));
    if (comanda) {
      res.status(200).json(comanda);
    } else {
      res.status(404).json({ error: "Comanda não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comanda." });
  }
};

const getComandasAbertas = async (req, res) => {
  try {
    const comandas = await comandaService.getComandasAbertas();
    res.status(200).json(comandas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comandas abertas." });
  }
};

const getComandasFechadas = async (req, res) => {
  try {
    const comandas = await comandaService.getComandasFechadas();
    res.status(200).json(comandas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comandas fechadas." });
  }
};

const getComandasPagas = async (req, res) => {
  try {
    const comandas = await comandaService.getComandasPagas();
    res.status(200).json(comandas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comandas pagas." });
  }
};

const createComanda = async (req, res) => {
  const comandaData = req.body;

  try {
    const newComanda = await comandaService.createComanda(comandaData);
    res.status(201).json(newComanda);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar comanda." });
  }
};

const updateComanda = async (req, res) => {
  const { id } = req.params;
  const comandaData = req.body;
  try {
    const updatedComanda = await comandaService.updateComanda(
      parseInt(id),
      comandaData
    );
    res.status(200).json(updatedComanda);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar comanda." });
  }
};

const deleteComanda = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComanda = await comandaService.deleteComanda(parseInt(id));
    res.status(200).json(deletedComanda);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar comanda." });
  }
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
