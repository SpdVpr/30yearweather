
import subprocess
import os
import sys

# Explicit python path
PYTHON_PATH = r"C:\Users\micha\AppData\Local\Microsoft\WindowsApps\python.exe"

def run_step(script_path, description):
    print(f"\n🚀 Starting {description}...")
    try:
        cmd = [PYTHON_PATH, script_path]
        subprocess.run(cmd, check=True)
        print(f"✅ {description} completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed with exit code {e.returncode}.")
        sys.exit(1)

def main():
    print("==================================================")
    print("🌩️  STARTING FINAL ETL PROCESS (Weather + Tourism)")
    print("==================================================")
    
    # 1. Weather ETL (includes Marine for coastal)
    run_step("backend/etl.py", "Weather ETL (All 125 Cities)")
    
    # 2. Tourism ETL
    run_step("backend/etl_tourism.py", "Tourism ETL (All 125 Cities)")
    
    print("\n==================================================")
    print("🎉 ALL DATA PROCESSING COMPLETE!")
    print("==================================================")

if __name__ == "__main__":
    main()
