import grpc
import os

from grpc_client.customer import customer_pb2, customer_pb2_grpc


class CustomerGrpcClient:
    def __init__(self):
        self.grpc_host = (
            f"{os.getenv('CUSTOMER_GRPC_HOST')}:{os.getenv('CUSTOMER_GRPC_PORT')}"
        )

        # Example: customer-service:50052
        self.channel = grpc.insecure_channel(self.grpc_host)

        self.stub = customer_pb2_grpc.CustomerServiceStub(self.channel)

    def create_customer(self, user_id: str, data: dict):

        print(f"gRPC call to create customer with user_id: {user_id}")

        try:

            request = customer_pb2.CreateCustomerRequest(
                user_id=user_id,
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", ""),
                city=data.get("city", ""),
                postal_code=data.get("pin_code", ""),
                country=data.get("country", "India"),
            )

            response = self.stub.CreateCustomer(request)

            if response.success:
                print(f"Customer created: {response.customer_id}")
                return response.customer_id
            else:
                print(f"Customer creation failed: {response.message}")
                return None

        except grpc.RpcError as e:
            print(f"gRPC error: {e.code()} - {e.details()}")
            return None
