from fastapi import FastAPI
import threading
from controllers.customer_controller import router as auth_router
from db.sqlite import engine, Base
from grpc_api.customer_server import grpc_serve

app = FastAPI(
    title="AmCart customer Service",
    description="customer service for AmCart",
    version="1.0.0",
)

# Register Auth routes
app.include_router(auth_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    grpc_thread = threading.Thread(
        target=grpc_serve,
        kwargs={"port": 50052},
        daemon=True,
    )

    grpc_thread.start()

    print("🚀 gRPC server started in background thread")


@app.get("/customer/health", tags=["Health"])
def health_check():
    return {"status": "UP"}
