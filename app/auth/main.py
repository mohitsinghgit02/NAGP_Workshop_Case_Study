from fastapi import FastAPI
import threading
from controllers.auth_controller import router as auth_router
from controllers.user_controller import router as user_router
import services.metadata_service as metadata_service
from grpc_server import serve as grpc_serve

app = FastAPI(
    title="AmCart Auth Service",
    version="1.0.0",
)


# ---- Startup logic ----
@app.on_event("startup")
def startup_event():
    metadataObj = metadata_service.MetadataService()
    metadataObj.refresh_metadata()

    grpc_thread = threading.Thread(
        target=grpc_serve,
        kwargs={"port": 50051},
        daemon=True,
    )
    grpc_thread.start()
    print("🚀 gRPC server started in background thread")


# metadataObj = metadata_service.MetadataService()
# metadataObj.refresh_metadata()

app.include_router(auth_router)
app.include_router(user_router)


@app.get("/auth/health")
def health_check():
    return {"status": "UP"}
