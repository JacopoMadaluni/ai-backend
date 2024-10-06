import { query, info, schema, clear } from "ai-backend";

jest.setTimeout(1200000);

describe("Main", () => {
	describe("easy", () => {
		const _schema = require("./@types.json");
		beforeAll(async () => {
			await clear();
			await info("database has todos which is a list of todo items");
			await schema(_schema);
		});

		afterAll(async () => {
			await clear();
		});

		it("should survive easy schema", async () => {
			await query("Create todo item 'Eat healthy'");
			await query("Create todo item 'Exercise'");
			await query("Create todo item 'Watch Arcane 2'");
			await query("Create todo item 'Actually do work'");
			await query("Mark todo 'Eat healthy' as done");
			const res = await query("Get todos in alphabetical order");
			expect(res).toEqual({
				updated: false,
				db: {
					todos: [
						{ title: "Actually do work", done: false },
						{ title: "Eat healthy", done: true },
						{ title: "Exercise", done: false },
						{ title: "Watch Arcane 2", done: false },
					],
				},
			});
		});
	});

	describe.only("medium", () => {
		const _schema = require("./@types.mid.json");
		beforeAll(async () => {
			await clear();
			await info("database has has a field for each sensible schema type");
			await schema(_schema);
		});

		afterAll(async () => {
			await clear();
		});

		it("should survive mid schema", async () => {
			await query(
				"Create 5 teachers, Ed Smith, John Doe, Jane Doe, Mary Smith, and Bob Smith. "
			);

			await query(
				"Set teacher's phone numbers should be all starting from 00000, incrementing by 1 for each of them. Starting from 0"
			);

			await query(
				"Set teacher's emails to be their first name and last name combined, all lowercase, with no spaces, @school.com "
			);

			await query(
				"Their date of birth should be 1990-01-01, 1991-01-01, 1992-01-01, 1993-01-01, and 1994-01-01 respectively."
			);

			await query(
				"Set Ed smith to teache Math, Science, " +
					"Set John Doe to teach History, Art, and Music. " +
					"Set all others to only teach English"
			);

			const res = await query(
				"Get me all subjects with relative teachers info"
			);
			// @ts-ignore
			expect(res.db.teachers).toEqual([
				{
					id: 1,
					hireDate: "",
					classesTeaching: [],
					firstName: "Ed",
					lastName: "Smith",
					phoneNumber: "00000",
					email: "edsmith@school.com",
					dateOfBirth: "1990-01-01",
					subjects: ["MATH", "SCIENCE"],
				},
				{
					id: 2,
					hireDate: "",
					classesTeaching: [],
					firstName: "John",
					lastName: "Doe",
					phoneNumber: "00001",
					email: "johndoe@school.com",
					dateOfBirth: "1991-01-01",
					subjects: ["HISTORY", "ART", "MUSIC"],
				},
				{
					id: 3,
					hireDate: "",
					classesTeaching: [],
					firstName: "Jane",
					lastName: "Doe",
					phoneNumber: "00002",
					email: "janedoe@school.com",
					dateOfBirth: "1992-01-01",
					subjects: ["ENGLISH"],
				},
				{
					id: 4,
					hireDate: "",
					classesTeaching: [],
					firstName: "Mary",
					lastName: "Smith",
					phoneNumber: "00003",
					email: "marysmith@school.com",
					dateOfBirth: "1993-01-01",
					subjects: ["ENGLISH"],
				},
				{
					id: 5,
					hireDate: "",
					classesTeaching: [],
					firstName: "Bob",
					lastName: "Smith",
					phoneNumber: "00004",
					email: "bobsmith@school.com",
					dateOfBirth: "1994-01-01",
					subjects: ["ENGLISH"],
				},
			]);

			const res2 = await query(
				"Give me the phone number of the teacher who teaches the most subjects. { phoneNumber: '??' }"
			);

			expect(res2.result).toEqual({
				phoneNumber: "00001",
			});
		});
	});

	describe("hard", () => {});
});

export {};
