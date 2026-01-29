from sqlalchemy.orm import Session
from services.customer_grpc_client import CustomerGrpcClient
from services.cognito_service import CognitoService
from models.user_role import UserRole
from models.user import User
from models.admin_profile import AdminProfile
from models.user_role import UserRole
from models.role import Role
from models.role_permission import RolePermission
from models.permission import Permission


class UserService:
    def __init__(self):
        self.customer_client = CustomerGrpcClient()
        self.cognito_service = CognitoService()

    def create_user(self, db: Session, data, user_id: str, auth_user: str):
        if not data.email and not data.phone:
            raise ValueError("Email or phone is required")

        # 🔐 Role mapping
        role_id = 1 if data.user_type == "admin" else 2

        # 1️⃣ Create or update USER table
        user = db.query(User).filter(User.user_id == user_id).first()

        if not user:
            user = User(
                user_id=user_id,
                email=data.email,
                phone=data.phone,
                status="ACTIVE",
            )
            db.add(user)
        else:
            # Update missing fields only
            if data.email:
                user.email = data.email
            if data.phone:
                user.phone = data.phone

        # 2️⃣ Assign role (idempotent)
        role_exists = (
            db.query(UserRole)
            .filter(UserRole.user_id == user_id, UserRole.role_id == role_id)
            .first()
        )

        if not role_exists:
            db.add(UserRole(user_id=user_id, role_id=role_id))

        # 3️⃣ Customer → call Customer service
        if data.user_type == "customer":
            self.customer_client.create_customer(user_id)

        # 4️⃣ Admin → create admin profile
        if data.user_type == "admin":
            admin_exists = (
                db.query(AdminProfile).filter(AdminProfile.user_id == user_id).first()
            )

            if not admin_exists:
                admin_profile = AdminProfile(
                    user_id=user_id,
                    first_name=data.first_name,
                    last_name=data.last_name,
                )
                db.add(admin_profile)

        db.commit()

        # 5️⃣ Update Cognito attributes (auth_user = Cognito username / sub)
        self.cognito_service.update_user_attributes(
            user_id=auth_user,
            email=data.email,
            phone=data.phone,
        )

        return user_id

    def get_profile(self, db: Session, user_id: str):
        # 1️⃣ User
        user = db.query(User).filter(User.user_id == user_id).first()

        if not user:
            return None

        # 2️⃣ User Roles
        user_roles = db.query(UserRole).filter(UserRole.user_id == user_id).all()

        roles_data = []

        for ur in user_roles:
            # 3️⃣ Role
            role = db.query(Role).filter(Role.role_id == ur.role_id).first()

            if not role:
                continue

            # 4️⃣ Role Permissions
            role_permissions = (
                db.query(RolePermission)
                .filter(RolePermission.role_id == role.role_id)
                .all()
            )

            permissions = (
                db.query(Permission)
                .filter(
                    Permission.permission_id.in_(
                        [rp.permission_id for rp in role_permissions]
                    )
                )
                .all()
            )

            roles_data.append(
                {
                    "role_id": role.role_id,
                    "role_name": role.role_name,
                    "permissions": [
                        {
                            "permission_id": p.permission_id,
                            "permission_name": p.permission_name,
                        }
                        for p in permissions
                    ],
                }
            )

        return {
            "user": {
                "user_id": user.user_id,
                "email": user.email,
                "phone": user.phone,
                "status": user.status,
            },
            "roles": roles_data,
        }
