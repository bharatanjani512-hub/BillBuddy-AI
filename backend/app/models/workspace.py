from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Workspace(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = "personal"  # "personal" | "corporate" | "business"
    description: Optional[str] = None
    icon: Optional[str] = "Folder"
    color: Optional[str] = "#365314"
    members: Optional[List[str]] = []
