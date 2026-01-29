from fastapi import APIRouter


def make_router(router: APIRouter):
    def decorator(cls):
        instance = cls()

        for attr_name in dir(instance):
            attr = getattr(instance, attr_name)
            route = getattr(attr, "__route__", None)

            if route:
                router.add_api_route(
                    route["path"],
                    attr,
                    methods=[route["method"]],
                    **route.get("kwargs", {})  # <-- apply FastAPI options
                )

        return cls

    return decorator
