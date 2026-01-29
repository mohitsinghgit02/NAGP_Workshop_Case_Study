# models/user_role.py
from sqlalchemy import Column, Integer, String
from db.sqlite import Base


class UserRole(Base):
    __tablename__ = "user_role"

    user_id = Column(String, primary_key=True)
    role_id = Column(Integer, primary_key=True)
