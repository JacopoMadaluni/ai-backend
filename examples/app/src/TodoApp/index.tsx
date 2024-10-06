import React, { useState } from "react";
import { info, query, schema } from "ai-backend";
import { Todo as TodoType } from "../@types";
import T from "../@types.json";

import { TextField, Button } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

type Props = {
	card: TodoType;
};
const TodoCard: React.FC<Props> = ({ card }) => {
	return (
		<Card variant="outlined" sx={{ maxWidth: 360 }}>
			<Box sx={{ p: 2 }}>
				<Stack
					direction="row"
					sx={{ justifyContent: "space-between", alignItems: "center" }}
				>
					<Typography gutterBottom variant="h5" component="div">
						{card.title}
					</Typography>
					<Typography gutterBottom variant="h6" component="div">
						{card.done ? "Done" : "Not done"}
					</Typography>
				</Stack>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{card.description}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{ p: 2 }}>
				<Typography gutterBottom variant="body2">
					Labels
				</Typography>
				<Stack direction="row" spacing={1}>
					{card.labels.map((label, index) => (
						<Chip key={index} label={label} size="small" />
					))}
				</Stack>
			</Box>
		</Card>
	);
};

const TodoApp = () => {
	const [ready, setReady] = useState(false);
	const [todos, setTodos] = useState<TodoType[]>([]);
	const [input, setInput] = useState("");

	React.useEffect(() => {
		info("database has todos which is a list of todo items")
			.then(() => schema(T))
			.then(() => {
				setReady(true);
			});
	}, []);

	const handleInputChange = (e: any) => {
		setInput(e.target.value);
	};

	const handleSubmit = () => {
		query<any>(`${input}`).then((res) => {
			console.log({ res });
			if (typeof res.result === "object") {
				setTodos(res.result);
				return;
			}
			setTodos(res.db.todos);
		});
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				gap: 20,
			}}
		>
			<h1 className="text-2xl font-bold mb-4">Todo App</h1>
			<div className="flex mb-4">
				<TextField
					type="text"
					value={input}
					onChange={handleInputChange}
					className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Add a new todo"
				/>
				<Button
					onClick={handleSubmit}
					className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Add
				</Button>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{todos.map((todo, index) => (
					<TodoCard key={index} card={todo} />
				))}
			</div>
		</div>
	);
};

export default TodoApp;
