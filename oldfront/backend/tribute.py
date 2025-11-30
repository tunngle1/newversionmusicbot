import hmac
import hashlib

def verify_tribute_signature(api_key: str, body: bytes, signature: str) -> bool:
    """
    Verifies the Tribute.tg webhook signature.
    
    Args:
        api_key: Your Tribute API Key.
        body: The raw request body bytes.
        signature: The 'trbt-signature' header value.
        
    Returns:
        True if signature is valid, False otherwise.
    """
    if not api_key or not signature:
        return False
        
    try:
        # Calculate HMAC-SHA256 signature
        expected_signature = hmac.new(
            api_key.encode('utf-8'),
            body,
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures safely
        return hmac.compare_digest(expected_signature, signature)
    except Exception as e:
        print(f"Signature verification error: {e}")
        return False
