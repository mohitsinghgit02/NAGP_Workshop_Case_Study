import grpc
from sqlalchemy.orm import Session
from grpc_api.user_profile import user_profile_pb2, user_profile_pb2_grpc
from services.user_service import UserService
from db.sqlite import SessionLocal
from common.validate_token import get_user_id_from_token


class UserProfileGrpcService(user_profile_pb2_grpc.UserProfileServiceServicer):
    """
    gRPC service for fetching user profile.
    Validates ID token using shared token_validate.py logic.
    """

    def __init__(self):
        self.user_service = UserService()

    def GetUserProfile(self, request, context):
        """
        Expects:
        - request.access_token  (currently optional if needed)
        - request.id_token
        Returns:
        - user info
        - roles info
        - permissions
        """
        db: Session = SessionLocal()

        try:
            # Extract user_id using your common token validator
            # You can pass the token as a header in request.id_token
            user_id = get_user_id_from_token(x_id_token=request.id_token)

            # Fetch user profile from DB
            profile = self.user_service.get_profile(db, user_id)

            if not profile:
                context.abort(grpc.StatusCode.NOT_FOUND, "User not found")

            # Map DB results to protobuf objects
            return user_profile_pb2.UserProfileResponse(
                success=True,
                user=user_profile_pb2.User(
                    user_id=profile["user"]["user_id"],
                    email=profile["user"]["email"] or "",
                    phone=profile["user"]["phone"] or "",
                    status=profile["user"]["status"],
                ),
                roles=[
                    user_profile_pb2.Role(
                        role_id=r["role_id"],
                        role_name=r["role_name"],
                        permissions=[
                            user_profile_pb2.Permission(
                                permission_id=p["permission_id"],
                                permission_name=p["permission_name"],
                            )
                            for p in r["permissions"]
                        ],
                    )
                    for r in profile["roles"]
                ],
            )

        except grpc.RpcError:
            raise

        except Exception as e:
            context.abort(grpc.StatusCode.UNAUTHENTICATED, str(e))

        finally:
            db.close()
