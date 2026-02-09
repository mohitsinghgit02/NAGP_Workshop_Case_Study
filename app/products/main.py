from fastapi import FastAPI
from controllers.product_controller import router as product_router

app = FastAPI(
    title="AmCart product Service",
    description="product service for AmCart",
    version="1.0.0",
)

# Register Auth routes
app.include_router(product_router)


@app.get("/product/health", tags=["Health"])
def health_check():
    return {"status": "UP"}
