
try:
    import requests
    print("requests OK")
except ImportError:
    print("requests MISSING")

try:
    import pandas
    print("pandas OK")
except ImportError:
    print("pandas MISSING")
