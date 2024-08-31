import mysql = require("mysql2");

export const connection = mysql.createPool({
    host: process.env.FX_DB_HOST,
    user: process.env.FX_DB_USER,
    database: process.env.FX_DB_NAME,
    password: process.env.FX_DB_PASS,
    port: parseInt(process.env.FX_DB_PORT || "3306"),
});
