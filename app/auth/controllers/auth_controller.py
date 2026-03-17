from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from schemas.auth_schema import SendOTPRequest, VerifyOTPRequest
from services.otp_service import OTPService
from services.cognito_service import CognitoService
from common.router_decorator import make_router
from common.http_decorators import post
from sqlalchemy.orm import Session
from db.sqlite import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


@make_router(router)
class AuthController:
    def __init__(self):
        self.otp_service = OTPService()

    @post("/send-otp")
    def send_otp(
        self,
        request: SendOTPRequest,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db),
    ):
        otp = self.otp_service.send_otp(db, request.identifier, background_tasks)
        return {
            "success": True,
            "message": f"OTP sent successfully with updated code",
        }

    @post("/verify-otp")
    def verify_otp(self, request: VerifyOTPRequest, db: Session = Depends(get_db)):
        """
        - Verifies OTP
        - Creates or fetches user
        - Syncs with Cognito
        - Returns token + user status
        """
        result = self.otp_service.verify_otp(
            db=db,
            identifier=request.identifier,
            otp=request.otp,
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=400,
                detail=result.get("message", "OTP verification failed"),
            )

        return {
            "success": True,
            "status": result["status"],  # EXISTING_USER | NEW_USER
            "user_id": result["user_id"],
            "token": result["token"],
        }
