from fastapi import APIRouter, HTTPException
from services.metadata_service import MetadataService
from common.router_decorator import make_router
from common.http_decorators import post

router = APIRouter(prefix="/auth/metadata", tags=["Metadata"])


@make_router(router)
class MetadataController:
    def __init__(self):
        self.service = MetadataService()

    @post("/refresh", summary="Refresh roles & permissions metadata")
    def refresh_metadata(self):
        try:
            result = self.service.refresh_metadata()
            return {"status": "SUCCESS", "inserted": result}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
