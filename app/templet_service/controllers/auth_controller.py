from fastapi import APIRouter, Depends, HTTPException
from schemas.auth_schema import SendOTPRequest, VerifyOTPRequest
from services.otp_service import OTPService
from services.cognito_service import CognitoService
from common.router_decorator import make_router
from common.http_decorators import post

router = APIRouter(prefix="/auth", tags=["Auth"])


@make_router(router)
class AuthController:
    def __init__(self):
        self.otp_service = OTPService()
        self.cognito_service = CognitoService()

    @post("/send-otp")
    def send_otp(self, request: SendOTPRequest):
        self.otp_service.send_otp(request.identifier)
        return {"message": "OTP sent successfully"}

    @post("/verify-otp")
    def verify_otp(self, request: VerifyOTPRequest):
        if not self.otp_service.verify_otp(request.identifier, request.otp):
            raise HTTPException(status_code=400, detail="Invalid OTP")

        self.cognito_service.create_or_get_user(request.identifier)
        return {"message": "Authentication successful"}
