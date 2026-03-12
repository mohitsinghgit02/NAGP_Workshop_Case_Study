# app/customer/services/customer_service.py
import os
from sqlalchemy.orm import Session
import uuid
from models.customer_model import Customer
from models.address_model import Address
import grpc
from grpc_client import (
    user_profile_pb2,
    user_profile_pb2_grpc,
)


class CustomerService:
    def __init__(self):
        # If needed, you can also read host/port from env vars
        self.grpc_host = f"{os.getenv('AUTH_GRPC_HOST')}:{os.getenv('AUTH_GRPC_PORT')}"
        # auth:50051  # Kubernetes service + port
        self.channel = grpc.insecure_channel(self.grpc_host)
        self.stub = user_profile_pb2_grpc.UserProfileServiceStub(self.channel)

    def get_customers(self, db: Session, id_token: str):
        """
        Fetch user from auth-grpc and customer details from DB
        """

        print("get Customer Service called")

        request = user_profile_pb2.UserProfileRequest(
            id_token=id_token,
        )

        try:
            metadata = [("x-id-token", id_token)]

            # -------- CALL AUTH GRPC --------
            response = self.stub.GetUserProfile(request, metadata=metadata)
            print(f"Received response from auth-grpc {response}")
            if not response.success:
                return None

            user = response.user
            user_id = user.user_id

            print(f"User info from auth-grpc: {user.email}")

            try:

                customer = (
                    db.query(Customer).filter(Customer.user_id == user_id).first()
                )

                if not customer:
                    return {
                        "user": {
                            "user_id": user.user_id,
                            "email": user.email,
                            "phone": user.phone,
                            "status": user.status,
                        },
                        "roles": [role.role_name for role in response.roles],
                        "customer": None,
                        "address": None,
                    }

                address = (
                    db.query(Address)
                    .filter(Address.customer_id == customer.customer_id)
                    .first()
                )

                result = {
                    "user": {
                        "user_id": user.user_id,
                        "email": user.email,
                        "phone": user.phone,
                        "status": user.status,
                    },
                    "roles": [role.role_name for role in response.roles],
                    "customer": {
                        "customer_id": customer.customer_id,
                        "first_name": customer.first_name,
                        "last_name": customer.last_name,
                    },
                    "address": None,
                }

                if address:
                    result["address"] = {
                        "line1": address.line1,
                        "line2": address.line2,
                        "city": address.city,
                        "state": address.state,
                        "country": address.country,
                        "postal_code": address.postal_code,
                    }

                return result

            finally:
                db.close()

        except grpc.RpcError as e:
            print(f"gRPC error: {e.code()} - {e.details()}")
            return None

    def create_customer(self, db: Session, user_id: str, data: dict):
        try:
            print(
                f"gRPC create_customer called with user_id: {user_id} and data: {data}"
            )
            customer_id = str(uuid.uuid4())

            customer = Customer(
                customer_id=customer_id,
                user_id=user_id,
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
            )

            print(f"Customer object created: {customer}")
            db.add(customer)

            # Optional address creation
            if data.get("city") or data.get("postal_code"):

                address = Address(
                    address_id=str(uuid.uuid4()),
                    customer_id=customer_id,
                    city=data.get("city"),
                    postal_code=data.get("postal_code"),
                    country=data.get("country", "India"),
                )
                print(f"Address object created: {address}")
                db.add(address)

            db.commit()

            return customer_id

        except Exception as e:
            print(f"Error creating customer: {e}")
            db.rollback()
            raise e
