sqlite3 remote.db "pragma journal_mode = delete;"
sqlite3 remote.db "pragma page_size = 1024;"
sqlite3 remote.db "vacuum;"
