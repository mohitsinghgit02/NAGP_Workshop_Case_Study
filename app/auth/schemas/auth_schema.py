from pydantic import BaseModel
from typing import Optional


class SendOTPRequest(BaseModel):
    identifier: str  # email or phone


class VerifyOTPRequest(BaseModel):
    identifier: str
    otp: str


class AddUserRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    user_type: str  # admin | customer
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    pin_code: Optional[str] = None
    city: Optional[str] = None
