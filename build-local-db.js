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
  for (const alphabet of alphabets) {
    const result = [];
    const fileReader = await Deno.open(
      `google-ngram-small-en/dist/1gram/${alphabet}.csv`,
    );
    for await (const line of readLines(fileReader)) {
      if (!line) continue;
      const pos = line.lastIndexOf(",");
      const lemma = line.slice(0, pos);
      if (!/[A-Za-z]+$/.test(lemma)) continue;
      const count = parseInt(line.slice(pos + 1));
      if (count > threshold) {
        result.push([lemma, count]);
      }
    }
    fileReader.close();
    db.transaction((result) => {
      result.forEach((row) => {
        insertLemma.run(...row);
      });
    })(result);
    console.log(alphabet);
  }
  console.log("parse 1gram");
}

async function parseAlphabet(alphabet, n) {
  const result = [];
  const fileReader = await Deno.open(
    `google-ngram-small-en/dist/${n}gram/${alphabet}.csv`,
  );
  for await (const line of readLines(fileReader)) {
    if (!line) continue;
    const pos = line.lastIndexOf(",");
    const sentence = line.slice(0, pos);
    if (!/^[A-Za-z ]+$/.test(sentence)) continue;
    const lemmas = sentence.split(" ");
    if (lemmas.length != n) continue;
    const count = parseInt(line.slice(pos + 1));
    if (count <= threshold) continue;
    lemmas.forEach((lemma) => {
      const row = getWordId.value(lemma);
      if (row) {
        const wordId = row[0];
        if (wordId) {
          result.push([wordId, sentence, count]);
        } else {
          console.log("error: " + lemma);
        }
      }
    });
  }
  fileReader.close();
  db.transaction((data) => {
    data.forEach((row) => {
      insertCollocation.run(row);
    });
  })(result);
  console.log(alphabet);
}

async function parseNgram() {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("");
  for (let n = 2; n <= 3; n++) {
    for (const alphabet of alphabets) {
      await parseAlphabet(alphabet, n);
    }
    console.log(`parse ${n}gram`);
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
