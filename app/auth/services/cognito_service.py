import boto3
import os
from botocore.exceptions import ClientError

client = boto3.client(
    "cognito-idp",
    region_name=os.getenv("AWS_REGION"),
)


class CognitoService:
    def __init__(self):
        self.user_pool_id = os.getenv("COGNITO_POOL_ID")
        self.client_id = os.getenv("COGNITO_CLIENT_ID")
        self.system_password = os.getenv("COGNITO_SYSTEM_PASSWORD")

    def ensure_user_exists(self, identifier: str, user_id: str) -> str:
        """
        Ensures user exists in Cognito.
        Adds custom:user_id attribute to include DB user_id in token.
        Returns Cognito username.
        """
        if "@" in identifier:
            username = identifier
            attributes = [
                {"Name": "email", "Value": identifier},
                {"Name": "email_verified", "Value": "true"},
                {"Name": "custom:user_id", "Value": user_id},
            ]
        else:
            username = f"+91{identifier}"
            attributes = [
                {"Name": "phone_number", "Value": username},
                {"Name": "phone_number_verified", "Value": "true"},
                {"Name": "custom:user_id", "Value": user_id},
            ]

        try:
            client.admin_create_user(
                UserPoolId=self.user_pool_id,
                Username=username,
                UserAttributes=attributes,
                TemporaryPassword=self.system_password,
                MessageAction="SUPPRESS",
            )

            client.admin_set_user_password(
                UserPoolId=self.user_pool_id,
                Username=username,
                Password=self.system_password,
                Permanent=True,
            )

        except ClientError as e:
            if e.response["Error"]["Code"] != "UsernameExistsException":
                raise
            # If user exists, ensure custom:user_id is updated
            client.admin_update_user_attributes(
                UserPoolId=self.user_pool_id,
                Username=username,
                UserAttributes=[{"Name": "custom:user_id", "Value": user_id}],
            )

        return username

    def generate_token(self, username: str) -> dict:
        response = client.admin_initiate_auth(
            UserPoolId=self.user_pool_id,
            ClientId=self.client_id,
            AuthFlow="ADMIN_NO_SRP_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": self.system_password,
            },
        )

        auth = response["AuthenticationResult"]

        return {
            "access_token": auth["AccessToken"],
            "id_token": auth["IdToken"],
            "refresh_token": auth.get("RefreshToken"),
            "expires_in": auth["ExpiresIn"],
        }

    def update_user_attributes(
        self, user_id: str, email: str | None, phone: str | None
    ):
        attributes = []

        if email:
            attributes.extend(
                [
                    {"Name": "email", "Value": email},
                    {"Name": "email_verified", "Value": "true"},
                ]
            )

        if phone:
            phone_value = phone if phone.startswith("+") else f"+91{phone}"
            attributes.extend(
                [
                    {"Name": "phone_number", "Value": phone_value},
                    {"Name": "phone_number_verified", "Value": "true"},
                ]
            )

        if attributes:
            client.admin_update_user_attributes(
                UserPoolId=self.user_pool_id,
                Username=user_id,
                UserAttributes=attributes,
            )
