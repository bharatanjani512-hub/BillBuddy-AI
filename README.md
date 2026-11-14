# BillBuddy AI

Personal and business bill management platform with automated receipt scanning, due date tracking, and category budgeting.

## Why BillBuddy?

Managing day-to-day business and household bills (electricity, water, broadband, office rent, vendor invoices) gets messy quickly. It is easy to lose track of what has already been cleared, what is still pending, and which invoices are approaching their due date.

I built BillBuddy AI to solve this:
1. Scan paper receipts and digital bills (PDF or image) using multimodal AI to extract the merchant, amount, category, and payment due date.
2. Keep clear visibility over **Paid vs. Pending** bills with a single-click status toggle.
3. Maintain an upcoming bills queue on the dashboard so payment deadlines are not missed.
4. Set category-wise monthly budget caps (electricity, office supplies, software, rent) with real-time spend tracking.
5. Query an AI financial assistant in plain English about current expenses, pending bills, and budget limits.

---

## Features

- **Receipt and Bill Scanning**: Uses Google Gemini Vision to read image or PDF invoices and extract the title, merchant, amount, category, bill date, due date, payment method, and notes.
- **Bill Status Management**: Filter bills by status (All, Paid, Pending, Unpaid). Toggle between Paid and Pending with a single click.
- **Due Date Tracking**: Highlights upcoming and overdue bills directly on the dashboard.
- **Category Budgeting**: Define monthly spending limits per category (Electricity, Rent, Internet, Food, Office Supplies, etc.) with spend progress indicators.
- **Financial Goals**: Set savings targets (equipment purchases, emergency reserves) and track progress toward target completion dates.
- **AI Financial Assistant**: Ask natural-language questions about your expenses, upcoming dues, and category breakdowns.
- **Export Options**: Export transaction histories as CSV or formatted PDF statements.
- **Resilient Database Layer**: Connects to MongoDB Atlas or local MongoDB, with an in-memory fallback for local development.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: Python 3.12, FastAPI, Pydantic, Uvicorn
- **AI Engine**: Google Gemini API (`gemini-2.0-flash` multimodal)
- **Database**: MongoDB (Atlas or local instance), PyMongo
- **Authentication**: JWT (JSON Web Tokens) with Passlib and bcrypt
- **Export**: ReportLab (PDF), pandas (CSV analytics)

---

## Architecture

```text
BillBuddy-AI/
├── backend/
│   ├── app/
│   │   ├── database/       # MongoDB connection with local fallback
│   │   ├── dependencies/   # Authentication dependencies
│   │   ├── models/         # Pydantic data models (User, Bill, Budget, Goal)
│   │   ├── prompts/        # Gemini prompt templates
│   │   ├── routes/         # FastAPI route handlers
│   │   ├── schemas/        # Request and response schemas
│   │   ├── services/       # Business logic (bill scanning, analytics, chat)
│   │   └── utils/          # JWT and security utilities
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance and interceptors
│   │   ├── components/     # UI components (auth, bills, budget, dashboard)
│   │   ├── context/        # Auth context and session management
│   │   ├── pages/          # Application views (Dashboard, Bills, Budget, Goals, Chat, Profile)
│   │   ├── routes/         # Protected route configuration
│   │   └── services/       # Frontend API service layer
│   ├── package.json        # Dependencies and scripts
│   └── vite.config.js      # Vite build configuration
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))
- (Optional) MongoDB Atlas account or local MongoDB instance

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=billbuddy

SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The API will be running at `http://127.0.0.1:8000`. Interactive documentation is available at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

In a second terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser. Register a new user account to log in.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Authenticate and obtain JWT bearer token |
| `GET` | `/users/me` | Fetch authenticated user profile |
| `POST` | `/bills/scan` | Upload bill/receipt image or PDF for AI parsing |
| `GET` | `/bills/` | Query bills with pagination, search, category, and status filters |
| `POST` | `/bills/create` | Manually record a bill |
| `PATCH`| `/bills/{id}/toggle-status` | Toggle status between Paid and Pending |
| `GET` | `/bills/upcoming` | Fetch pending bills sorted by due date |
| `GET` | `/bills/statistics` | Aggregate metrics (total expense, paid, pending) |
| `GET` | `/dashboard/summary` | Overview metrics for dashboard widgets |
| `POST` | `/budget/create` | Create a category budget |
| `GET` | `/budget/statistics` | Compare category budgets against actual spend |
| `POST` | `/goals/` | Create a financial savings goal |
| `GET` | `/insights/` | Rule-based and AI-generated spending insights |
| `POST` | `/chat/` | Conversational financial query endpoint |

---

## Author

Anjani Bharat Chauhan  
M.Sc. Data Science, Shoolini University  
GitHub: [@bharatanjani512-hub](https://github.com/bharatanjani512-hub)

---

## License

This project is licensed under the MIT License.
