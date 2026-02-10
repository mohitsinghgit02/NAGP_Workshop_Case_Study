from typing import Optional
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: Optional[str] = Field(..., min_length=1)

    category: Optional[str] = None
    gender: Optional[str] = None

    min_price: Optional[int] = Field(None, ge=0)
    max_price: Optional[int] = Field(None, ge=0)

    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=50)
