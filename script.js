import mysql from "mysql2/promise";
require('dotenv').config()
const setupDatabase = async () => {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
    });

    console.log(" Connected to MySQL Server");

    await db.execute("CREATE DATABASE IF NOT EXISTS stock_db");
    console.log(" Database Created: stock_db");

    await db.end();

    const dbWithDatabase = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: "stock_db",
    });

    console.log(" Connected to Database: stock_db");

    const [rows] = await dbWithDatabase.execute("SELECT * FROM stock_data");
    console.log(" Data Retrieved from stock_data table:", rows);

    await dbWithDatabase.end();
  } catch (error) {
    console.error(" Error Occurred:", error);
  }
};

setupDatabase();



// await dbWithDatabase.execute(`
//   CREATE TABLE stock_data (
// id INT AUTO_INCREMENT PRIMARY KEY,
// date DATE,
// trade_code VARCHAR(50),
// high FLOAT,
// low FLOAT,
// open FLOAT,
// close FLOAT,
// volume BIGINT
// );


// CREATE TABLE stock_data (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   date DATE,
//   trade_code VARCHAR(50),
//   high FLOAT,
//   low FLOAT,
//   open FLOAT,
//   close FLOAT,
//   volume BIGINT
//   );


//     await dbWithDatabase.execute(`
//         CREATE TABLE stock_data (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     date DATE,
//     trade_code VARCHAR(50),
//     high FLOAT,
//     low FLOAT,
//     open FLOAT,
//     close FLOAT,
//     volume BIGINT
// );

//     `);
 
