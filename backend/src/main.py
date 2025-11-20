from fastapi import FastAPI


def init_app() -> FastAPI:
    app = FastAPI()

    return app


backend_app = init_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:backend_app", host="localhost", port=8000, reload=True)