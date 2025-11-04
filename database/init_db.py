import os\nimport sqlite3

DB_PATH = os.path.join("database", "tvshow.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Exemple crÃ©ation des tables
cursor.execute("""
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS tvshow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    synopsis TEXT,
    image_url TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    tvshow_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    UNIQUE(username, tvshow_name) ON CONFLICT REPLACE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS mylist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    tvshow_id INTEGER NOT NULL,
    UNIQUE(username, tvshow_id) ON CONFLICT REPLACE
)
""")

conn.commit()
conn.close()

print("Base de données initialisée avec succès !")

