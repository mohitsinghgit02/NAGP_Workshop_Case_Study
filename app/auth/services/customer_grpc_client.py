import grpc

# import customer_pb2, customer_pb2_grpc


class CustomerGrpcClient:
    def __init__(self):
        self.channel = grpc.insecure_channel("customer:50051")
        # self.stub = customer_pb2_grpc.CustomerServiceStub(self.channel)

    def create_customer(self, user_id: str):
        # self.stub.AddCustomer(customer_pb2.AddCustomerRequest(user_id=user_id))
        print(f"gRPC call to create customer with user_id: {user_id}")
