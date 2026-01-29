from sqlalchemy import Column, Integer, String
from db.sqlite import Base


class Permission(Base):
    __tablename__ = "permission"

    permission_id = Column(Integer, primary_key=True)
    permission_name = Column(String)
