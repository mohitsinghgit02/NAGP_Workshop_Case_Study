# app/customer/controllers/customer_controller.py
from fastapi import APIRouter, Depends, Header, HTTPException
from services.customer_service import CustomerService
from common.router_decorator import make_router
from common.http_decorators import get, post
from common.validate_token import get_user_id_from_token
from schemas.auth_schema import CartUpdateRequest
from sqlalchemy.orm import Session
from db.sqlite import get_db

router = APIRouter(prefix="/customer", tags=["Customer"])


@make_router(router)
class CustomerController:
    def __init__(self):
        self.customer_service = CustomerService()

    @get("/fetch", summary="Fetch Customers")
    def fetch_customers(
        self,
        db: Session = Depends(get_db),
        x_id_token: str = Header(..., alias="X-Id-Token"),
    ):
        """
        Fetch customers and call auth-grpc with ID token.
        Header: X-Id-Token: <id_token>
        """
        # Call CustomerService
        response = self.customer_service.get_customers(db=db, id_token=x_id_token)

        if not response:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch user from auth-grpc",
            )

        return {
            "message": "Customer fetched successfully",
            "data": response,
        }

    @post("/create", summary="Create Customer")
    def create_customers(
        self,
        user_id: str,
        data: dict,
        db: Session = Depends(get_db),
    ):
        """
        Create a new customer and address
        """

        response = self.customer_service.create_customer(db, user_id, data)

        if not response:
            raise HTTPException(status_code=500, detail="Failed to create customer")

        return {"message": "Customer created successfully", "customer_id": response}

    @get("/liked-products")
    def get_liked_products(
        self,
        user_id: str = Depends(get_user_id_from_token),
        db: Session = Depends(get_db),
    ):
        response = self.customer_service.get_liked_products(db, user_id)
        if response is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch liked product",
            )

        return {
            "message": "Liked product fetch successfully",
            "data": response,
        }

    @post("/liked-product/{product_id}", summary="Like or Unlike Product")
    def toggle_liked_product(
        self,
        product_id: str,
        db: Session = Depends(get_db),
        user_id: str = Depends(get_user_id_from_token),
    ):
        """
        Toggle product like/unlike for a user.
        Header: X-Id-Token: <id_token>
        """

        response = self.customer_service.toggle_liked_product(
            db=db,
            user_id=user_id,
            product_id=product_id,
        )

        if response is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to update liked product",
            )

        return {
            "message": "Liked product updated successfully",
            "data": response,
        }

    @get("/cart")
    def get_cart_products(
        self,
        user_id: str = Depends(get_user_id_from_token),
        db: Session = Depends(get_db),
    ):
        return self.customer_service.get_cart_products(db, user_id)

    @post("/cart/{product_id}", summary="Add or Update Cart Product")
    def update_cart_product(
        self,
        product_id: str,
        payload: CartUpdateRequest,
        db: Session = Depends(get_db),
        user_id: str = Depends(get_user_id_from_token),
    ):
        """
        Add or update cart product.

        quantity > 0 → add/update product
        quantity = 0 → remove product
        """
        response = self.customer_service.update_cart_product(
            db=db,
            product_id=product_id,
            quantity=payload.quantity,
            user_id=user_id,
        )

        if response is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to update cart",
            )

        return {
            "message": "Cart updated successfully",
            "data": response,
        }
