
import requests
from bs4 import BeautifulSoup

def analyze():
    url = "https://wwwnc.cdc.gov/travel/destinations/traveler/none/thailand"
    print(f"Fetching {url}...")
    
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Look for the Vaccines section
        # Usually contained in a div with id "vaccines" or looking for table classes
        
        # Print all headers (h2, h3)
        print("\n--- HEADERS ---")
        for h in soup.find_all(['h2', 'h3']):
            print(f"[{h.name}] {h.get_text(strip=True)}")
            
        # Look for tables (often used for vaccines)
        print("\n--- TABLES ---")
        tables = soup.find_all('table')
        for i, table in enumerate(tables):
            print(f"Table {i} classes: {table.get('class')}")
            # Print first row to see headers
            rows = table.find_all('tr')
            if rows:
                print(f"  Header: {[th.get_text(strip=True) for th in rows[0].find_all(['th', 'td'])]}")
                # Print first data row
                if len(rows) > 1:
                     print(f"  Row 1: {[td.get_text(strip=True) for td in rows[1].find_all(['td', 'th'])]}")

    except Exception as e:
        print(e)

if __name__ == "__main__":
    analyze()
