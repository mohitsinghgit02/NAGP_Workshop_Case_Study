from dataclasses import dataclass
from datetime import datetime


@dataclass
class OTP:
    id: int | None
    identifier: str  # email or phone
    otp: str
    expiry: datetime
