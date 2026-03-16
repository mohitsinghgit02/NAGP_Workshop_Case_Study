import sqlite3
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os


DB_PATH = os.getenv("CUSTOMER_DB_PATH")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

DATABASE_URL = f"sqlite:///{DB_PATH}"


# -------------------------
# Existing RAW connection (UNCHANGED)
# -------------------------
def get_db_connection():
    # DATA_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row

    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS CUSTOMER_DB_CUSTOMER (
            customer_id TEXT PRIMARY KEY,
            user_id TEXT,
            first_name TEXT,
            last_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS CUSTOMER_DB_ADDRESS (
            address_id TEXT PRIMARY KEY,
            customer_id TEXT NOT NULL,
            line1 TEXT,
            line2 TEXT,
            city TEXT,
            state TEXT,
            country TEXT,
            postal_code TEXT,
            FOREIGN KEY(customer_id) REFERENCES CUSTOMER_DB_CUSTOMER(customer_id)
        );
        CREATE TABLE IF NOT EXISTS CUSTOMER_DB_LIKED_PRODUCT (
            liked_id TEXT PRIMARY KEY,
            user_id TEXT,
            product_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, product_id)
        );

        CREATE TABLE IF NOT EXISTS CUSTOMER_DB_CART_PRODUCT (
            cart_id TEXT PRIMARY KEY,
            user_id TEXT,
            product_id TEXT,
            quantity INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
