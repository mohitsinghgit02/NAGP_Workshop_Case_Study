from sentence_transformers import SentenceTransformer
from db.tinydb import get_all_products
from db.vector_db import search_vectors
from common.price_parser import extract_price
from math import ceil
from typing import Optional
import random
from collections import defaultdict


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
        category: Optional[str] = None,
        gender: Optional[str] = None,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
    ):
        # 1️⃣ Vector search (semantic)
        query_vec = self.model.encode([prompt])
        indices = search_vectors(query_vec, self.vector_top_k)

        # 2️⃣ Apply structured filters
        filtered = []
        for i in indices:
            p = self.products[i]

            price = p.get("price", 0)

            if min_price is not None and price < min_price:
                continue
            if max_price is not None and price > max_price:
                continue

            if category and p.get("category") != category:
                continue

            if gender and p.get("gender") != gender:
                continue

            filtered.append(p)

        total = len(filtered)

        # 3️⃣ Pagination
        start = (page - 1) * page_size
        end = start + page_size
        paginated = filtered[start:end]

        return {
            "query": prompt,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": ceil(total / page_size) if total else 0,
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
