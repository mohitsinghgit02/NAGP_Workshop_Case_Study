from sqlalchemy import Column, String
from db.sqlite import Base


class LikedProduct(Base):

    __tablename__ = "CUSTOMER_DB_LIKED_PRODUCT"

    liked_id = Column(String, primary_key=True)

    user_id = Column(String)

    product_id = Column(String)
