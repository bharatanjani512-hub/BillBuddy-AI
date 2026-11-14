from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import database
from app.responses.api_response import error_response

from app.routes.user import router as user_router
from app.routes.bill import router as bill_router
from app.routes.dashboard import router as dashboard_router
from app.routes.export import router as export_router
from app.routes.pdf_export import router as pdf_export_router
from app.routes.insights import router as insights_router
from app.routes.budget import router as budget_router
from app.routes.goal import router as goal_router
from app.routes.chat import router as chat_router

app = FastAPI(
    title="BillBuddy AI",
    version="1.0.0"
)

# ==================================================
# CORS Configuration
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# Global HTTP Exception Handler
# ==================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException
):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(
            message=exc.detail
        )
    )

# ==================================================
# User Routes
# ==================================================

app.include_router(
    user_router,
    prefix="/users",
    tags=["Users"]
)

# ==================================================
# Bill Routes
# ==================================================

app.include_router(
    bill_router,
    prefix="/bills",
    tags=["Bills"]
)

# ==================================================
# Dashboard Routes
# ==================================================

app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

# ==================================================
# Export Routes
# ==================================================

app.include_router(
    export_router,
    prefix="/export",
    tags=["Export"]
)

# ==================================================
# PDF Export Routes
# ==================================================

app.include_router(
    pdf_export_router,
    prefix="/pdf-export",
    tags=["PDF Export"]
)

# ==================================================
# AI Insights Routes
# ==================================================

app.include_router(
    insights_router,
    prefix="/insights",
    tags=["AI Insights"]
)

# ==================================================
# Budget Routes
# ==================================================

app.include_router(
    budget_router,
    prefix="/budget",
    tags=["Budget"]
)

# ==================================================
# Goal Routes
# ==================================================

app.include_router(
    goal_router,
    prefix="/goals",
    tags=["Goals"]
)

# ==================================================
# AI Chat Routes
# ==================================================

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["AI Chat"]
)

# ==================================================
# Home Route
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to BillBuddy AI"
    }

# ==================================================
# Health Check
# ==================================================

@app.get("/health")
def health():
    return {
        "status": "Server Running Successfully"
    }

# ==================================================
# Database Connection Test
# ==================================================

@app.get("/db-test")
def db_test():
    return {
        "message": "MongoDB Connected Successfully!"
    }