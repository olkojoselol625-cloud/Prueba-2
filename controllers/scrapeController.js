const { getScrapedData, obtenerStats } = require("../services/scrapeService");
const axios = require("axios");
const cheerio = require("cheerio");

const scrapeData = async (req, res) => {
    try {
        const data = await getScrapedData();
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron datos" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno", detalle: error.message });
    }
};

const verStats = async (req, res) => {
    try {
        const stats = await obtenerStats();
        if (!stats) {
            return res.status(404).json({ error: "No se encontraron estadísticas" });
        }
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ error: "Error interno", detalle: error.message });
    }
};

const importarCatalogo = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ ok: false, error: "URL requerida" });

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const productos = [];


        $(".product_pod").each((index, element) => {
            productos.push({
                nombre: $(element).find("h3 a").attr("title"),
                precio: $(element).find(".price_color").text(),
                descripcion: "Sin descripción disponible" 
            });
        });

        if (productos.length === 0) {
            return res.status(404).json({ ok: false, error: "No se encontraron elementos" });
        }

        res.status(200).json({ ok: true, data: productos });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

module.exports = { scrapeData, verStats, importarCatalogo };