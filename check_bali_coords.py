
import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from backend import config

try:
    print(f"Current Bali Config: {config.LOCATIONS['bali']}")
except KeyError:
    print("Bali key not found!")
