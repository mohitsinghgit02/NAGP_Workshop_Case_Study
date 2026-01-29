from fastapi import Depends, APIRouter, HTTPException
from schemas.auth_schema import AddUserRequest
from services.user_service import UserService
from common.router_decorator import make_router
from common.http_decorators import post, get
from common.validate_token import get_auth_user, get_user_id_from_token
from sqlalchemy.orm import Session
from db.sqlite import get_db

router = APIRouter(prefix="/auth/user", tags=["Auth"])


@make_router(router)
class UserController:
    def __init__(self):
        self.user_service = UserService()

    @post("/add", summary="Create Admin or Customer User")
    def add_user(
        self,
        request: AddUserRequest,
        auth_user: str = Depends(get_auth_user),
        user_id: str = Depends(get_user_id_from_token),
        db: Session = Depends(get_db),
    ):
        try:
            user_id = self.user_service.create_user(db, request, user_id, auth_user)
            return {"user_id": user_id, "status": "CREATED"}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @get("/profile", summary="get User Profile")
    def get_profile(
        self,
        user_id: str = Depends(get_user_id_from_token),
        db: Session = Depends(get_db),
    ):
        try:
            profile = self.user_service.get_profile(db, user_id)
            return {"user_profile": profile, "success": True}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
