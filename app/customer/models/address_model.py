from sqlalchemy import Column, String, ForeignKey
from db.sqlite import Base


class Address(Base):

    __tablename__ = "CUSTOMER_DB_ADDRESS"

    address_id = Column(String, primary_key=True)

    customer_id = Column(String, ForeignKey("CUSTOMER_DB_CUSTOMER.customer_id"))

    line1 = Column(String)
    line2 = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    postal_code = Column(String)
