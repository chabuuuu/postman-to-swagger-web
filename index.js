// Require Package
const postmanToOpenApi = require("postman-to-openapi");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const app = express();

app.post("/convert", upload.single("jsonFile"), (req, res) => {
  const postmanCollection = req.file.path;
  const filename = req.file.filename.split(".")[0];
  const outputFile = "./results/" + filename + ".yaml";

  postmanToOpenApi(postmanCollection, outputFile, { defaultTag: "General" })
    .then((result) => {
      res.download(outputFile, (err) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          fs.unlink(postmanCollection, (err) => {
            if (err) console.error("Failed to delete uploaded file:", err);
          });
          fs.unlink(outputFile, (err) => {
            if (err) console.error("Failed to delete converted file:", err);
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/checkpoint", (req, res) => {
  res.send("Hello World");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
