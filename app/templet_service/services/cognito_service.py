import boto3, os

client = boto3.client("cognito-idp", region_name=os.getenv("AWS_REGION"))


class CognitoService:
    def create_or_get_user(self, identifier: str):
        try:
            client.admin_create_user(
                UserPoolId=os.getenv("COGNITO_POOL_ID"),
                Username=phone,
                UserAttributes=[{"Name": "phone_number", "Value": "+91" + phone}],
                MessageAction="SUPPRESS",
            )
        except:
            pass
