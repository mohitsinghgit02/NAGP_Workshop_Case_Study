from fastapi import Depends, Header, HTTPException
from typing import Optional
from jose import jwt
import requests
import os

AWS_REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("COGNITO_POOL_ID")
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

COGNITO_ISSUER = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS_URL = f"{COGNITO_ISSUER}/.well-known/jwks.json"

jwks = requests.get(JWKS_URL).json()


def get_auth_user(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    try:
        # Get key id from token header
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]

        # Find matching public key
        key = next(k for k in jwks["keys"] if k["kid"] == kid)

        # Decode & verify token
        decoded = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=COGNITO_ISSUER,
        )

        # Validate token type
        if decoded.get("token_use") not in ("access", "id"):
            raise HTTPException(status_code=401, detail="Invalid token type")

        # Extract user_id
        user_id = decoded.get("custom:user_id") or decoded.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found in token")

        return user_id

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_user_id_from_token(
    x_id_token: Optional[str] = Header(None, alias="X-Id-Token")
) -> str:
    if not x_id_token:
        raise HTTPException(status_code=401, detail="ID token header missing")

    try:
        # Get KID
        unverified_header = jwt.get_unverified_header(x_id_token)
        kid = unverified_header["kid"]

        # Match public key
        key = next(k for k in jwks["keys"] if k["kid"] == kid)

        # Decode ID token
        decoded = jwt.decode(
            x_id_token,
            key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=COGNITO_ISSUER,
        )

        # Ensure correct token type
        if decoded.get("token_use") != "id":
            raise HTTPException(status_code=401, detail="Invalid token type")

        # Extract custom user id
        user_id = decoded.get("custom:user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found in token")

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="ID token expired")

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid ID token")
