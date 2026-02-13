import os
from sentence_transformers import SentenceTransformer
from db.tinydb import get_all_products
from db.vector_db import search_vectors
from math import ceil
from typing import Optional, Dict, Any
import random
from collections import defaultdict
from threading import Lock


MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")

_model = None
_model_lock = Lock()


def get_model():
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                _model = SentenceTransformer(MODEL_NAME)
    return _model


class ProductSearchService:
    def __init__(
        self,
        vector_top_k: int = 200,  # 🔥 important for pagination
    ):
        self.vector_top_k = vector_top_k
        self.products = get_all_products()

    def search(
        self,
        prompt: str,
        page: int = 1,
        page_size: int = 10,
        category: Optional[str] = None,
        subCategory: Optional[str] = None,
        gender: Optional[str] = None,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
    ):
        # # 1️⃣ Vector search (semantic)
        # query_vec = self.model.encode([prompt])
        # indices = search_vectors(query_vec, self.vector_top_k)

        model = get_model()

        # 1️⃣ Encode query
        query_vec = model.encode([prompt])

        # 2️⃣ Vector search (delegated to db layer)
        distances, indices = search_vectors(query_vec, self.vector_top_k)

        matched_indices = indices[0]

        # 3️⃣ Apply filters
        results = []
        for idx in matched_indices:
            if idx < 0 or idx >= len(self.products):
                continue

            product = self.products[idx]

            if category and product.get("category") != category:
                continue
            if subCategory and product.get("subCategory") != subCategory:
                continue
            if gender and product.get("gender") != gender:
                continue
            if min_price and product.get("price") < min_price:
                continue
            if max_price and product.get("price") > max_price:
                continue

            results.append(product)

        total = len(results)

        # 4️⃣ Pagination
        start = (page - 1) * page_size
        end = start + page_size
        paginated = results[start:end]

        return {
            "query": prompt,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size,
            "has_next": end < total,
            "results": paginated,
        }

    def get_random_products(self, count: int = 8):
        if not self.products:
            return []

        # If products < requested count
        if len(self.products) <= count:
            return random.sample(self.products, len(self.products))

        return random.sample(self.products, count)

    def get_category_tree(self):
        """
        Builds a unique Gender -> Category -> SubCategory tree
        """

        tree = defaultdict(lambda: defaultdict(set))

        for p in self.products:
            gender = p.get("gender")
            category = p.get("category")
            sub_category = p.get("subCategory")

            if not gender or not category or not sub_category:
                continue

            tree[gender][category].add(sub_category)

        # Convert sets to sorted lists
        formatted_tree = {
            gender: {
                category: sorted(list(subs)) for category, subs in categories.items()
            }
            for gender, categories in tree.items()
        }

        return formatted_tree
