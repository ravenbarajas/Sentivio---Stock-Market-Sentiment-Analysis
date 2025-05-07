import os
import time
import pandas as pd
from sqlalchemy import create_engine, text
from datetime import datetime

# === DATABASE CONNECTION CONFIG ===
db_user = 'root'
db_password = ''  # Leave empty if no password
db_host = 'localhost'
db_name = 'stock_data_db'

# Create SQLAlchemy engine
print(f"Connecting to MySQL database {db_name}...")
engine = create_engine(f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}')
with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    if result.fetchone():
        print("✅ Database connection successful.")

# === FILE LOCATIONS ===
symbols_meta_file = 'symbols_valid_meta.csv'
etfs_folder = 'etfs'
stocks_folder = 'stocks'

# Create output log file
log_file = f"data_import_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
with open(log_file, 'w') as f:
    f.write(f"=== STOCK DATA IMPORT LOG - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n\n")

def log_message(message):
    print(message)
    with open(log_file, 'a') as f:
        f.write(f"{message}\n")

# === 1. Load symbols_valid_meta.csv ===
log_message("\n=== IMPORTING SYMBOLS METADATA ===")
log_message(f"Inserting symbols_valid_meta.csv...")
start_time = time.time()

try:
    if not os.path.exists(symbols_meta_file):
        log_message(f"⚠️ Warning: {symbols_meta_file} not found. Skipping metadata import.")
    else:
        meta_df = pd.read_csv(symbols_meta_file)
        
        # Map CSV columns to database columns
        column_mapping = {
            'is_etf': 'etf',  # Fix the column name if it exists
            'Nasdaq Traded': 'nasdaq_traded',
            'Symbol': 'symbol',
            'Security Name': 'security_name',
            'Listing Exchange': 'listing_exchange',
            'Market Category': 'market_category',
            'ETF': 'etf',
            'Round Lot Size': 'round_lot_size',
            'Test Issue': 'test_issue',
            'Financial Status': 'financial_status',
            'CQS Symbol': 'cqs_symbol',
            'NASDAQ Symbol': 'nasdaq_symbol',
            'NextShares': 'nextshares'
        }
        
        # Rename columns to match database (only if they exist in the dataframe)
        for old_col, new_col in column_mapping.items():
            if old_col in meta_df.columns:
                meta_df = meta_df.rename(columns={old_col: new_col})
        
        # Ensure we have all required columns
        required_columns = [
            'nasdaq_traded', 'symbol', 'security_name', 'listing_exchange',
            'market_category', 'etf', 'round_lot_size', 'test_issue',
            'financial_status', 'cqs_symbol', 'nasdaq_symbol', 'nextshares'
        ]
        
        # Check if all required columns exist
        missing_columns = [col for col in required_columns if col not in meta_df.columns]
        if missing_columns:
            log_message(f"⚠️ Warning: Missing columns in metadata file: {missing_columns}")
            
            # Add missing columns with default values
            for col in missing_columns:
                if col in ['nasdaq_traded', 'etf', 'test_issue', 'nextshares']:
                    meta_df[col] = False
                else:
                    meta_df[col] = None
        
        # Convert Y/N values to boolean for boolean fields
        bool_columns = ['nasdaq_traded', 'etf', 'test_issue', 'nextshares']
        for col in bool_columns:
            if col in meta_df.columns and meta_df[col].dtype == object:
                meta_df[col] = meta_df[col].map(
                    {'Y': True, 'N': False, 'y': True, 'n': False, 'Yes': True, 'No': False, 
                     '1': True, '0': False, 1: True, 0: False, True: True, False: False}, 
                     na_action='ignore'
                )
        
        # Drop any existing data and insert new data
        try:
            with engine.connect() as conn:
                conn.execute(text("TRUNCATE TABLE symbols_valid_meta"))
            
            meta_df.to_sql('symbols_valid_meta', engine, if_exists='append', index=False)
            log_message(f"✅ symbols_valid_meta inserted: {len(meta_df)} records in {time.time() - start_time:.2f} seconds.")
        except Exception as e:
            log_message(f"⚠️ Failed to insert symbols_valid_meta: {e}")
except Exception as e:
    log_message(f"⚠️ Failed to process symbols_valid_meta.csv: {e}")

