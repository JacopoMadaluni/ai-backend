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
