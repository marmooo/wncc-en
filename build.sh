mkdir -p docs
cp -r src/* docs
drop-inline-css -r docs -o docs
minify -r docs -o .
cp node_modules/sql.js-httpvfs/dist/sqlite.worker.js docs/sql.js-httpvfs/
cp node_modules/sql.js-httpvfs/dist/sqlite.worker.js.map docs/sql.js-httpvfs/
cp node_modules/sql.js-httpvfs/dist/sql-wasm.wasm docs/sql.js-httpvfs/
deno run -A build.js ./src/index.js > docs/index.js
minify docs/index.js -o docs/index.js
