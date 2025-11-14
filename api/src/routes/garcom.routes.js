const express = require("express");
const router = express.Router();
const garcomController = require("../controllers/garcom.controller.js");

router.get("/", garcomController.getAllGarcom);
router.get("/:id", garcomController.getGarcomByID);
// router.get("/:id/mesas", garcomController.getMesasByGarcomID);
router.post("/", garcomController.createGarcom);
router.put("/:id", garcomController.updateGarcom);
router.delete("/:id", garcomController.deleteGarcom);

module.exports = router;
