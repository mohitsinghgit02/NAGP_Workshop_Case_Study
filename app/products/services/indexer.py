import random
import pandas as pd
import faiss
import numpy as np
from tinydb import TinyDB
from sentence_transformers import SentenceTransformer


def build_text(p):
    return f"""
    {p['gender']} {p['category']} {p['subCategory']}
    {p['articleType']} {p['baseColour']}
    usage {p['usage']} season {p['season']}
    {p['productDisplayName']}
    """


df = pd.read_csv("data/products.csv")
df["price"] = df.apply(lambda _: random.randint(500, 5000), axis=1)

db = TinyDB("data/products.json")
db.insert_multiple(df.to_dict(orient="records"))

products = db.all()

model = SentenceTransformer("all-MiniLM-L6-v2")
texts = [build_text(p) for p in products]
embeddings = model.encode(texts, show_progress_bar=True)

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

faiss.write_index(index, "data/products.index")

print("Indexing complete")
