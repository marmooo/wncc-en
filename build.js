import { bundle } from "https://deno.land/x/emit/mod.ts";

const url = new URL(import.meta.resolve("./src/index.js"));
const { code } = await bundle(url);
console.log(code);
