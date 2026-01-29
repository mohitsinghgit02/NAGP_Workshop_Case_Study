from sqlalchemy import Column, Integer, String, DateTime
from db.sqlite import Base


class OTP(Base):
    __tablename__ = "otp"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, index=True, nullable=False)
    otp = Column(String, nullable=False)
    expiry = Column(DateTime, nullable=False)
