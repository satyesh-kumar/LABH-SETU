from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.models import OCRResponse, RAGQueryRequest, RAGQueryResponse
from app.services.ocr import process_document_ocr
from app.services.rag import query_rag_knowledge

app = FastAPI(
    title="LabhSetu AI Service",
    description="Intelligent OCR Extraction and Source-Grounded Scheme RAG Guidance Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LabhSetu AI Service",
        "version": "1.0.0"
    }

@app.post("/ocr/extract", response_model=OCRResponse)
async def extract_document(
    document_type: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        content = await file.read()
        extracted = process_document_ocr(
            filename=file.filename,
            doc_type=document_type,
            file_bytes=content
        )
        return OCRResponse(**extracted)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag/query", response_model=RAGQueryResponse)
def query_rag(request: RAGQueryRequest):
    try:
        result = query_rag_knowledge(query=request.query, language=request.language)
        return RAGQueryResponse(
            answer=result["answer"],
            scheme_name=result.get("scheme_name"),
            sources=result.get("sources", []),
            suggested_questions=result.get("suggested_questions", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
