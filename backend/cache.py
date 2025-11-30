import time
from typing import Any, Dict, Optional, Tuple

# Configuration
TTL = 60  # seconds

# Storage
# Format: key -> (expires_at_timestamp, data)
_cache: Dict[str, Tuple[float, Any]] = {}

# Statistics
_stats = {
    "hits": 0,
    "misses": 0
}

def make_cache_key(path: str, params: Dict[str, Any]) -> str:
    """
    Generates a unique cache key based on the endpoint path and parameters.
    Parameters are sorted by name to ensure consistent keys.
    """
    sorted_params = sorted(params.items())
    param_str = "&".join(f"{k}={v}" for k, v in sorted_params)
    return f"{path}|{param_str}"

def get_from_cache(key: str) -> Optional[Any]:
    """
    Retrieves data from cache if it exists and hasn't expired.
    Updates hit/miss statistics.
    """
    current_time = time.time()
    
    if key in _cache:
        expires_at, data = _cache[key]
        if current_time < expires_at:
            _stats["hits"] += 1
            return data
        else:
            # Expired
            del _cache[key]
            _stats["misses"] += 1
            return None
    
    _stats["misses"] += 1
    return None

def set_to_cache(key: str, data: Any) -> None:
    """
    Saves data to cache with the configured TTL.
    """
    expires_at = time.time() + TTL
    _cache[key] = (expires_at, data)

def get_cache_stats() -> Dict[str, Any]:
    """
    Returns current cache statistics.
    """
    total_entries = len(_cache)
    hits = _stats["hits"]
    misses = _stats["misses"]
    total_requests = hits + misses
    hit_ratio = (hits / total_requests) if total_requests > 0 else 0
    
    # Get first 5 keys for debugging
    sample_keys = list(_cache.keys())[:5]
    
    return {
        "total_entries": total_entries,
        "cache_hits": hits,
        "cache_misses": misses,
        "hit_ratio": round(hit_ratio, 4),
        "ttl_seconds": TTL,
        "sample_keys": sample_keys
    }

def reset_cache() -> None:
    """
    Clears the cache and resets statistics.
    """
    _cache.clear()
    _stats["hits"] = 0
    _stats["misses"] = 0
