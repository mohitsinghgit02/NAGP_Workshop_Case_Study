from sqlalchemy import Column, Integer, String
from db.sqlite import Base


class AdminProfile(Base):
    __tablename__ = "admin_profile"

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
