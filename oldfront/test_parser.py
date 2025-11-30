from backend.hitmo_parser_light import HitmoParser
import json

def test():
    print("Initializing parser...")
    parser = HitmoParser()
    print("Searching for 'imagine dragons'...")
    results = parser.search("imagine dragons", limit=5)
    print(f"Found {len(results)} tracks")
    print(json.dumps(results, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test()
