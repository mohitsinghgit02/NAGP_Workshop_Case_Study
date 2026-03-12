# app/customer/controllers/customer_controller.py
from fastapi import APIRouter, Depends, Header, HTTPException
from services.customer_service import CustomerService
from common.router_decorator import make_router
from common.http_decorators import get, post
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
