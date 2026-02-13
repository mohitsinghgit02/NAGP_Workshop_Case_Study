# db/vector_db.py

import os
import numpy as np
import faiss
from threading import Lock

INDEX_PATH = os.getenv("FAISS_INDEX_PATH", "data/products.index")

_index = None
_index_lock = Lock()


def get_index():
    global _index
    if _index is None:
        with _index_lock:
            if _index is None:
                _index = faiss.read_index(INDEX_PATH)
    return _index


def search_vectors(query_vec, top_k=50):
    """
    Perform FAISS vector search.
    Returns (distances, indices)
    """
    index = get_index()

    query_vec = np.array(query_vec).astype("float32")

    distances, indices = index.search(query_vec, top_k)

    return distances, indices
