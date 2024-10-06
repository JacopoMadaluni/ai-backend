# AI Backend

## Before you get started

There are two parts to this projects:

- `ai-backend` python api
- `ai-backend` typescript sdk
- Make sure you have mistral api-token at hand

## Get the python API up and running

Install the package

```
pip install ai-backend
```

Install uvicorn

```
pip install uvicorn
```

To run the API, you'll need a .env with your mistral token:

```.env
API_TOKEN=<your mistral token>
```

After this, you just need to run it as such:

```python
import dotenv
dotenv.load_dotenv()

from ai_backend import app, add_mapping

if __name__ == "__main__":
    from uvicorn import run
    run(app)
```

### (Optional) - Adding mappings

You can add mappings to your internal tooling so that you can use the ai-backend to perform calls to internal APIs, SDKs, anything you have in mind.

#### Anatomy of a mapping

This is an example from one of Audiogen's internal sdks

1. Define a format input to your mapping

```python
format = {
    "source": "str",
    "amount": "int",
    "random": "bool",
    "query": "str (odata query)"
}
```

2. Create a mapping function that given the format input, return an executable function

```python
def map_fn(operation: dict):
    import audiogen_io
    def exe():
        query = [{
            "source": operation['source'],
            "amount": operation['amount'],
            "query": operation['query'] if "query" in operation and operation['query'] else None
        }]

        print(query)
        list = [item.item for item in audiogen_io.select(query).apply()]
        return list
    return exe
```

3. Finally, export a mapping object:

```python
mapping = {
    "fn": map_fn,
    "format": format,
    "name": "audiogen_io"
}
```

After all, my mapping file looks like this:

```python
import audiogen_io

format = {
    "source": "str",
    "amount": "int",
    "random": "bool",
    "query": "str (odata query)"
}
def map_fn(operation: dict):
    if operation['random']:
        def exe():
            item = audiogen_io.random_selector([operation['source']]).get_random()[0]
            return item.item
    else:
        def exe():
            query = [{
                "source": operation['source'],
                "amount": operation['amount'],
                "query": operation['query'] if "query" in operation and operation['query'] else None
            }]

            print(query)
            list = [item.item for item in audiogen_io.select(query).apply()]
            return list
    return exe


mapping = {
    "fn": map_fn,
    "format": format,
    "name": "audiogen_io"
}
```

### Loading a mapping

To load a mapping onto ai-backend, it's enough to add it like so:

```python
import dotenv
dotenv.load_dotenv()
from ai_backend import app, add_mapping

if __name__ == "__main__":
    import mappings.my_mapping
    from uvicorn import run
    add_mapping(mappings.my_mapping.mapping)
    run(app)
```

## Get Typescript SDK

```
yarn add ai-backend
```

Assuming your ai-backend server is up and running, you can now query your AI backend!

```javascript
import { init, query, info, schema } from "ai-backend";

const main = async () => {
	// Give a name to the backend
	// This is necessary if you want to have multiple
	// backends active at the same time
	await init("my_project");
	await info("This is a sample project of a school system");

	const _schema = require("./schema.json");
	// Optional
	// You can give the backend a schema to stick to
	await schema(_schema);

	// Start messing around!
	await query("Add a new student to the system, Nikola Tesla");
	await query("Add a new student to the system, Albert Einstein");
	await query("Add a new student to the system, Isaac Newton");
	await query("Add a new student Edgar A.Poe");

	await query("Add Isaac newton to the physics class");
	await query("Add Albert Einstein to the physics class");
	await query("Add Nikola Tesla to the physics class");
	await query("Add Edgar A.Poe to the literature class");

	const res = await query("List all students in the physics class");

	// This will hold the database as well as the result of the latest query
	console.log(res.db);

	// If mappings where configured, you can call a specific mapping as well
	// e.g. query("<mapping_name> <your query>")
	await query("[MIXPANEL] Get me all emails that signed up in the last 7 days");
};
```

## Having ai-backend stick to a frontend schema

