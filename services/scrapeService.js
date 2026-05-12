const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "10.1.15.29",
    user: "alumno",
    password: "",
    database: "JOSE",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getScrapedData = async () => {
    const url = "https://books.toscrape.com/";
    try {
        const response = await axios.get(url);
        if (!response.data) throw new Error("HTML vacío");

        const $ = cheerio.load(response.data);
        const results = [];

        $(".product_pod").each((index, element) => {
            if (index < 5) {
                const precioTexto = $(element).find(".price_color").text();
                const precioNumerico = parseFloat(precioTexto.replace(/[^0-9.-]+/g, ""));

                results.push({
                    titulo: $(element).find("h3 a").attr("title"),
                    precio: precioNumerico,
                    disponibilidad: $(element).find(".availability").text().trim()
                });
            }
        });

        if (results.length === 0) throw new Error("No se encontraron resultados");
        return results;
    } catch (error) {
        throw new Error("Error obteniendo HTML: " + error.message);
    }
};

const obtenerStats = async () => {
    try {
        const connection = await pool.getConnection();
        const query = `
            SELECT 
                COUNT(*) as total,
                MIN(precio) as precioMinimo,
                MAX(precio) as precioMaximo,
                AVG(precio) as precioPromedio
            FROM productos
        `;
        const [results] = await connection.query(query);
        connection.release();
        return results[0];
    } catch (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
};

module.exports = { getScrapedData, obtenerStats };