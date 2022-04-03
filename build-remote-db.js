import { readLines } from "https://deno.land/std/io/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const localDB = new DB("local.db");
const getWords = localDB.prepareQuery(`
  SELECT lemma,wordid FROM words
`);
const getCollocations = localDB.prepareQuery(`
  SELECT word FROM collocations WHERE wordid = ? ORDER BY count DESC
`);

const remoteDB = new DB("remote.db");
remoteDB.query(`
  CREATE TABLE IF NOT EXISTS collocations (
    lemma TEXT,
    words TEXT
  )
`);
const insertCollocation = remoteDB.prepareQuery(`
  INSERT INTO collocations (lemma, words) VALUES(?, ?);
`);

for (const rows of getWords.all()) {
  const [lemma, wordid] = rows;
  const collocations = getCollocations.all([wordid]);
  if (collocations.length > 0) {
    insertCollocation.execute([lemma, JSON.stringify(collocations)]);
  }
}
remoteDB.query(`
  CREATE INDEX IF NOT EXISTS collocations_index ON collocations(lemma)
`);
