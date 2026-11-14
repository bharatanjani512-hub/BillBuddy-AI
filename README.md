# BillBuddy AI 🧾⚡

> **Smart Business & Daily Expense Manager powered by Google Gemini AI**

BillBuddy AI is an intelligent full-stack financial platform designed for business owners, freelancers, and professionals to effortlessly scan, track, and manage all daily bills (electricity, internet, office rent, vendor invoices, utilities) in one centralized place.

Never lose track of which bills are paid, which ones are pending, or when your next payment deadline is due.

---

## 🌟 Key Features

### 📷 1. AI Bill & Receipt Scanner (Gemini Vision OCR)
- Upload or snap a picture / PDF of any electricity bill, utility bill, or vendor invoice.
- Google Gemini Vision automatically extracts:
  - **Merchant / Vendor** (e.g., Tata Power, Airtel, AWS, Landlord)
  - **Bill Title & Total Amount**
  - **Category** (Electricity, Internet, Rent, Office Supplies, Travel, Food, etc.)
  - **Bill Date & Due Date**
  - **Payment Status** (Paid vs. Pending)
  - **Payment Method & Invoice / Consumer Notes**

### ⏳ 2. Paid vs. Pending Bill Tracking & 1-Click Toggle
- **Instant Status Toggle**: 1-click on any bill status badge instantly toggles between **Paid (Green)** and **Pending (Amber)**.
- **Due Date Alerts**: Visual highlight for upcoming and overdue payment deadlines.
- **Paid vs. Pending Volume**: Real-time financial metrics showing total money paid out vs. total money pending to clear.

### 🔔 3. Business Dashboard & Upcoming Bills Widget
- Clean financial summary: Total Expenses, Monthly Budget, Savings Goal, and Bill count.
- **Upcoming Bills Widget**: Displays bills due in the next few days so you never incur late fees.
- **Interactive Visualizations**: Monthly spending trend charts and category expense distribution.

### 💰 4. Category-Wise Budget Management
- Set customized monthly spending caps per category (e.g., *Electricity*, *Office Supplies*, *Food & Dining*).
- Real-time progress bars showing spent vs. allocated budget with automated over-budget warnings.

### 🎯 5. Financial Goals & Target Milestones
- Plan capital for business expansion, emergency funds, or equipment purchases.
- Animated savings progress meters, target deadlines, and completed milestones.

### 💬 6. Conversational Financial Assistant ("Ask BillBuddy AI")
- Dedicated AI financial advisor aware of your real-time financial context.
- Ask questions in natural language:
  - *"Which bills are pending this month?"*
  - *"How much did I spend on electricity?"*
  - *"Am I on track with my monthly budget?"*
  - *"What bills are due in the next 7 days?"*

### 📄 7. Reports & Data Export
- Export financial expense records directly to **CSV** and **PDF** formats.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite | Ultra-fast SPA with modern Hooks |
| **Styling** | Tailwind CSS + Lucide Icons | Clean modern design system |
| **Backend** | Python 3.12+ / FastAPI | High-performance asynchronous REST API |
| **AI / Multimodal** | Google Gemini API (2.0 Flash) | Vision OCR, Financial Insights & Chat Agent |
| **Database** | MongoDB Atlas / Local MongoDB | Multi-tier resilient database connection |
| **Authentication** | JWT (JSON Web Tokens) | Secure OAuth2 password bearer auth |
| **PDF Export** | ReportLab | Formatted business statement generation |

---

## 📁 Project Structure

```text
BillBuddy-AI/
├── backend/
│   ├── app/
│   │   ├── database/       # Resilient MongoDB Atlas / Local connection
│   │   ├── dependencies/   # JWT authentication & route security
│   │   ├── models/         # Pydantic data models (Bill, User, Budget, Goal)
│   │   ├── prompts/        # Gemini AI prompt templates
│   │   ├── responses/      # Standard API response handlers
│   │   ├── routes/         # REST API endpoints (bills, budget, goals, chat, users)
│   │   ├── schemas/        # Request/response validation schemas
│   │   ├── services/       # Business logic (bill OCR, analytics, AI chat)
│   │   └── utils/          # Security & JWT hashing utilities
│   ├── main.py             # FastAPI entrypoint & CORS setup
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API client & interceptors
│   │   ├── components/     # Reusable UI components (auth, bills, budget, dashboard)
│   │   ├── context/        # Global AuthContext & state
│   │   ├── pages/          # Dashboard, Bills, Budget, Goals, Insights, Chat, Profile
│   │   ├── routes/         # Protected application router
│   │   ├── services/       # Frontend service endpoints
│   │   ├── utils/          # Constants, formatters, and helpers
│   │   ├── App.jsx         # Root app layout
│   │   └── main.jsx        # React root entrypoint
│   ├── package.json        # Frontend dependencies & Vite scripts
│   └── vite.config.js      # Vite configuration
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
- *(Optional)* A **MongoDB Atlas** cluster URI (or local MongoDB)

---

### 1. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure .env file
# Create a .env file in the backend folder with:
```

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=billbuddy

SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

```bash
# 5. Start the FastAPI development server
uvicorn main:app --reload
```
API server runs at: `http://127.0.0.1:8000`  
Interactive Swagger Docs at: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

Open a **new terminal tab**:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login and obtain JWT bearer token |
| `GET` | `/users/me` | Fetch authenticated user profile |
| `POST` | `/bills/scan` | Upload receipt/bill image -> extract with Gemini Vision |
| `GET` | `/bills/` | List bills with filters (status, category, dates, pagination) |
| `POST` | `/bills/create` | Record a new bill manually |
| `PATCH`| `/bills/{id}/toggle-status` | 1-Click toggle between Paid & Pending |
| `GET` | `/bills/upcoming` | Fetch pending bills with upcoming deadlines |
| `GET` | `/bills/statistics` | Summary metrics (Total paid, pending, count) |
| `GET` | `/dashboard/summary` | Dashboard analytics snapshot |
| `POST` | `/budget/create` | Set category spending budget |
| `GET` | `/budget/statistics` | Budget usage vs. spent analytics |
| `POST` | `/goals/` | Create a financial savings goal |
| `GET` | `/insights/` | Generate Gemini AI financial recommendations |
| `POST` | `/chat/` | Ask BillBuddy AI conversational assistant |

---

## 👤 Author

**Anjani Bharat Chauhan**  
- M.Sc. Data Science, Shoolini University  
- GitHub: [@bharatanjani512-hub](https://github.com/bharatanjani512-hub)

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.
