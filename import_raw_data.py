import os
import time
import pandas as pd
from sqlalchemy import create_engine, text
import sys
from datetime import datetime

# === DATABASE CONNECTION CONFIG ===
db_user = 'root'
db_password = ''  # Leave empty if no password, or enter your MySQL root password
db_host = 'localhost'
db_name = 'stock_data_db'

# Create SQLAlchemy engine
try:
    print(f"Connecting to MySQL database {db_name}...")
    engine = create_engine(f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}')
    # Test connection
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        if result.fetchone():
            print("Database connection successful.")
except Exception as e:
    print(f"Failed to connect to database: {e}")
    sys.exit(1)

# === FILE LOCATIONS ===
# TODO: Make sure this script is in the same directory as your CSV files
HEADLINES_FILE = 'raw_partner_headlines.csv'
RATINGS_FILE = 'raw_analyst_ratings.csv'

# Create output log file
log_file = f"raw_data_import_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
with open(log_file, 'w', encoding='utf-8') as f:
    f.write(f"=== RAW DATA IMPORT LOG - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n\n")

def log_message(message):
    # Remove emoji characters that might cause encoding issues
    message = message.replace("✅", "[SUCCESS]").replace("❌", "[ERROR]").replace("⚠️", "[WARNING]")
    print(message)
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"{message}\n")

def import_data_to_db(filepath, table_name):
    """Reads data from a CSV file and imports it into the specified database table."""
    if not os.path.exists(filepath):
        log_message(f"[ERROR] File not found: {filepath}")
        return

    log_message(f"\nProcessing file: {filepath}")
    start_time = time.time()

    try:
        # Use pd.read_csv explicitly since we're dealing with CSV files
        df = pd.read_csv(filepath, encoding='utf-8')
        log_message(f"[SUCCESS] File read successfully. {len(df)} rows found.")

        # Ensure required columns exist and rename them to match database schema
        required_columns = {'headline': 'headline', 'url': 'url', 'publisher': 'publisher', 'date': 'date', 'stock': 'stock'}
        # Assuming case-insensitive matching and potentially different column names
        df.columns = df.columns.str.lower()
        
        missing_columns = [col for col in required_columns.keys() if col not in df.columns]
        if missing_columns:
            log_message(f"[WARNING] Missing columns in {filepath}: {missing_columns}. Skipping import for this file.")
            log_message("Please ensure the CSV file has the following columns (case-insensitive): Headline, URL, Publisher, Date, Stock")
            return

        # Select and rename columns to match the database schema
        df = df[list(required_columns.keys())]
        df.columns = [required_columns[col] for col in df.columns]

        # Convert date column to datetime objects
        if 'date' in df.columns:
             # Attempt to convert date column, handling potential errors
            try:
                df['date'] = pd.to_datetime(df['date'], errors='coerce')
                # Drop rows where date conversion failed
                original_rows = len(df)
                df.dropna(subset=['date'], inplace=True)
                if len(df) < original_rows:
                    log_message(f"[WARNING] Dropped {original_rows - len(df)} rows due to invalid date format.")
            except Exception as e:
                log_message(f"[WARNING] Error converting date column in {filepath}: {e}. Skipping import for this file.")
                return

        # Insert data into the database table with progress
        total_rows = len(df)
        chunk_size = 1000 # Adjust chunk size based on your system's memory and database performance
        log_message(f"Inserting data into '{table_name}' in chunks of {chunk_size}...")

        for i in range(0, total_rows, chunk_size):
            chunk_df = df[i:i + chunk_size]
            try:
                chunk_df.to_sql(table_name, engine, if_exists='append', index=False)
                log_message(f"[SUCCESS] Inserted rows {i + 1} to {min(i + chunk_size, total_rows)}/{total_rows}.")
            except Exception as e:
                log_message(f"[ERROR] Failed to insert rows {i + 1} to {min(i + chunk_size, total_rows)}: {e}")
                # Optionally, you could implement logic here to log problematic rows or retry

        log_message(f"[SUCCESS] Completed import for {filepath} into '{table_name}': {total_rows} records in {time.time() - start_time:.2f} seconds.")

    except Exception as e:
        log_message(f"[ERROR] An error occurred while processing {filepath}: {e}")

# === MAIN IMPORT PROCESS ===
log_message("\n=== Starting Raw Data Import ===")

# Import Raw Partner Headlines
import_data_to_db(HEADLINES_FILE, 'raw_partner_headlines')

# Import Raw Analyst Ratings
import_data_to_db(RATINGS_FILE, 'raw_analyst_ratings')

log_message("\n=== Raw Data Import Complete ===") 