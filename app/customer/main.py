from fastapi import FastAPI
from controllers.customer_controller import router as auth_router

app = FastAPI(
    title="AmCart customer Service",
    description="customer service for AmCart",
    version="1.0.0",
)

# Register Auth routes
app.include_router(auth_router)


@app.get("/customer/health", tags=["Health"])
def health_check():
    return {"status": "UP"}
