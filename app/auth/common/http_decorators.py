def _http_method(method: str, path: str, **kwargs):
    def decorator(func):
        func.__route__ = {
            "method": method,
            "path": path,
            "kwargs": kwargs,  # <-- store FastAPI options
        }
        return func

    return decorator


def get(path: str, **kwargs):
    return _http_method("GET", path, **kwargs)


def post(path: str, **kwargs):
    return _http_method("POST", path, **kwargs)


def put(path: str, **kwargs):
    return _http_method("PUT", path, **kwargs)


def delete(path: str, **kwargs):
    return _http_method("DELETE", path, **kwargs)


def patch(path: str, **kwargs):
    return _http_method("PATCH", path, **kwargs)
