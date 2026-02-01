import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
import jwt
from config import settings


class AuthService:
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """Verify Firebase JWT token"""
        try:
            decoded = auth.verify_id_token(token)
            return decoded
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    @staticmethod
    def create_user(email: str, password: str, display_name: str = "") -> Dict[str, str]:
        """Create a new user"""
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=display_name
            )
            return {"uid": user.uid, "email": user.email}
        except auth.EmailAlreadyExistsError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    @staticmethod
    def get_user(uid: str) -> Dict[str, Any]:
        """Get user by UID"""
        try:
            user = auth.get_user(uid)
            return {
                "uid": user.uid,
                "email": user.email,
                "display_name": user.display_name,
                "photo_url": user.photo_url
            }
        except auth.UserNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

    @staticmethod
    def delete_user(uid: str) -> bool:
        """Delete a user"""
        try:
            auth.delete_user(uid)
            return True
        except auth.UserNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

    @staticmethod
    def set_custom_claims(uid: str, claims: Dict[str, Any]) -> bool:
        """Set custom claims for a user (for roles)"""
        try:
            auth.set_custom_user_claims(uid, claims)
            return True
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )


auth_service = AuthService()
