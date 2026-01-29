from sqlalchemy import Column, Integer, String
from db.sqlite import Base


class Role(Base):
    __tablename__ = "role"

    role_id = Column(Integer, primary_key=True)
    role_name = Column(String)
