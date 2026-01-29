import sqlite3
from pathlib import Path

# Resolve absolute path safely (works in local, Docker, K8s)
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "auth.db"


def get_db_connection():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS otp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            identifier TEXT NOT NULL,
            otp TEXT NOT NULL,
            expiry TEXT NOT NULL
        )
        """
    )
    return conn
