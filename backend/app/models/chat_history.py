from datetime import datetime

from pydantic import BaseModel


class ChatHistory(BaseModel):
    user_email: str
    role: str
    message: str
    created_at: datetime = datetime.utcnow()