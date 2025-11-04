#!/usr/bin/env python3
# Version SQLite3 only – ORM removed
import os
import sqlite3

# Project-root relative path
DB_PATH = os.path.join("database", "tvshow.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def main():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Users
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
        """
    )

    # Shows
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tvshow (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            synopsis TEXT,
            image_url TEXT
        )
        """
    )

    # Terms
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tvshow_term (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tvshow_id INTEGER NOT NULL,
            term TEXT NOT NULL,
            count REAL NOT NULL,
            UNIQUE(tvshow_id, term) ON CONFLICT REPLACE
        )
        """
    )

    # Ratings
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            tvshow_name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            UNIQUE(username, tvshow_name) ON CONFLICT REPLACE
        )
        """
    )

    # My list
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS mylist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            tvshow_id INTEGER NOT NULL,
            UNIQUE(username, tvshow_id) ON CONFLICT REPLACE
        )
        """
    )

    # Indexes
    cur.execute("CREATE INDEX IF NOT EXISTS idx_tvshow_name ON tvshow(name)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_tvshow_term_show_term ON tvshow_term(tvshow_id, term)")

    conn.commit()
    conn.close()
    print(f"Base SQLite créée avec succès : {os.path.abspath(DB_PATH)}")

if __name__ == "__main__":
    main()
