from sentence_transformers import SentenceTransformer
from db.tinydb import get_all_products
from db.vector_db import search_vectors
from common.price_parser import extract_price
from math import ceil


class ProductSearchService:
    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
        vector_top_k: int = 200,  # 🔥 important for pagination
    ):
        self.model = SentenceTransformer(model_name)
        self.products = get_all_products()
        self.vector_top_k = vector_top_k

    def search(
        self,
        prompt: str,
        page: int = 1,
        page_size: int = 10,
    ):
        max_price = extract_price(prompt)

        query_vec = self.model.encode([prompt])
        indices = search_vectors(query_vec, self.vector_top_k)

        # Apply filters
        filtered = []
        for i in indices:
            p = self.products[i]
            if max_price is not None and p.get("price", 0) > max_price:
                continue
            filtered.append(p)

        total = len(filtered)

        # Pagination math
        start = (page - 1) * page_size
        end = start + page_size
        paginated = filtered[start:end]

        return {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": ceil(total / page_size) if total else 0,
            "has_next": end < total,
            "results": paginated,
        }
