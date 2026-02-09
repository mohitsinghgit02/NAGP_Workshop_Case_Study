import faiss
import numpy as np

index = faiss.read_index("data/products.index")


def search_vectors(query_vec, top_k=50):
    distances, indices = index.search(np.array(query_vec), top_k)
    return indices[0]
