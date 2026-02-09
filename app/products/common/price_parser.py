import re


def extract_price(prompt: str):
    prompt = prompt.lower()
    match = re.search(r"(under|below|less than)\s*₹?\s*(\d+)", prompt)
    if match:
        return int(match.group(2))
    return None
