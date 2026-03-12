import grpc
from concurrent import futures

from grpc_api import customer_pb2
from grpc_api import customer_pb2_grpc

from db.sqlite import SessionLocal
from services.customer_service import CustomerService


class CustomerServiceServicer(customer_pb2_grpc.CustomerServiceServicer):

    def __init__(self):
        self.customer_service = CustomerService()

    def CreateCustomer(self, request, context):

        db = SessionLocal()

        try:
            data = {
                "first_name": request.first_name,
                "last_name": request.last_name,
                "city": request.city,
                "postal_code": request.postal_code,
                "country": request.country,
            }

            customer_id = self.customer_service.create_customer(
                db=db,
                user_id=request.user_id,
                data=data,
            )

            return customer_pb2.CreateCustomerResponse(
                success=True,
                customer_id=customer_id,
                message="Customer created successfully",
            )

        except Exception as e:
            print(f"Error creating customer: {e}")
            return customer_pb2.CreateCustomerResponse(
                success=False,
                customer_id="",
                message=str(e),
            )

        finally:
            db.close()


def grpc_serve(port=50052):

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    customer_pb2_grpc.add_CustomerServiceServicer_to_server(
        CustomerServiceServicer(), server
    )

    server.add_insecure_port(f"[::]:{port}")

    server.start()

    print(f"🚀 Customer gRPC server running on port {port}")

    server.wait_for_termination()
