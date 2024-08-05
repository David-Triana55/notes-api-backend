import mongoose from "mongoose";
import { server } from "../index.js";
import { Note } from "../models/Note.js";
import { api, getNotes, initialNotes } from "./helpers.js";

// antes de cada test se ejecuta lo que este en este metodo
beforeEach(async () => {
	// borar todos los elementos de la coleccion notes de la base de datos
	await Note.deleteMany({});

	// parallel
	// const notesObjects = initialState.map(note => new Note(note))
	// const promises = notesObjects.map(note => note.save());
	// await Promise.all(promises)

	// sequencial
	for (const note of initialNotes) {
		const noteObject = new Note(note);
		await noteObject.save();
	}
});

describe("GET all notes", () => {
	test("notes are returned as json", async () => {
		// los métodos de petición son asincronos
		const response = await api.get("/api/notes");
		console.log(response);
		expect(response.statusCode).toBe(200);

		// Verifica que el tipo de contenido sea application/json
		expect(response.headers["content-type"]).toMatch(/application\/json/);
	});

	test("there are two notes", async () => {
		// devuelve la respuesta de la api
		const { response } = await getNotes();
		expect(response.body).toHaveLength(initialNotes.length);
	});

	test("there first note is about joshua", async () => {
		// devuelve la respuesta de la api
		const { response } = await getNotes();
		expect(response.body[0].content).toBe("ya le escribi a joshua");
	});

	test("there is the phrase in the database", async () => {
		const { contents } = await getNotes();
		console.log(contents);
		// toContain when you want check if the item is inside array
		expect(contents).toContain("ya le escribi a joshua");
	});
});

describe("POST create note", () => {
	test("a valid note can be added", async () => {
		const newNote = {
			content: "aprendiendo a testear con supertest",
			important: true,
		};

		await api
			.post("/api/notes")
			.send(newNote) // enviamos la nueva nota a /api/notes nos ayuda supertest
			.expect(200) // se espera que devuelva 200
			.expect("Content-Type", /application\/json/);
		const { contents } = await getNotes();

		expect(contents).toHaveLength(initialNotes.length + 1);
		expect(contents).toContain(newNote.content);
	});

	test("a valid note without content", async () => {
		const newNote = {
			important: true,
		};

		await api
			.post("/api/notes")
			.send(newNote) // enviamos la nueva nota a /api/notes nos ayuda supertest
			.expect(400);

		const { response } = await getNotes();
		expect(response.body).toHaveLength(initialNotes.length);
	});
});

describe("PUT update notes", () => {
	test("update note with id", async () => {
		const { response } = await getNotes();
		const { id } = response.body[0];

		const newNote = {
			content: "no le he escrito a joshua",
			important: true,
		};

		await api
			.put(`/api/notes/${id}`)
			.send(newNote) // enviamos la nueva nota a /api/notes nos ayuda supertest
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const { contents } = await getNotes();
		console.log(contents);
		expect(contents).not.toContain(initialNotes[0].content);
	});

	test("try to update with id uknown", async () => {
		const newNote = {
			content: "no le he escrito a joshua",
			important: true,
		};

		await api
			.put("/api/notes/1223")
			.send(newNote) // enviamos la nueva nota a /api/notes nos ayuda supertest
			.expect(400);
	});
});

describe("DELETE notes", () => {
	test("delete note with id", async () => {
		const { response } = await getNotes();
		const { id } = response.body[0];
		await api.delete(`/api/notes/${id}`).expect(204);
		const { contents } = await getNotes();
		expect(contents).toHaveLength(initialNotes.length - 1);
	});

	test("try delete note with id unkonw", async () => {
		await api.delete("/api/notes/1234").expect(400);
	});
});

afterAll(async () => {
	server.close(); // Cierra el servidor  después de las pruebas
	await mongoose.connection.close();
});
