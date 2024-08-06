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

let currentUserId = 1;

async function getVisited() {
  const result = await db.query("SELECT * FROM visited_countries WHERE user_id = $1", [currentUserId]);
  return result.rows.map(row => row.country_code);
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

app.get("/", async (req, res) => {
  const visited = await getVisited();
  const users = await getUsers();
  res.render("index", {
    total: visited.length,
    countries: visited,
    users: users,
    color: users.find(user => user.id == currentUserId).color
  });
});

app.post("/add", async (req, res) => {
  const country = req.body.country.trim().toLowerCase();
  try {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'", [country]);
    if (result.rows.length === 0) {
      throw new Error(`${country}, does not exist`);
    }
    try {
      const data = result.rows[0];
      await db.query("INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)", [data.country_code, currentUserId]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const visited = await getVisited();
      res.render("index", {
        total: visited.length,
        countries: visited,
        error: `Country ${country} has already been added, please try again`
      });
    }
  } catch (err) {
    console.log(err);
    const visited = await getVisited();
    res.render("index", {
      total: visited.length,
      countries: visited,
      error: `Country ${country} does not exist, please try again`
    });
  }
});

app.post("/user", async (req, res) => {
  const user = req.body.user;
  const add = req.body.add;
  if (add === "new") {
    res.render("new");
  } else {
    currentUserId = user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name.trim();
  const color = req.body.color;
  const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id;", [name, color]);
  currentUserId = result.rows[0].id;
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
