import dotenv
dotenv.load_dotenv()
from ai_backend import app, add_mapping


if __name__ == "__main__":
    import mappings.aio
    from uvicorn import run
    add_mapping(mappings.aio.mapping)
    run(app)
  