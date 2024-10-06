import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { init, schema, query, info, ask } from "ai-backend";

import * as types from "../@types.wth";
import _schema from "../@types.wth.json";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
type P = {
	card: types.Recipe;
};
const Recipe: React.FC<P> = ({ card }) => {
	return (
		<Card variant="outlined" sx={{ maxWidth: 560 }}>
			<Box sx={{ p: 2 }}>
				<Stack
					direction="row"
					sx={{ justifyContent: "space-between", alignItems: "center" }}
				>
					<Typography gutterBottom variant="h6" component="div">
						{card.name}
					</Typography>
				</Stack>
				<Stack direction={"row"}>
					<Chip
						label={`${card.difficulty}`}
						size="small"
						color={
							card.difficulty === "easy"
								? "success"
								: card.difficulty === "medium"
								? "warning"
								: "error"
						}
					/>
					<Chip
						label={`${card.messiness}`}
						size="small"
						color={
							card.messiness === "low"
								? "success"
								: card.messiness === "medium"
								? "warning"
								: "error"
						}
					/>
				</Stack>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{card.messiness}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{ p: 2 }}>
				<Typography gutterBottom variant="body2">
					Incgredients
				</Typography>
				<Stack
					direction="row"
					spacing={1}
					style={{ overflowX: "scroll", height: 50 }}
				>
					{card.ingredients.map((ingredient, index) => (
						<Chip key={index} label={ingredient} size="small" />
					))}
				</Stack>
			</Box>
		</Card>
	);
};

const WhatToEat = () => {
	const [input, setInput] = useState("");
	const [s, setS] = useState<types.State>();
	const [message, setMessage] = useState("");

	useEffect(() => {
		init("what_to_eat")
			.then(() => schema(_schema))
			.then(() => info("database should always return the full state"))
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

	const askAI = () => {
		init("what_to_eat")
			.then(() => ask(input))
			.then((res) => {
				setMessage(res);
			});
	};

	if (!s) {
		return (
			<Box>
				<CircularProgress />;
			</Box>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				padding: 20,
				flexDirection: "column",
				gap: 20,
				alignItems: "flex-start",
				justifyContent: "flex-start",
			}}
		>
			<div
				style={{
					width: "100%",
					flexDirection: "row",
					gap: 10,
					justifyContent: "space-between",
				}}
				className="flex mb-4"
			>
				<TextField
					type="text"
					fullWidth
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Add a new todo"
				/>
				<Typography>{message}</Typography>
			</div>
			<div
				style={{
					width: "100%",
					flexDirection: "row",
					gap: 10,
					justifyContent: "space-between",
				}}
			>
				<Button
					onClick={submit}
					className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Submit
				</Button>
				<Button
					onClick={askAI}
					className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Ask
				</Button>
			</div>
			<div
				style={{
					display: "flex",
					gap: 20,
					padding: 10,
				}}
			>
				<Box width={300}>
					<h1>Monday</h1>
					{s?.days.monday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
				<Box width={300}>
					<h1>Tuesday</h1>
					{s?.days.tuesday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
				<Box width={300}>
					<h1>Wednesday</h1>
					{s?.days.wednesday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
			</div>
			<div style={{ display: "flex", gap: 20, padding: 10 }}>
				<Box width={300}>
					<h1>Thursday</h1>
					{s?.days.thursday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
				<Box width={300}>
					<h1>Friday</h1>
					{s?.days.friday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
				<Box width={300}>
					<h1>Saturday</h1>
					{s?.days.saturday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
			</div>
			<div style={{ display: "flex", gap: 20, padding: 10 }}>
				<Box width={300}>
					<h1>Sunday</h1>
					{s?.days.sunday.map((recipe, index) => (
						<Recipe key={index} card={recipe} />
					))}
				</Box>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 5,
					position: "absolute",
					top: 200,
					right: 20,
				}}
			>
				{s.recipes.map((recipe, index) => (
					<Chip key={index} label={recipe.name} />
				))}
			</div>
		</div>
	);
};

export default WhatToEat;
