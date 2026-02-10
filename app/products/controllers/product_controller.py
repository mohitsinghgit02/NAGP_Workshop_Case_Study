# app/customer/controllers/customer_controller.py
from fastapi import APIRouter, Depends, Header, HTTPException
from services.search_service import ProductSearchService
from common.router_decorator import make_router
from common.http_decorators import post, get
from schemas.search_schema import SearchRequest
from common.json_sanitizer import sanitize_for_json

router = APIRouter(prefix="/product", tags=["Product"])


@make_router(router)
class ProductController:
    def __init__(self):
        self.search_service = ProductSearchService()

    @post("/search", summary="Search products with filters & pagination")
    def fetch_products(self, request: SearchRequest):
        response = self.search_service.search(
            prompt=request.query,
            category=request.category,
            gender=request.gender,
            min_price=request.min_price,
            max_price=request.max_price,
            page=request.page,
            page_size=request.page_size,
        )

        if not response or response["total"] == 0:
            return {
                "query": request.query,
                "page": request.page,
                "page_size": request.page_size,
                "total": 0,
                "total_pages": 0,
                "has_next": False,
                "results": [],
            }

        return sanitize_for_json(response)

    @get("/trending", summary="Get random products")
    def get_random_products(self):
        products = self.search_service.get_random_products(8)
        return {"count": len(products), "products": sanitize_for_json(products)}

    @get("/filters/categories", summary="Get category & sub-category tree for filters")
    def fetch_category_tree(self):
        data = self.search_service.get_category_tree()

        return {"status": "success", "data": data}
