import firebase_admin
from firebase_admin import credentials, db, firestore
from config import settings
import json
from typing import Any, Optional, List
import os

# Initialize Firebase
firestore_client = None

try:
    # Check if serviceAccount.json exists in the api directory
    service_account_path = os.path.join(os.path.dirname(__file__), 'serviceAccount.json')
    
    if os.path.exists(service_account_path):
        # Use serviceAccount.json if it exists
        cred = credentials.Certificate(service_account_path)
    elif settings.firebase_private_key and settings.firebase_client_email and settings.firebase_project_id:
        # Use environment variables if available
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": settings.firebase_project_id,
            "private_key": settings.firebase_private_key.replace('\\n', '\n'),
            "client_email": settings.firebase_client_email,
            "client_id": "0",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fir-gia-95889.iam.gserviceaccount.com"
        })
    else:
        raise ValueError("No Firebase credentials found")
    
    firebase_admin.initialize_app(cred)
    firestore_client = firestore.client()
    print("✓ Firebase initialized successfully")
except ValueError as e:
    # Already initialized or missing credentials
    if "already exists" in str(e):
        try:
            firestore_client = firestore.client()
            print("✓ Firebase already initialized")
        except Exception as e2:
            print(f"⚠ Firebase initialization error: {e2}")
    else:
        print(f"⚠ Firebase credentials not available: {e}")
        print("  Set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env file")
except Exception as e:
    print(f"✗ Firebase initialization failed: {e}")
    print(f"  Make sure serviceAccount.json exists or .env has Firebase credentials")


class FirebaseService:
    def __init__(self):
        if firestore_client is None:
            raise RuntimeError("Firebase not initialized. Check serviceAccount.json or .env file.")
        self.db = firestore_client

    def add_document(self, collection: str, data: dict) -> str:
        """Add a new document and return its ID"""
        doc_ref = self.db.collection(collection).document()
        doc_ref.set(data)
        return doc_ref.id

    def get_document(self, collection: str, doc_id: str) -> Optional[dict]:
        """Get a single document by ID"""
        doc = self.db.collection(collection).document(doc_id).get()
        if doc.exists:
            return {**doc.to_dict(), "id": doc.id}
        return None

    def update_document(self, collection: str, doc_id: str, data: dict) -> bool:
        """Update a document"""
        self.db.collection(collection).document(doc_id).update(data)
        return True

    def delete_document(self, collection: str, doc_id: str) -> bool:
        """Delete a document"""
        self.db.collection(collection).document(doc_id).delete()
        return True

    def get_collection(self, collection: str, limit: int = 100, offset: int = 0) -> List[dict]:
        """Get all documents from a collection"""
        docs = self.db.collection(collection).limit(limit).offset(offset).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    def query_collection(
        self, collection: str, field: str, operator: str, value: Any, limit: int = 100
    ) -> List[dict]:
        """Query collection with a condition"""
        query = self.db.collection(collection)
        
        if operator == "==":
            query = query.where(field, "==", value)
        elif operator == "<":
            query = query.where(field, "<", value)
        elif operator == ">":
            query = query.where(field, ">", value)
        elif operator == "<=":
            query = query.where(field, "<=", value)
        elif operator == ">=":
            query = query.where(field, ">=", value)
        
        docs = query.limit(limit).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    def batch_write(self, operations: List[tuple]) -> bool:
        """Execute batch write operations"""
        batch = self.db.batch()
        
        for operation in operations:
            if operation[0] == "set":
                batch.set(self.db.collection(operation[1]).document(operation[2]), operation[3])
            elif operation[0] == "update":
                batch.update(self.db.collection(operation[1]).document(operation[2]), operation[3])
            elif operation[0] == "delete":
                batch.delete(self.db.collection(operation[1]).document(operation[2]))
        
        batch.commit()
        return True


firebase_service = FirebaseService()
