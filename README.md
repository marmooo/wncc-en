# wncc-en

Web N-gram based Collocation Corpus (English)

[A corpus of co-occurrence in English](https://marmooo.github.io/wncc-en/). It
can also be used as example sentences dictionary.

## Installation

- install
  [google-ngram-small-en](http://github.com/marmooo/google-ngram-small-en)
  licensed under the CC-BY-4.0

## Build

```
deno run -RWE --allow-ffi build-local-db.js
deno run -RW --allow-ffi build-remote-db.js
bash optimize.sh
bash create_db.sh remote.db docs/db
bash build.sh
```

## Related projects

- [wncc-ja](https://github.com/marmooo/wncc-ja) (Japanese)

## License

CC-BY-4.0
