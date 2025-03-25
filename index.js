import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./database.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fetch all stocks
app.get("/stocks", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM stock_data ORDER BY date ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching stocks:", err); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new stock
app.post("/stocks", async (req, res) => {
  try {
    let { date, trade_code, open, close, high, low, volume } = req.body;

    if (!date || !trade_code || isNaN(open) || isNaN(close) || isNaN(high) || isNaN(low) || isNaN(volume)) {
      return res.status(400).json({ error: "All fields are required and must be valid numbers." });
    }

    date = new Date(date).toISOString().split("T")[0]; 
    const formattedOpen = parseFloat(open).toFixed(2);
    const formattedClose = parseFloat(close).toFixed(2);
    const formattedHigh = parseFloat(high).toFixed(2);
    const formattedLow = parseFloat(low).toFixed(2);
    const formattedVolume = parseInt(volume, 10);

    const [result] = await db.execute(
      `INSERT INTO stock_data (date, trade_code, open, close, high, low, volume) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [date, trade_code, formattedOpen, formattedClose, formattedHigh, formattedLow, formattedVolume]
    );

    if (result.affectedRows === 1) {
      res.status(201).json({ message: "Stock added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add stock." });
    }
  } catch (err) {
    console.error("Error adding stock:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch stocks by trade_code 
app.get("/stocks/:trade_code", async (req, res) => {
  try {
    const tradeCode = req.params.trade_code;

    if (!/^[A-Za-z0-9]+$/.test(tradeCode)) {
      return res.status(400).json({ error: "Invalid trade code format." });
    }

    const [rows] = await db.execute(
      "SELECT * FROM stock_data WHERE trade_code = ? ORDER BY date ASC",
      [tradeCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found for the given trade code." });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching stock data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch unique trade codes
app.get("/getAllStringStocks", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT DISTINCT UPPER(trade_code) AS trade_code FROM stock_data"
    );
    res.json(rows.map(row => row.trade_code));
  } catch (err) {
    console.error("Error fetching trade codes:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/stockById/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); 

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid stock ID format." });
    }

    const [rows] = await db.execute("SELECT * FROM stock_data WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No stock found with this ID." });
    }

    res.json(rows[0]); 
  } catch (err) {
    console.error("Error fetching stock by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update stock data by id
app.put("/stocks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); 
    let { date, trade_code, open, close, high, low, volume } = req.body;

    if (!date || !trade_code || isNaN(open) || isNaN(close) || isNaN(high) || isNaN(low) || isNaN(volume)) {
      return res.status(400).json({ error: "All fields are required and must be valid numbers." });
    }

    date = new Date(date).toISOString().split("T")[0]; 

    const formattedOpen = parseFloat(open).toFixed(2);
    const formattedClose = parseFloat(close).toFixed(2);
    const formattedHigh = parseFloat(high).toFixed(2);
    const formattedLow = parseFloat(low).toFixed(2);
    const formattedVolume = parseInt(volume, 10);

    const [result] = await db.execute(
      `UPDATE stock_data 
       SET date = ?, trade_code = ?, open = ?, close = ?, high = ?, low = ?, volume = ? 
       WHERE id = ?`,
      [date, trade_code, formattedOpen, formattedClose, formattedHigh, formattedLow, formattedVolume, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stock not found or no changes made." });
    }

    res.json({ message: "Stock updated successfully." });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete stock data by id
app.delete("/stocks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); 

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid stock ID format." });
    }

    const [result] = await db.execute("DELETE FROM stock_data WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stock not found." });
    }

    res.json({ message: "Stock deleted successfully." });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
