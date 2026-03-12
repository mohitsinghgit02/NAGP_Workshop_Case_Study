from sqlalchemy import Column, String, DateTime, text
from db.sqlite import Base


class Customer(Base):

    __tablename__ = "CUSTOMER_DB_CUSTOMER"

    customer_id = Column(String, primary_key=True)
    user_id = Column(String)
    first_name = Column(String)
    last_name = Column(String)

    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
