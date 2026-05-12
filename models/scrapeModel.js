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

const buscarPorCategoria = async (categoria) => {
    try {
        const connection = await pool.getConnection();
        const query = "SELECT * FROM productos WHERE categoria = ? ORDER BY nombre";
        const [rows] = await connection.query(query, [categoria]);
        connection.release();
        return rows;
    } catch (error) {
        throw new Error(`Error al buscar por categoria: ${error.message}`);
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

module.exports = { buscarPorCategoria, obtenerStats };