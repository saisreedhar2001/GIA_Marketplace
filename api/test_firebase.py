#!/usr/bin/env python3
"""Test Firebase connectivity"""

import os
import json
import sys

print("[TEST] Starting Firebase connection test...")

# Step 1: Check serviceAccount.json
service_account_path = os.path.join(os.path.dirname(__file__), 'serviceAccount.json')
print(f"[TEST] Looking for serviceAccount.json at: {service_account_path}")

if not os.path.exists(service_account_path):
    print(f"[ERROR] File not found: {service_account_path}")
    sys.exit(1)

print(f"[TEST] [OK] File exists")

# Step 2: Validate JSON
try:
    with open(service_account_path, 'r') as f:
        creds = json.load(f)
    print(f"[TEST] [OK] Valid JSON")
    print(f"[TEST] Project ID: {creds.get('project_id')}")
    print(f"[TEST] Client Email: {creds.get('client_email')}")
except json.JSONDecodeError as e:
    print(f"[ERROR] Invalid JSON: {e}")
    sys.exit(1)

# Step 3: Test Firebase import
print("[TEST] Importing Firebase...")
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    print("[TEST] [OK] Firebase imports successful")
except ImportError as e:
    print(f"[ERROR] Failed to import Firebase: {e}")
    sys.exit(1)

# Step 4: Initialize Firebase
print("[TEST] Initializing Firebase (this may take 30 seconds)...")
try:
    cred = credentials.Certificate(service_account_path)
    print("[TEST] [OK] Credentials loaded")
    
    firebase_admin.initialize_app(cred)
    print("[TEST] [OK] Firebase app initialized")
    
    # Step 5: Test Firestore connection
    print("[TEST] Connecting to Firestore...")
    db = firestore.client()
    print("[TEST] [OK] Firestore client created")
    
    # Step 6: Test a simple query
    print("[TEST] Testing simple query...")
    docs = db.collection('products').limit(1).stream()
    count = 0
    for doc in docs:
        count += 1
    print(f"[TEST] [OK] Query successful (found {count} products)")
    
    print("\n[SUCCESS] Firebase is working correctly!")
    
except Exception as e:
    print(f"[ERROR] Firebase initialization failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
