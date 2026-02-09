from tinydb import TinyDB

db = TinyDB("data/products.json")


def get_all_products():
    return db.all()
