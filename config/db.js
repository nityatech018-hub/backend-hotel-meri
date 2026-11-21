import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create connection pool for MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hotel_meri",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully.");
    connection.release();
    return true;
  } catch (error) {
    console.warn("⚠️  MySQL Database connection status: Offline / Not running yet.");
    console.warn("   (Backend structure is ready. To connect, start MySQL and verify .env credentials.)");
    return false;
  }
}
