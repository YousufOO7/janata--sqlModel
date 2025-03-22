import db from "./database.js"; // ✅ Ensure full file extension
import fs from "fs";

const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync("stock_market_data.json", "utf8"));

    for (const row of data) {
      // ✅ Ensure date format consistency
      const formattedDate = new Date(row.date).toISOString().split("T")[0]; // "YYYY-MM-DD"

      // ✅ Convert numeric fields safely
      const high = parseFloat(row.high) || 0;
      const low = parseFloat(row.low) || 0;
      const open = parseFloat(row.open) || 0;
      const close = parseFloat(row.close) || 0;
      const volume = parseInt(row.volume.replace(/,/g, ""), 10) || 0;

      // ✅ SQL Query
      const sql = `
        INSERT INTO stock_data (date, trade_code, high, low, open, close, volume)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [formattedDate, row.trade_code, high, low, open, close, volume];

      await db.query(sql, values);
    }

    console.log("✅ Data Imported Successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await db.end(); // ✅ Ensure connection is closed even if an error occurs
  }
};

importData();
