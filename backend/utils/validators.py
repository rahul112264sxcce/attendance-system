import re


def validate_required_string(value: str, field_name: str):
    if value.strip() == "":
        raise ValueError(f"{field_name} is required")
    return value


def validate_email(value: str):

    if value.strip() == "":
        raise ValueError("Email is required")

    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if not re.match(email_pattern, value):
        raise ValueError("Invalid email")

    return value


def validate_password(value: str):
    if value.strip() == "":
        raise ValueError("Password is required")
    if len(value) < 3:
        raise ValueError("min 3 characters")
    return value
