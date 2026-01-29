from sqlalchemy import Column, Integer
from db.sqlite import Base


class RolePermission(Base):
    __tablename__ = "role_permission"

    role_id = Column(Integer, primary_key=True)
    permission_id = Column(Integer, primary_key=True)
