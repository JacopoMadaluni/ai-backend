import React, { useEffect, useState } from "react";
import { query } from "ai-backend";

const InternalTool = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");

	useEffect(() => {
		const fn = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				fireQuery();
			}
		};
		document.addEventListener("keydown", fn);

		return () => {
			document.removeEventListener("keydown", fn);
		};
	}, []);

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		console.log(e.target.value);
	};

	const fireQuery = () => {
		console.log(input);
		query(input).then((res) => {
			setOutput(JSON.stringify(res, null, 2));
		});
	};

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<h1>Internal Tool</h1>
			<input onChange={onInputChange} value={input}></input>
			<button onClick={fireQuery}>Go</button>
			<textarea
				style={{ marginTop: 20 }}
				contentEditable={false}
				value={output}
			/>
		</div>
	);
};

export default InternalTool;
