import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import myMiddleware from "./middleware.js";
import { handleError } from "./middleware/handleError.js";

import { notFound } from "./middleware/notFound.js";
import { Note } from "./models/Note.js";
import { mongoDb } from "./mongo.js";
dotenv.config();
const app = express();

mongoDb();
app.use(cors());
app.use(express.json());
app.use(myMiddleware);

const notes = [];

// first request get returns Hello world

app.get("/", (req, res) => {
	res.send("<p>Hello World</p>");
});

// request type get return all notes from database

app.get("/api/notes", (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes);
	});
});

// request type get return the note with id from database

app.get("/api/notes/:id", (req, res, next) => {
	const { id } = req.params;
	Note.findById(id)
		.then((note) => {
			if (note) {
				res.json(note);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

// request type post , we create a note and put in database

app.post("/api/notes", (req, res) => {
	console.log("Body:", req.body);
	const info = req.body;

	if (!info.content) {
		res.status(404).json({
			error: 'required "content" field is missing',
		});
	}

	const note = new Note({
		content: info.content,
		date: new Date(),
		important: info.important || false,
	});

	note
		.save()
		.then((response) => {
			console.log(response);
			res.json(response);
			mongoose.connection.close();
		})
		.catch((err) => {
			console.error(err);
		});
});

// request type put, update info with id from database

app.put("/api/notes/:id", (req, res, next) => {
	const { id } = req.params;
	const note = req.body;

	const newNote = {
		content: note.content,
		important: note.important,
	};

	Note.findByIdAndUpdate(id, newNote, { new: true })
		.then((response) => {
			res.json(response);
		})
		.catch((err) => next(err));
});

// request type delete with id from database

app.delete("/api/notes/:id", (req, res, next) => {
	const { id } = req.params;

	Note.findByIdAndDelete(id)
		.then((response) => {
			res.status(204).end();
		})
		.catch((err) => next(err));
});

// middleware not found enpoint
app.use(notFound);

// middleware para el error
app.use(handleError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	console.log("http://localhost:3003");
});
