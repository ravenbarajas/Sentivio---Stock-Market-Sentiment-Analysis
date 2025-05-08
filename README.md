# Stock Sentiment Analysis

This application provides stock market data visualization and sentiment analysis for selected stock symbols.

## Project Structure

- `frontend/`: React frontend application built with Vite, TypeScript, and Tailwind CSS
- `backend/`: Laravel backend API
- `savetodb.py` and `import_data.py`: Scripts for data processing and database operations

## Setup Instructions

### Prerequisites

- PHP 8.0+ with Composer
- Node.js 16+
- MySQL or SQLite database

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install PHP dependencies:

```bash
composer install
```

3. Set up environment:

```bash
cp .env.example .env
php artisan key:generate
```

4. Edit `.env` to configure your database connection

5. Run migrations and seeders:

```bash
php artisan migrate
php artisan db:seed
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

## Running the Application

### Option 1: Run both frontend and backend together

1. Use the provided development script:

```bash
node start-dev.js
```

This will start both the backend server at http://localhost:8000 and the frontend development server at http://localhost:5173.

### Option 2: Run separately

#### Backend

```bash
cd backend
php artisan serve
```

The backend API will be available at http://localhost:8000.

#### Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173.

## Features

- Search for stock symbols
- View current stock price and related metrics
- Visualize historical price trends
- View sentiment analysis (if available)
- Dark/light theme support

## API Endpoints

- `GET /api/stock-data/{symbol}`: Get basic stock data
- `GET /api/market-data/{symbol}`: Get detailed market data for a stock

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Vite
- **Backend**: Laravel, PHP
- **Database**: MySQL/SQLite

## License

MIT 