from fastapi import FastAPI
from controllers.auth_controller import router as auth_router

app = FastAPI(
    title="AmCart Auth Service",
    description="Authentication service for AmCart using OTP and Cognito",
    version="1.0.0",
)

# Register Auth routes
app.include_router(auth_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "UP"}
