import { readLines } from "https://deno.land/std/io/mod.ts";
import { Database } from "./deps.ts";

const threshold = 999;
const db = new Database("local.db");
db.run("pragma synchronouse=OFF");
db.run("pragma journal_mode=MEMORY");
db.run(`
  CREATE TABLE IF NOT EXISTS words (
    wordid INTEGER PRIMARY KEY AUTOINCREMENT,
    lemma TEXT,
    count INTEGER
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS collocations (
    wordid INTEGER,
    word TEXT,
    count INTEGER
  )
`);
const getWordId = db.prepare(`
  SELECT wordid FROM words WHERE lemma = ?
`);
const insertLemma = db.prepare(`
  INSERT INTO words (lemma, count) VALUES(?, ?);
`);
const insertCollocation = db.prepare(`
  INSERT INTO collocations (wordid, word, count) VALUES(?, ?, ?);
`);

async function parseLemma() {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("");
  const result = [];
  for (const alphabet of alphabets) {
    const fileReader = await Deno.open(
      `google-ngram-small-en/dist/1gram/${alphabet}.csv`,
    );
    for await (const line of readLines(fileReader)) {
      if (!line) continue;
      const arr = line.split(",");
      const lemma = arr[0];
      const count = parseInt(arr[1]);
      if (count > threshold) {
        result.push([lemma, count]);
      }
    }
    console.log(alphabet);
  }
  db.transaction((result) => {
    result.forEach((row) => {
      insertLemma.run(...row);
    });
  })(result);
  console.log("parse 1gram");
}

async function parseNgram() {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("");
  for (let i = 2; i <= 3; i++) {
    const result = [];
    for (const alphabet of alphabets) {
      const fileReader = await Deno.open(
        `google-ngram-small-en/dist/${i}gram/${alphabet}.csv`,
      );
      for await (const line of readLines(fileReader)) {
        if (!line) continue;
        const arr = line.split(",");
        const lemmas = arr[0].split(" ");
        const count = parseInt(arr[1]);
        const sentence = lemmas.join(" ");
        lemmas.forEach((lemma) => {
          if (lemma.includes("_")) return;
          if (sentence.includes("_")) return;
          const row = getWordId.value(lemma);
          if (row) {
            const wordId = row[0];
            if (wordId) {
              if (count > threshold) {
                result.push([wordId, sentence, count]);
              }
            } else {
              console.log("error: " + lemma);
            }
          }
        });
      }
      console.log(alphabet);
    }
    db.transaction((data) => {
      data.forEach((row) => {
        insertCollocation.run(row);
      });
    })(result);
    console.log(`parse ${i}gram`);
  }
}

await parseLemma();
db.run(`
  CREATE INDEX IF NOT EXISTS words_index ON words(lemma)
`);
await parseNgram();
db.run(`
  CREATE INDEX IF NOT EXISTS collocations_index ON collocations(wordid)
`);
