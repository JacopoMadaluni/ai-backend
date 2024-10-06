import os
import json
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

API_URL = "https://api.mistral.ai/v1/chat/completions"

API_KEY = os.getenv("API_KEY")

current = "test"


db_folder_rpath = os.path.expanduser("~/.cache/ai-backend")
def resolve_db_folder():
    if not os.path.exists(db_folder_rpath):
        os.makedirs(db_folder_rpath, exist_ok=True)

    return db_folder_rpath

def get_info_file_path():
    return f"{resolve_db_folder()}/{current}.info.txt"

def get_db_file_path():
    return f"{resolve_db_folder()}/{current}.db.json"

def submit_ask_request(prompt, db) -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    db = json.dumps(db)
    print(db)
    data = {
        "model": "mistral-large-latest",   
        "temperature": 0.4,
        "messages": [
            {'role': 'system', 'content': 'You must act as an assistant for the user, who will give you a json database with a question about it. Your job is to answer the question in natural language'},
            {"role": "user", "content": f"database: {db}\n question: {prompt}"}
        ],
    }

    response = requests.post(API_URL, json=data, headers=headers)
    
    if response.status_code == 200:
        content = response.json()['choices'][0]['message']['content']
        return content
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}") 

def submit_mapping_request(prompt, format) -> tuple[bool, dict]:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    format = json.dumps(format)
    data = {
        #""model": "mistral-tiny",   
        "model": "mistral-large-latest",
        "temperature": 0,
        "messages": [
            {'role': 'system', 'content': 'You must act as a mapping between a query and a specific object representing an operation. The user will provide to you a query in natural language, you must output a json conforming precisely to the format inputted by the user'},
            {"role": "user", "content": f"format: {format}\n query: {prompt}"}
        ],
        "response_format": {
            "type": "json_object"
            }
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    
    if response.status_code == 200:
        content = json.loads(response.json()['choices'][0]['message']['content'])
        return content
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")

def submit(prompt, db, info) -> tuple[bool, dict, dict]:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    current_db = json.dumps(db)
    data = {
        #""model": "mistral-tiny",   
        "model": "mistral-large-latest",
        "temperature": 0,
        "messages": [
            {'role': 'system', 
             'content': 'You must act as a backend interface to generate a database file depending on the previous file and the user request. Always return a json. The json should have the 3 keys, updated (bool): whether the document was updated with the request, db (object): which is the full updated database. You must always return the whole database, and result, which is optional only if the user requested specific partial data.' },
            {"role": "user", "content": f"info: {info}\n current: {current_db}\n request: {prompt}"}
        ],
        "response_format": {
            "type": "json_object"
        }
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    
    if response.status_code == 200:
        content = json.loads(response.json()['choices'][0]['message']['content'])
        result = content['result'] if 'result' in content else None
        return content['updated'], content['db'], result 
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")


def display(db: dict):
    print(json.dumps(db, indent=4, sort_keys=True))


def update_info(info: str):
    infos = []
    info_path = get_info_file_path()
    if os.path.exists(info_path):
        with open(info_path, "r+") as f:
            infos = f.readlines()
    
    if f"{info}\n" not in infos:
        with open(info_path, "a+") as f:
            f.write(f"{info}\n")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryInfo(BaseModel):
    q: str
    info: bool

mappings = []

def get_db():
    db = {}
    db_path = get_db_file_path()
    if os.path.exists(db_path):
        with open(db_path, "r") as f:
            db = json.loads(f.read())
    return db

def is_mapping(query: str):
    for mapping in mappings:
        print(query)
        print(mapping["name"])
        if query.startswith(mapping["name"]):
            return mapping
    return False

@app.post("/q")
async def root(body: QueryInfo):
    q = body.q
    mapping = is_mapping(q)
    if mapping:
        format = mapping["format"]
        spec = submit_mapping_request(q.replace(mapping['name'], ""), format)
        print(spec)
        output = mapping["fn"](spec)()
        return output

    info = body.info
    print(f"info: {info} - {q}")
    if info:
        update_info(q)
        return {}

    db_path = get_db_file_path()
    db = get_db()

    info_path = get_info_file_path() 
    info_str: str = ""
    with open(info_path, "r+") as info_f:
        info_str = info_f.read()

    updated, db, result = submit(q, db, info_str)
    if updated:
        with open(db_path, "w+") as f:
            f.write(json.dumps(db))

    return { "updated": updated, "db": db, "result": result}

class AskInfo(BaseModel):
    prompt: str

@app.post("/ask")
def ask(body: AskInfo):
    prompt = body.prompt
    db = get_db()
    print(current)
    print(db)
    output = submit_ask_request(prompt, db)
    print(output)
    return { "message": output }


@app.post("/clear")
def clear():
    db_path = get_db_file_path()
    info_path = get_info_file_path()
    if os.path.exists(db_path):
        os.remove(db_path)
    if os.path.exists(info_path):
        os.remove(info_path)



class Init(BaseModel):
    name: str

@app.post("/init")
def init(body: Init):
    global current
    current = body.name

    return {"name": current}

def add_mapping(mapping):
    mappings.append(mapping)


