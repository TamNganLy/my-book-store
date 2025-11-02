// DBConfig.js
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DBConnLink,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

export default db;