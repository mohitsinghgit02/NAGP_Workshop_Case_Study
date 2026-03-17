import random
import uuid
import os
from fastapi import BackgroundTasks
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from models.otp import OTP
from models.user import User
from models.user_role import UserRole
from common.email_service import send_otp_email
from services.cognito_service import CognitoService


class OTPService:
    OTP_EXPIRY_MINUTES = 5

    def send_otp(self, db: Session, identifier: str, background_tasks: BackgroundTasks):
        otp = str(random.randint(100000, 999999))
        expiry = datetime.utcnow() + timedelta(minutes=self.OTP_EXPIRY_MINUTES)

        otp_entry = OTP(identifier=identifier, otp=otp, expiry=expiry)

        db.add(otp_entry)
        print(f"[LOCAL OTP] {identifier}: {otp}")
        # send email in background
        background_tasks.add_task(send_otp_email, identifier, otp)
        db.commit()
        return otp

    def verify_otp(self, db: Session, identifier: str, otp: str) -> dict:
        cognito = CognitoService()

        # 1️⃣ Validate OTP
        otp_row = (
            db.query(OTP)
            .filter(OTP.identifier == identifier)
            .order_by(OTP.id.desc())
            .first()
        )

        if not otp_row:
            return {"success": False, "message": "OTP not found"}

        if otp_row.otp != otp or datetime.utcnow() >= otp_row.expiry:
            return {"success": False, "message": "Invalid or expired OTP"}

        # 2️⃣ Check user
        user = (
            db.query(User)
            .filter((User.email == identifier) | (User.phone == identifier))
            .first()
        )

        if not user:
            user_id = str(uuid.uuid4())
            email = identifier if "@" in identifier else None
            phone = identifier if "@" not in identifier else None

            user = User(user_id=user_id, email=email, phone=phone, status="ACTIVE")

            db.add(user)
            db.commit()

            status = "NEW_USER"
        else:
            user_id = user.user_id

            role = db.query(UserRole).filter(UserRole.user_id == user_id).first()

            print(role)

            status = "EXISTING_USER" if role else "NEW_USER"

        # 3️⃣ Cognito token
        username = cognito.ensure_user_exists(identifier, user_id)
        token = cognito.generate_token(username)

        return {"success": True, "status": status, "user_id": user_id, "token": token}
