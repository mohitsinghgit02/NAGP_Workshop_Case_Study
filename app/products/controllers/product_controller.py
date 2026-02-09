# app/customer/controllers/customer_controller.py
from fastapi import APIRouter, Depends, Header, HTTPException
from services.product_service import ProductService
from common.router_decorator import make_router
from common.http_decorators import get

router = APIRouter(prefix="/product", tags=["Product"])


@make_router(router)
class ProductController:
    def __init__(self):
        self.product_service = ProductService()

    @get("/fetch", summary="Fetch Customers")
    def fetch_customers(self, x_id_token: str = Header(..., alias="X-Id-Token")):
        """
        Fetch customers and call auth-grpc with ID token.
        Header: X-Id-Token: <id_token>
        """
        # Call CustomerService
        response = self.product_service.get_customers(id_token=x_id_token)
        if not response:
            raise HTTPException(
                status_code=500, detail="Failed to fetch user from auth-grpc"
            )

        return {
            "message": "Customer fetched successfully",
            "user_email": response.user.email,
            "name": "Mohit Singh",
            "roles": [r.role_name for r in response.roles],
        }
