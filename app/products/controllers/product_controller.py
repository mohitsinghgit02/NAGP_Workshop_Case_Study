# app/customer/controllers/customer_controller.py
from fastapi import APIRouter, Depends, Header, HTTPException
from services.search_service import ProductSearchService
from common.router_decorator import make_router
from common.http_decorators import post, get
from schemas.search_schema import SearchRequest, ProductIdsRequest
from common.json_sanitizer import sanitize_for_json

router = APIRouter(prefix="/product", tags=["Product"])


@make_router(router)
class ProductController:
    def __init__(self):
        self.search_service = ProductSearchService()

    @post("/search", summary="Search products with filters & pagination")
    def fetch_products(self, request: SearchRequest):
        # Collect optional parts
        parts = [
            request.query,
            request.gender,
            request.category,
            request.subCategory,
        ]

        # Remove None / empty strings
        parts = [p.strip() for p in parts if p and p.strip()]

        # Rule 1: all empty → default query
        if not parts:
            final_query = "Men and Women cloth"
        else:
            # Rule 2: combine available values
            final_query = " ".join(parts)

        response = self.search_service.search(
            prompt=final_query,
            category=request.category,
            gender=request.gender,
            subCategory=request.subCategory,
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

    @post("/by-ids", summary="Fetch products by product IDs")
    def fetch_products_by_ids(self, request: ProductIdsRequest):

        if not request.product_ids:
            return {"total": 0, "results": []}

        products = self.search_service.get_products_by_ids(
            product_ids=request.product_ids
        )

        if not products:
            return {"total": 0, "results": []}

        return sanitize_for_json({"total": len(products), "results": products})
