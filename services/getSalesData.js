const pool = require("../db/dbConfig");

async function getProducts() {
  const result = await pool.query("SELECT * FROM products");
  return result;
}

async function insertData(jsonData) {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    const err = new Error("Invalid or empty data for bulk insert");
    err.statusCode = 400;
    throw err;
  }
  const result = await pool.query(
    "SELECT * FROM bulk_insert_products_summary_datas($1)",
    [JSON.stringify(jsonData)]
  );
  return result.rows[0];
}

module.exports = { getProducts, insertData };