import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const saltRounds = 10;

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Middelware to set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/auth/google", passport.authenticate("google", {
  scope: [ "profile", "email" ]
}));

app.get("/auth/google/secrets", passport.authenticate("google", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/secrets", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;
      const result = await db.query("SELECT * FROM users WHERE email = $1;", [user.email]);
      const secret = result.rows[0].secret;
      res.render("secrets", { secret: secret });
    } catch (err) {
      console.log(err);
      res.send("Unable to load secret");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = req.user;
      const body = req.body;
      const result = await db.query("UPDATE users SET secret = $1 WHERE email = $2;", [ body.secret, user.email ]);
      res.redirect("/secrets");
    } catch (err) {
      console.log(err);
      res.send("Unable to update secret");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    let result = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (result.rows.length > 0) {
      res.redirect("/login");
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;", [email, hashedPassword]);
      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) console.log(err);
        res.redirect("/secrets");
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Unable to register user. Please try again");
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

passport.use("local", new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1;", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        cb(null, user);
      } else {
        cb(null, false);
      }
    } else {
      cb(null, false);
    }
    
  } catch (err) {
    console.log(err);
    cb(err);
  }
}));

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userprofileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1;", [profile.email]);
    if (result.rows.length == 0) {
      const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;", [profile.email, "google"]);
      const newUser = result.rows[0];
      cb(null, newUser);
    } else {
      const user = result.rows[0];
      cb(null, user);
    }
  } catch (err) {
    console.log(err);
    cb(err);
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
