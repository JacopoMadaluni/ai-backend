import React from "react";
import TodoApp from "./TodoApp";
import InternalTool from "./InternalTool";
import Wth from "./WhatToEat";
import { Button } from "@mui/material";

const App = () => {
	const [page, setPage] = React.useState("todo");

	const Current = () => {
		if (page === "todo") {
			return <TodoApp />;
		} else if (page === "internal") {
			return <InternalTool />;
		} else {
			return <Wth />;
		}
	};

	return (
		<div
			className="App"
			style={{
				padding: "1%",
				width: "100vw",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				gap: 30,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					gap: 10,
				}}
			>
				<Button onClick={() => setPage("internal")}>Demo 1</Button>
				<Button onClick={() => setPage("todo")}>Demo 2</Button>
				<Button onClick={() => setPage("wth")}>Demo 3</Button>
			</div>
			<Current />
		</div>
	);
};

export default App;
