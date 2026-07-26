# BillBuddy AI

BillBuddy AI is a backend application for personal finance management built with FastAPI and MongoDB.

It provides REST APIs for expense tracking, budget management, financial goal tracking, dashboard analytics, and AI-generated financial insights using Google Gemini.

---

## Project Status

This project is under active development. New features and improvements are being added regularly.

---

## Features

- User registration and authentication using JWT
- Expense management (Create, Read, Update, Delete)
- Dashboard analytics
- Budget management
- Financial goal tracking
- AI-generated financial insights
- PDF and CSV export

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | Python |
| Framework | FastAPI |
| Database | MongoDB Atlas |
| Database Driver | Motor |
| Authentication | JWT |
| Validation | Pydantic |
| AI Model | Google Gemini |
| PDF Generation | ReportLab |

---

## Project Structure

```text
backend/
├── app/
│   ├── database/       # MongoDB connection
│   ├── dependencies/   # Authentication dependencies
│   ├── exceptions/     # Custom exception handlers
│   ├── models/         # Pydantic models
│   ├── prompts/        # AI prompts
│   ├── responses/      # Standard API responses
│   ├── routes/         # API endpoints
│   ├── schemas/        # Request & response schemas
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── fonts/
├── main.py
├── requirements.txt
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/bharatanjani512-hub/BillBuddy-AI.git
```

### 2. Navigate to the project

```bash
cd BillBuddy-AI/backend
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

**macOS / Linux**

```bash
source venv/bin/activate
```

**Windows**

```bash
venv\Scripts\activate
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure environment variables

Create a `.env` file in the project root.

---

## Environment Variables

Create a `.env` file inside the project root and add the following variables.

```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=your_database_name

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

GEMINI_API_KEY=your_gemini_api_key
```

---

## Running the Application

Start the development server:

```bash
uvicorn main:app --reload
```

The application will be available at:

```
http://127.0.0.1:8000
```

Interactive API documentation:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Authenticate a user |
| GET | `/users/me` | Get the authenticated user |

### Bills

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bills/` | Create a bill |
| GET | `/bills/` | Get all bills |
| PUT | `/bills/{bill_id}` | Update a bill |
| DELETE | `/bills/{bill_id}` | Delete a bill |

### Dashboard & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/summary` | Dashboard summary |
| GET | `/dashboard/monthly` | Monthly expense summary |
| GET | `/dashboard/category` | Category-wise expense summary |

### Budget

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/budget/` | Create or update a budget |
| GET | `/budget/` | Get the current budget |
| GET | `/budget/summary` | Budget summary |

### Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/goals/` | Create a financial goal |
| GET | `/goals/` | Get all goals |
| PUT | `/goals/{goal_id}` | Update a goal |
| DELETE | `/goals/{goal_id}` | Delete a goal |

### AI Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insights/` | Generate AI-based financial insights |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/export/csv` | Export expenses as CSV |
| GET | `/pdf-export/pdf` | Export expenses as PDF |

---

## Roadmap

Planned improvements for future releases:

- Recurring bill management
- Email reminders
- OCR-based receipt scanning
- Expense forecasting using machine learning
- Multi-currency support
- Docker support
- React frontend
- Cloud deployment

---

## Author

**Anjani Bharat Chauhan**

M.Sc. Data Science  
Shoolini University