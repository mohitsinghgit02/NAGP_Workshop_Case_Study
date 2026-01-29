import sqlite3
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "auth.db"

DATABASE_URL = f"sqlite:///{DB_PATH}"


# -------------------------
# Existing RAW connection (UNCHANGED)
# -------------------------
def get_db_connection():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row

    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS otp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            identifier TEXT NOT NULL,
            otp TEXT NOT NULL,
            expiry TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS user (
            user_id TEXT PRIMARY KEY,
            email TEXT,
            phone TEXT,
            status TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS role (
            role_id INTEGER PRIMARY KEY,
            role_name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS permission (
            permission_id INTEGER PRIMARY KEY,
            permission_name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS role_permission (
            role_id INTEGER,
            permission_id INTEGER,
            UNIQUE(role_id, permission_id)
        );

        CREATE TABLE IF NOT EXISTS user_role (
            user_id TEXT,
            role_id INTEGER,
            UNIQUE(user_id, role_id)
        );

        CREATE TABLE IF NOT EXISTS admin_profile (
            admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    return conn


# -------------------------
# SQLAlchemy ORM setup (NEW)
# -------------------------
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
