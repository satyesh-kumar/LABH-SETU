from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class OCRResponse(BaseModel):
    document_type: str
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    document_number: Optional[str] = None
    masked_document_number: Optional[str] = None
    address: Optional[str] = None
    annual_income: Optional[float] = None
    issuing_authority: Optional[str] = None
    confidence_score: float = 0.95
    raw_text: Optional[str] = None

class RAGQueryRequest(BaseModel):
    query: str
    language: str = "en"
    scheme_context_id: Optional[str] = None

class SourceCitation(BaseModel):
    title: str
    url: str
    department: Optional[str] = None
    verified_date: Optional[str] = None
    status: str = "VERIFIED"

class RAGQueryResponse(BaseModel):
    answer: str
    scheme_name: Optional[str] = None
    sources: List[SourceCitation] = []
    disclaimer: str = "AI-generated guidance. Verify important information with the official department or source."
    disclaimer_hi: str = "एआई-जनरेटेड मार्गदर्शन। महत्वपूर्ण जानकारी का सत्यापन संबंधित आधिकारिक विभाग से अवश्य करें।"
    suggested_questions: List[str] = []
