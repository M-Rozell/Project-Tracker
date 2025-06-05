# roles.py
ROLE_PERMISSIONS = {
    "admin": {
        "create_project",
        "delete_project",
        "edit_project",
        "view_all",
        "manage_users",
        "add_database_table"
    },
    "manager": {
        "create_project",
        "edit_project",
        "view_all"
    },
    "user": {
        "view_own"
    },
}
