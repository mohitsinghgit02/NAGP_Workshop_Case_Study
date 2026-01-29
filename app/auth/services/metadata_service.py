import json
from pathlib import Path
from db.sqlite import get_db_connection

METADATA_PATH = Path(__file__).resolve().parent.parent / "metadata" / "metadata.json"


class MetadataService:
    def refresh_metadata(self):
        if not METADATA_PATH.exists():
            raise FileNotFoundError("Metadata JSON not found")

        with open(METADATA_PATH) as f:
            metadata = json.load(f)

        conn = get_db_connection()
        cur = conn.cursor()

        # Roles
        for role in metadata["roles"]:
            cur.execute(
                """
                INSERT OR IGNORE INTO role (role_id, role_name)
                VALUES (?, ?)
                """,
                (role["role_id"], role["role_name"]),
            )

        # Permissions
        for perm in metadata["permissions"]:
            cur.execute(
                """
                INSERT OR IGNORE INTO permission (permission_id, permission_name)
                VALUES (?, ?)
                """,
                (perm["permission_id"], perm["permission_name"]),
            )

        # Role-Permissions
        for rp in metadata["role_permissions"]:
            cur.execute(
                """
                INSERT OR IGNORE INTO role_permission (role_id, permission_id)
                VALUES (?, ?)
                """,
                (rp["role_id"], rp["permission_id"]),
            )

        conn.commit()
        conn.close()

        return {
            "roles": len(metadata["roles"]),
            "permissions": len(metadata["permissions"]),
            "role_permissions": len(metadata["role_permissions"]),
        }
