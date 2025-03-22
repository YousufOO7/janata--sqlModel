import mysql from "mysql2/promise";

const setupDatabase = async () => {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "my!sql@",
    });

    console.log("✅ Connected to MySQL Server");

    await db.execute("CREATE DATABASE IF NOT EXISTS stock_db");
    console.log("✅ Database Created: stock_db");

    await db.end();

    const dbWithDatabase = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "my!sql@",
      database: "stock_db",
    });

    console.log("✅ Connected to Database: stock_db");

    const [rows] = await dbWithDatabase.execute("SELECT * FROM stock_data");
    console.log("✅ Data Retrieved from stock_data table:", rows);

    await dbWithDatabase.end();
  } catch (error) {
    console.error("❌ Error Occurred:", error);
  }
};

setupDatabase();
