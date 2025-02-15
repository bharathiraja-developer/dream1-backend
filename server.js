const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.HOST, // "srv984.hstgr.io", // Your MySQL host
  user: process.env.USER, // Your database username
  password: process.env.PASSWORD, // Your database password (replace it)
  database: process.env.DB, // Your database name
  port: process.env.PORT, // Default MySQL port
  connectionLimit: 10, // Set a limit for connections
  waitForConnections: true,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
    connection.release(); // Release connection after use
  }
});

const findRecord = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM live WHERE id = 1";
    pool.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

app.get("/", async (req, res) => {
  try {
    const link = await findRecord();
    return res.json({ link: link });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

const updateRecord = (newUrl) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE live SET livelink = ? WHERE id = 1";
    pool.query(query, [newUrl], (err, results) => {
      if (err) {
        console.error("❌ Error updating data:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Example usage inside an API route
app.post("/update", async (req, res) => {
  const { newUrl } = req.body; // Expecting JSON body { id: 1, newUrl: "https://newlink.com" }

  try {
    const result = await updateRecord(newUrl);
    return res.json({ success: true, message: "Record updated", result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Database update failed" });
  }
});

app.listen(3000, () => {
  console.log("listening");
});
