import mongoose from "mongoose";
import { server } from "../index.js";
import { User } from "../models/User.js";
import { api } from "./helpers.js";

beforeEach(async () => {
	await User.deleteMany({});

	const user = new User({
		username: "david",
		name: "felipe",
		passwordHash: "password",
	});
	await user.save();
});

describe("creating new user", () => {
	test("works as expected creating a fresh username", async () => {
		const usersDB = await User.find({});
		const newUser = {
			username: "davi55",
			name: "David felipe",
			password: "password",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const response = await api.get("/api/users");
		expect(response.statusCode).toBe(200);
		// Verifica que el tipo de contenido sea application/json
		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.body).toHaveLength(usersDB.length + 1);
	});

	test("creation fails with proper statuscode and message if username is taken", async () => {
		const usersDB = await User.find({});

		const newUser = {
			username: "david",
			name: "david felipe",
			password: "javascript",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.errors.username.message).toContain(
			" `username` to be unique",
		);
		const response = await api.get("/api/users");
		expect(response.body).toHaveLength(usersDB.length);
	});
});

afterAll(async () => {
	server.close(); // Cierra el servidor  después de las pruebas
	await mongoose.connection.close();
});
