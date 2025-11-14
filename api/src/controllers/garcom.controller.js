const garcomService = require("../services/garcom.service.js");

const getAllGarcom = async (req, res) => {
  try {
    const garcons = await garcomService.getAllGarcom();
    res.status(200).json(garcons);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar garçons." + error.message });
  }
};

const getGarcomByID = async (req, res) => {
  try {
    const { id } = req.params;
    const garcom = await garcomService.getGarcomByID(parseInt(id));
    if (garcom) {
      res.status(200).json(garcom);
    } else {
      res.status(404).json({ error: "Garçom não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar garçom." + error.message });
  }
};

// Quando o Crud de mesas for implementado, descomentar essa função
// const getMesasByGarcomID = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const garcom = await garcomService.getGarcomByID(parseInt(id));
//     if (garcom) {
//       const mesas = await garcomService.getMesasByGarcomID(parseInt(id));
//       res.status(200).json(mesas);
//     } else {
//       res.status(404).json({ error: "Garçom não encontrado." });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Erro ao buscar mesas do garçom." + error.message });
//   }
// };

const createGarcom = async (req, res) => {
  try {
    const garcomData = req.body;
    const novoGarcom = await garcomService.createGarcom(garcomData);
    res.status(201).json(novoGarcom);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar garçom." + error.message });
  }
};

const updateGarcom = async (req, res) => {
  try {
    const { id } = req.params;
    const garcomAtualizado = await garcomService.updateGarcom(
      parseInt(id),
      req.body
    );
    res.status(200).json(garcomAtualizado);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar garçom." + error.message });
  }
};

const deleteGarcom = async (req, res) => {
  try {
    const { id } = req.params;
    const garcomDeletado = await garcomService.deleteGarcom(parseInt(id));
    res.status(200).json(garcomDeletado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar garçom." + error.message });
  }
};

module.exports = {
  getAllGarcom,
  getGarcomByID,
  createGarcom,
  updateGarcom,
  deleteGarcom,
};
