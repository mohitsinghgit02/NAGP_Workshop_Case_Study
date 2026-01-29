# app/customer/services/customer_service.py
import grpc
from grpc_client import (
    user_profile_pb2,
    user_profile_pb2_grpc,
)  # your copied proto files
import os


class CustomerService:
    def __init__(self):
        # If needed, you can also read host/port from env vars
        self.grpc_host = f"{os.getenv('AUTH_GRPC_HOST')}:{os.getenv('AUTH_GRPC_PORT')}"
        # auth:50051  # Kubernetes service + port
        self.channel = grpc.insecure_channel(self.grpc_host)
        self.stub = user_profile_pb2_grpc.UserProfileServiceStub(self.channel)

    def get_customers(self, id_token: str):
        """
        Fetch customers and user info from auth-grpc
        """
        print("get Customer Service called")

        # Example: calling auth-grpc for current user
        request = user_profile_pb2.UserProfileRequest(
            id_token=id_token,  # send the ID token
        )

        try:
            metadata = [("x-id-token", id_token)]
            response = self.stub.GetUserProfile(request, metadata=metadata)
            print(f"User info from auth-grpc: {response.user.email}")
            return response

        except grpc.RpcError as e:
            print(f"gRPC error: {e.code()} - {e.details()}")
            return None
