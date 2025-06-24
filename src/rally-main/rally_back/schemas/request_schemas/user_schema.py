from typing import Optional
from pydantic import BaseModel

class UserAuth(BaseModel):
    """the request schema for authentication"""
    email: str
    password: str
    remember_me: bool
    recaptcha_token: str

class UserSchema(BaseModel):
    """the request schema for user"""
    email: str
    phone_number: str
    is_planner: bool
