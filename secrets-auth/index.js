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

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    let result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (result.rows.length > 0) {
      res.send("User already registered. Please log in");
    } else {
      result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2);", [email, password]);
      res.render("secrets");
    }
  } catch (err) {
    console.log(err);
    res.send("Unable to register user. Please try again");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (password == user.password) {
        res.render("secrets");
      } else {
        res.send("Incorrect username/password. Please try again");
      }
    } else {
      res.send("User not found. Please register");
    }
    
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
