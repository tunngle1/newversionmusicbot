import requests
import hmac
import hashlib
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("TRIBUTE_API_KEY")
API_URL = "http://127.0.0.1:8000/api/webhook/tribute"

# User ID to grant premium to (change this to your Telegram ID)
USER_ID = 8038300449 

def generate_signature(api_key, payload):
    """Generates HMAC-SHA256 signature"""
    return hmac.new(
        api_key.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

def send_test_webhook():
    if not API_KEY:
        print("❌ Error: TRIBUTE_API_KEY not found in .env")
        return

    # Simulate 'order_paid' payload
    payload_data = {
        "name": "order_paid",
        "payload": {
            "id": "test_order_123",
            "amount": {
                "value": "1.00",
                "currency": "TON"
            },
            "customer": {
                "telegram_id": USER_ID,
                "username": "test_user"
            },
            "product": {
                "id": "test_product",
                "name": "Premium Month"
            },
            "status": "paid"
        }
    }
    
    # Convert to JSON string
    payload_json = json.dumps(payload_data)
    
    # Generate signature
    signature = generate_signature(API_KEY, payload_json)
    
    headers = {
        "Content-Type": "application/json",
        "trbt-signature": signature
    }
    
    print(f"🚀 Sending test webhook to {API_URL}...")
    print(f"👤 User ID: {USER_ID}")
    print(f"🔑 Signature: {signature[:10]}...")
    
    try:
        response = requests.post(API_URL, data=payload_json, headers=headers)
        
        if response.status_code == 200:
            print("✅ Success! Webhook accepted.")
            print("Response:", response.json())
            print("\n👉 Check your backend logs to see if premium was granted.")
        else:
            print(f"❌ Failed. Status code: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        print("Make sure your backend is running at http://127.0.0.1:8000")

if __name__ == "__main__":
    send_test_webhook()
