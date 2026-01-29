from sqlalchemy import Column, String
from db.sqlite import Base


class User(Base):
    __tablename__ = "user"

    user_id = Column(String, primary_key=True, index=True)
    email = Column(String, nullable=True, unique=True)
    phone = Column(String, nullable=True, unique=True)
    status = Column(String, nullable=False)