# Clear existing data from the ETF and stock tables
try:
    with engine.connect() as conn:
        conn.execute(text("TRUNCATE TABLE etf_data"))
        conn.execute(text("TRUNCATE TABLE stock_data"))
    log_message("\n✅ Cleared existing data from ETF and stock tables")
except Exception as e:
    log_message(f"⚠️ Failed to clear tables: {e}")

# === 2. Load ETF data files ===
log_message("\n=== IMPORTING ETF DATA ===")

# Check if etfs folder exists
if not os.path.exists(etfs_folder):
    log_message(f"⚠️ Warning: {etfs_folder} folder not found. Skipping ETF import.")
else:
    etf_files = [f for f in os.listdir(etfs_folder) if f.endswith(('.csv', '.xlsx'))]
    log_message(f"Found {len(etf_files)} ETF files to process.")
    
    total_etfs = 0
    for idx, filename in enumerate(etf_files):
        filepath = os.path.join(etfs_folder, filename)
        log_message(f"[{idx+1}/{len(etf_files)}] Inserting ETF data: {filename}")
        start_time = time.time()

        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)

            # Make sure we have all required columns - maintain original column names
            required_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                log_message(f"⚠️ Warning: Missing columns in {filename}: {missing_columns}")
                continue
            
            # Extract only the columns we need for our schema
            df = df[required_columns].copy()
            
            # Add symbol column
            symbol = os.path.splitext(filename)[0].replace('_etf', '')
            df['Symbol'] = symbol.upper()
            
            # Convert date
            df['Date'] = pd.to_datetime(df['Date'])
            
            # Handle NaN values
            df = df.fillna({
                'Open': 0,
                'High': 0,
                'Low': 0,
                'Close': 0,
                'Adj Close': 0,
                'Volume': 0
            })

            # Insert data only into the ETF table
            df.to_sql('etf_data', engine, if_exists='append', index=False, chunksize=1000)

            total_etfs += len(df)
            log_message(f"✅ {filename} inserted: {len(df)} records in {time.time() - start_time:.2f} seconds.")
        except Exception as e:
            log_message(f"⚠️ Failed to insert {filename}: {e}")

    log_message(f"✅ Completed ETF data import: {total_etfs} total records from {len(etf_files)} files.")

# === 3. Load Stock data files ===
log_message("\n=== IMPORTING STOCK DATA ===")

# Check if stocks folder exists
if not os.path.exists(stocks_folder):
    log_message(f"⚠️ Warning: {stocks_folder} folder not found. Skipping Stock import.")
else:
    stock_files = [f for f in os.listdir(stocks_folder) if f.endswith(('.csv', '.xlsx'))]
    log_message(f"Found {len(stock_files)} stock files to process.")
    
    total_stocks = 0
    for idx, filename in enumerate(stock_files):
        filepath = os.path.join(stocks_folder, filename)
        log_message(f"[{idx+1}/{len(stock_files)}] Inserting stock data: {filename}")
        start_time = time.time()

        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)

            # Make sure we have all required columns - maintain original column names
            required_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                log_message(f"⚠️ Warning: Missing columns in {filename}: {missing_columns}")
                continue
            
            # Extract only the columns we need for our schema
            df = df[required_columns].copy()
            
            # Add symbol column
            symbol = os.path.splitext(filename)[0]
            df['Symbol'] = symbol.upper()
            
            # Convert date
            df['Date'] = pd.to_datetime(df['Date'])
            
            # Handle NaN values
            df = df.fillna({
                'Open': 0,
                'High': 0,
                'Low': 0,
                'Close': 0,
                'Adj Close': 0,
                'Volume': 0
            })

            # Insert data only into the stock table
            df.to_sql('stock_data', engine, if_exists='append', index=False, chunksize=1000)

            total_stocks += len(df)
            log_message(f"✅ {filename} inserted: {len(df)} records in {time.time() - start_time:.2f} seconds.")
        except Exception as e:
            log_message(f"⚠️ Failed to insert {filename}: {e}")

    log_message(f"✅ Completed stock data import: {total_stocks} total records from {len(stock_files)} files.")

log_message("\n=== IMPORT COMPLETE ===")
log_message(f"Data import completed successfully into separate ETF and stock tables. Log file saved to {log_file}")
print(f"\nImport complete! Check {log_file} for details.") 