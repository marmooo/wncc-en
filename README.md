# wncc-en

Web N-gram based Collocation Corpus (English)

[A corpus of co-occurrence in English](https://marmooo.github.io/wncc-en/). It
can also be used as example sentences dictionary.

## Installation

- install [google-ngram-small-en](http://github.com/marmooo/google-ngram-small-en)
  licensed under the CC BY 4.0
- `npm install`

## Build

```
deno run --allow-read --allow-write build-local-db.js
deno run --allow-read --allow-write build-remote-db.js
bash optimize.sh
bash build.sh
bash create_db.sh remote.db docs/db
```

## Related projects

- [wncc-ja](https://github.com/marmooo/wncc-ja) (Japanese)

## License

CC BY 4.0
