const express = require("express");
const router = express.Router();
const { verStats, importarCatalogo } = require("../controllers/scrapeController");

router.get("/stats", verStats);
router.get("/importar", importarCatalogo);

module.exports = router;