import express from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const loadRowsAccordingFileUploaded = (
  file: Express.Multer.File
): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const result: Transaction[] = [];
    const stream = fs
      .createReadStream(file.path)
      .pipe(csv())
      .on("data", async (data) => {
        result.push(data);
      })
      .on("end", () => {
        resolve(result);
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
}

app.post("/upload", upload.single("transaction"), async (req, res) => {
  const transaction = req.file;

  if (!transaction) res.status(400).json("file not sended.");
  else {
    const data = await loadRowsAccordingFileUploaded(transaction);
    // array salva

    // array invalido
    // amount negativo
    // 3 itens iguais
    // amount acima de 50k
    //

    const invalidTransactions = data.map((transaction) => {
      if (transaction.amount < 0) {
        return {
          transaction,
          error: "negative amount.",
        };
      }

      // 7733370917404;1176377952903;181940007
      // transaction.amount / 100
      const SUSPECT_AMOUNT = 50000;

      if (transaction.amount / 100 < SUSPECT_AMOUNT) {
        return {
          transaction,
          error: "Suspect Amount (>50k).",
        };
      }
    });

    res.status(200).json({ transaction });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
