import { createDbWorker } from "../node_modules/sql.js-httpvfs/dist/index.js";

function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
}

function search() {
  const word = document.getElementById("searchText").value;
  searchCollocations(word);
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
  alert("Copied to clipboard.");
}

async function searchCollocations(lemma) {
  if (!dbWorker) return;
  const loading = document.getElementById("loading");
  loading.classList.remove("d-none");
  const obj = document.getElementById("collocations");
  const row = await dbWorker.searchLemma.getAsObject([lemma]);
  while (obj.firstChild) {
    obj.removeChild(obj.firstChild);
  }
  if (row.words) {
    const words = JSON.parse(row.words);
    for (const word of words) {
      const button = document.createElement("button");
      button.className = "btn btn-outline-secondary m-1";
      button.textContent = word;
      button.type = "button";
      button.onclick = () => {
        copyToClipboard(button.textContent);
      };
      obj.appendChild(button);
    }
  }
  loading.classList.add("d-none");
}

async function loadDBWorker() {
  const config = {
    from: "jsonconfig",
    configUrl: "/wncc-en/db/config.json",
  };
  const loading = document.getElementById("loading");
  loading.classList.remove("d-none");
  dbWorker = await createDbWorker(
    [config],
    "/wncc-en/sql.js-httpvfs/sqlite.worker.js",
    "/wncc-en/sql.js-httpvfs/sql-wasm.wasm",
  );
  dbWorker.searchLemma = await dbWorker.db.prepare(
    `SELECT words FROM collocations WHERE lemma=?`,
  );
  loading.classList.add("d-none");
}

let dbWorker;
loadDBWorker();

document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") search();
});
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("search").onclick = search;
