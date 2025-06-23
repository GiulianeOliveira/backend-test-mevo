import express from "express";
import multer from "multer";

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", upload.single("transaction"), (req, res) => {
  const transaction = req.file;

  if (!transaction) res.status(400).json("file not sended.");

  res.status(200).json({ transaction });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
