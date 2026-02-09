from pydantic import BaseModel


class SendOTPRequest(BaseModel):
    identifier: str  # email or phone


class VerifyOTPRequest(BaseModel):
    identifier: str
    otp: str
