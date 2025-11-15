const mesaService = require("../services/mesa.service.js");

const getAllMesas = async (req, res) => {
  try {
    const mesas = await mesaService.getAllMesas();
    res.status(200).json(mesas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar mesas." + error.message });
  }
};

const getMesaByID = async (req, res) => {
  try {
    const { id } = req.params;
    const mesa = await mesaService.getMesaByID(parseInt(id));
    if (mesa) {
      res.status(200).json(mesa);
    } else {
      res.status(404).json({ error: "Mesa não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar mesa." + error.message });
  }
};

const createMesa = async (req, res) => {
  try {
    const mesaData = req.body;
    const newMesa = await mesaService.createMesa(mesaData);
    res.status(201).json(newMesa);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar mesa." + error.message });
  }
};

const updateMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMesa = await mesaService.updateMesa(parseInt(id), req.body);
    res.status(200).json(updatedMesa);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar mesa." + error.message });
  }
};

const deleteMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMesa = await mesaService.deleteMesa(parseInt(id));
    res.status(200).json(deletedMesa);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar mesa." + error.message });
  }
};

module.exports = {
  getAllMesas,
  getMesaByID,
  createMesa,
  updateMesa,
  deleteMesa,
};
