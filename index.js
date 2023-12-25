const express = require("express");
const { readdirSync } = require("fs");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);

readdirSync("./src/routes").map((routePath) => {
  app.use("/api/v1", require(`./src/routes/${routePath}`));
});

app.get("/", (req, res) => {
  res.send("I AM WORKING, BUT YOUVE GOTTA WORK TOO!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
