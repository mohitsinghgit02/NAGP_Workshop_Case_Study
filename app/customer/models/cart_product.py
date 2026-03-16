from sqlalchemy import Column, String, Integer
from db.sqlite import Base


class CartProduct(Base):

    __tablename__ = "CUSTOMER_DB_CART_PRODUCT"

    cart_id = Column(String, primary_key=True)

    user_id = Column(String)

    product_id = Column(String)

    quantity = Column(Integer, default=1)
