import { Database } from "./deps.ts";

const localDB = new Database("local.db");
const getWords = localDB.prepare(`
  SELECT lemma,wordid FROM words
`);
const getCollocations = localDB.prepare(`
  SELECT word FROM collocations WHERE wordid = ? ORDER BY count DESC
`);

const remoteDB = new Database("remote.db");
remoteDB.run("pragma synchronouse=OFF");
remoteDB.run("pragma journal_mode=MEMORY");
remoteDB.run(`
  CREATE TABLE IF NOT EXISTS collocations (
    lemma TEXT,
    words TEXT
  )
`);
const insertCollocation = remoteDB.prepare(`
  INSERT INTO collocations (lemma, words) VALUES(?, ?);
`);

const words = getWords.values();
remoteDB.transaction((data) => {
  for (const row of data) {
    const [lemma, wordid] = row;
    const collocations = getCollocations.values(wordid);
    if (collocations.length > 0) {
      const result = collocations.map((c) => c[0]);
      insertCollocation.run(lemma, JSON.stringify(result));
    }
  }
})(words);
remoteDB.run(`
  CREATE INDEX IF NOT EXISTS collocations_index ON collocations(lemma)
`);
