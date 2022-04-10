import { readLines } from "https://deno.land/std/io/mod.ts";
import { DB } from from "./deps.ts";

const threshold = 999;
const db = new DB("local.db");
db.query(`
  CREATE TABLE IF NOT EXISTS words (
    wordid INTEGER PRIMARY KEY AUTOINCREMENT,
    lemma TEXT,
    count INTEGER
  )
`);
db.query(`
  CREATE TABLE IF NOT EXISTS collocations (
    wordid INTEGER,
    word TEXT,
    count INTEGER
  )
`);
const getWordId = db.prepareQuery(`
  SELECT wordid FROM words WHERE lemma = ?
`);
const insertLemma = db.prepareQuery(`
  INSERT INTO words (lemma, count) VALUES(?, ?);
`);
const insertCollocation = db.prepareQuery(`
  INSERT INTO collocations (wordid, word, count) VALUES(?, ?, ?);
`);

async function parseLemma() {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (const alphabet of alphabets) {
    db.query("begin");
    const fileReader = await Deno.open(
      `google-ngram-small-en/dist/1gram/${alphabet}.csv`,
    );
    for await (const line of readLines(fileReader)) {
      if (!line) continue;
      const arr = line.split(",");
      const lemma = arr[0];
      const count = parseInt(arr[1]);
      if (count > threshold) {
        insertLemma.execute([lemma, count]);
      }
    }
    db.query("commit");
    console.log(alphabet);
  }
  console.log("parse 1gram");
}

async function parseNgram() {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let i = 2; i <= 3; i++) {
    for (const alphabet of alphabets) {
      db.query("begin");
      const fileReader = await Deno.open(
        `google-ngram-small-en/dist/${i}gram/${alphabet}.csv`,
      );
      for await (const line of readLines(fileReader)) {
        if (!line) continue;
        const arr = line.split(",");
        const lemmas = arr[0].split(" ");
        const count = parseInt(arr[1]);
        const sentence = lemmas.join(" ");
        lemmas.forEach(lemma => {
          if (lemma.includes("_")) return;
          if (sentence.includes("_")) return;
          const [wordIds] = getWordId.all([lemma]);
          if (wordIds) {
            const wordId = wordIds[0];
            if (wordId) {
              if (count > threshold) {
                insertCollocation.execute([wordId, sentence, count]);
              }
            } else {
              console.log("error: " + word);
            }
          }
        });
      }
      db.query("commit");
      console.log(alphabet);
    }
    console.log(`parse ${i}gram`);
  }
}

await parseLemma();
db.query(`
  CREATE INDEX IF NOT EXISTS words_index ON words(lemma)
`);
await parseNgram();
db.query(`
  CREATE INDEX IF NOT EXISTS collocations_index ON collocations(wordid)
`);
