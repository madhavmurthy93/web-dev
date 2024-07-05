import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const password = "ILoveProgramming";

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));

function authenticate(req, res, next) {
    if (req.body.password === password) {
        next();
    } else {
        res.redirect("/");
    }
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });

app.get("/secret", (req, res) => {
    // Ideally check if there is an authorized login session before this is displayed but dumb version for now
    res.sendFile(__dirname + "/public/secret.html");
})
  
app.post("/check", authenticate, (req, res) => {
    res.redirect("/secret");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });