import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Middelware to set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM visited_countries");
  const visited = result.rows.map(row => row.country_code);
  res.render("index", { total: visited.length, countries: visited });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
