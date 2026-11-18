from fastapi import FastAPI

app = FastAPI(title="Home Energy Calculator - API Gateway", version="0.1.0")


@app.get("/")
def root():
    return {"message": "Home Energy Calculator API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "gateway"}
