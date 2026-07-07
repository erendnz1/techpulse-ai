from fastapi import FastAPI

app = FastAPI(
    title="TechPulse AI API",
    version="1.0.0",
    description="AI-powered software technology monitoring platform"
)

@app.get("/")
def root():
    return {
        "project": "TechPulse AI",
        "version": "1.0.0",
        "status": "Running 🚀",
        "message": "Welcome to TechPulse AI API"
    }
