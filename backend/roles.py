# roles.py

ROLE_PERMISSIONS = {
    "admin": {"create_project", "delete_project", "view_all", "manage_users"},
    "manager": {"create_project", "view_all"},
    "user": {"view_own"},
}