In my opinion, this is where everything comes together.
The problem of AI is often that it's inconsistent with his responses, but ai-backend has a neat way of having your schema defined once, on the frontend, and the backend will magically handle it accordingly.

### First define a frontend schema

I do this anyway as I like my frontends to be typed:

```typescript
export type UUID = string;
export type Email = string;
export type PhoneNumber = string;
export type Date = string; // ISO 8601 format
export enum Subject {
	MATH = "MATH",
	SCIENCE = "SCIENCE",
	ENGLISH = "ENGLISH",
	HISTORY = "HISTORY",
	ART = "ART",
	MUSIC = "MUSIC",
	PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION",
}
export enum Grade {
	FRESHMAN = "FRESHMAN",
	SOPHOMORE = "SOPHOMORE",
	JUNIOR = "JUNIOR",
	SENIOR = "SENIOR",
}
export interface Person {
	id: number;
	firstName: string;
	lastName: string;
	email: Email;
	phoneNumber: PhoneNumber;
	dateOfBirth: Date;
}
export interface Teacher extends Person {
	subjects: Subject[];
	hireDate: Date;
	classesTeaching: UUID[]; // Reference to Class IDs
}
export interface Student extends Person {
	grade: Grade;
	enrollmentDate: Date;
	classesAttending: UUID[]; // Reference to Class IDs
}
export interface Class {
	id: UUID;
	name: string;
	subject: Subject;
	teacherId: UUID; // Reference to Teacher ID
	studentIds: UUID[]; // Reference to Student IDs
	schedule: ClassSchedule;
}
export interface ClassSchedule {
	dayOfWeek: string;
	startTime: string; // HH:MM format
	endTime: string; // HH:MM format
	roomNumber: string;
}
// Type for the entire database
export interface SchoolDatabase {
	teachers: Teacher[];
	students: Student[];
	classes: Class[];
}
```

### Second - Turn it into a json format

With a simple script I was able to generate a json representation.

```json
{
  "UUID": "string",
  "Email": "string",
  "PhoneNumber": "string",
  "Date": "string",
  "Subject": {
    "MATH": "\"MATH\"",
    "SCIENCE": "\"SCIENCE\"",
    "ENGLISH": "\"ENGLISH\"",
    "HISTORY": "\"HISTORY\"",
    "ART": "\"ART\"",
    "MUSIC": "\"MUSIC\"",
    "PHYSICAL_EDUCATION": "\"PHYSICAL_EDUCATION\""
  },
  "Grade": {
    "FRESHMAN": "\"FRESHMAN\"",
    "SOPHOMORE": "\"SOPHOMORE\"",
    "JUNIOR": "\"JUNIOR\"",
    "SENIOR": "\"SENIOR\""
  },
  "Person": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "Email",
    "phoneNumber": "PhoneNumber",
    "dateOfBirth": "Date"
  },
  "Teacher": {
    "subjects": [
      "Subject"
    ],
    "hireDate": "Date",
    "classesTeaching": [
      "UUID"
    ]
  },
  ...
}
```

### Finally - Set the schema

```javascript
import MySchema from "./schema.json";
import { schema } from "ai-backend";

await schema(MySchema);
```

Now, every response will conform to it

```javascript
const res = query("...");

console.log(res);
```

```typescript
type res = {
	updated: bool;
	db: MySchema;
	result: any;
};
```

## Where everything comes together

Finally, I can magically make a completely functioning frontend component, with typing and intellisense, without writing any backend nor databases.

```javascript
const MyComponent = () => {
	const [input, setInput] = useState("");
	const [s, setS] = useState<types.State>();
	const [message, setMessage] = useState("");

	useEffect(() => {
		init("what_to_eat")
			.then(() => schema(_schema))
			.then(() => query<types.State>("Get me the current database"))
			.then((res) => {
				setS(res.db);
			});
	}, []);

	const submit = () => {
		query<types.State>(input).then((res) => {
			console.log(res);
			setS(res.db);
		});
	};
}
```

I can now prototype my UI by just querying and modifying the backend via natural language.
