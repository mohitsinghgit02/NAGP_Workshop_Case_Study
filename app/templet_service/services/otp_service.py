import random
from datetime import datetime, timedelta
from db.sqlite import get_db_connection


class OTPService:
    OTP_EXPIRY_MINUTES = 5

    def send_otp(self, identifier: str):
        otp = str(random.randint(100000, 999999))
        expiry = datetime.utcnow() + timedelta(minutes=self.OTP_EXPIRY_MINUTES)

        conn = get_db_connection()
        conn.execute(
            "INSERT INTO otp (identifier, otp, expiry) VALUES (?, ?, ?)",
            (identifier, otp, expiry),
        )
        conn.commit()

        # MSG91 integration placeholder
        print(f"[LOCAL OTP] {identifier}: {otp}")

    def verify_otp(self, identifier: str, otp: str) -> bool:
        conn = get_db_connection()
        row = conn.execute(
            "SELECT otp, expiry FROM otp WHERE identifier=? ORDER BY id DESC LIMIT 1",
            (identifier,),
        ).fetchone()

        if not row:
            return False

        stored_otp, expiry = row
        return stored_otp == otp and datetime.utcnow() < datetime.fromisoformat(expiry)
