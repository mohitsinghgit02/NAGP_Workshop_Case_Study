from concurrent import futures
import grpc
from grpc_reflection.v1alpha import reflection

from grpc_api.user_profile.user_profile_service import UserProfileGrpcService
from grpc_api.user_profile.user_profile_pb2_grpc import (
    add_UserProfileServiceServicer_to_server,
)
from grpc_api.user_profile import user_profile_pb2


def serve(port: int = 50051):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    add_UserProfileServiceServicer_to_server(UserProfileGrpcService(), server)

    SERVICE_NAMES = (
        user_profile_pb2.DESCRIPTOR.services_by_name["UserProfileService"].full_name,
        reflection.SERVICE_NAME,
    )
    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"✅ gRPC server running on port {port}")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
