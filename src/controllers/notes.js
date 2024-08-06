*deimport dotenv from "dotenv";
import express from "express";
import userExtractor from "../middleware/userExtractor.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";
dotenv.config();

const notesRouter = express.Router();

// Obtener todas las notas
notesRouter.get("/", async (req, res, next) => {
	try {
		const notes = await Note.find({}).populate("user", {
			username: 1,
			name: 1,
		});
		res.json(notes);
	} catch (error) {
		next(error);
	}
});

// Obtener una nota por ID
notesRouter.get("/:id", async (req, res, next) => {
	try {
		const note = await Note.findById(req.params.id).populate("user", {
			username: 1,
			name: 1,
		});
		if (note) {
			res.json(note);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		next(error);
	}
});

// Crear una nueva nota
notesRouter.post("/", userExtractor, async (req, res, next) => {
	try {
		const { userId } = req;
		console.log(req, "----------------------------------------------------");
		const { content, important = false } = req.body;
		const user = await User.findById(userId);

		if (!content) {
			return res.status(400).json({
				error: 'required "content" field is missing',
			});
		}

		const note = new Note({
			content: content,
			date: new Date(),
			important: important,
			user: user._id,
		});

		const savedNote = await note.save();
		user.notes = user.notes.concat(savedNote._id);
		await user.save();

		res.json(savedNote);
	} catch (error) {
		next(error);
	}
});

// Actualizar una nota por ID
notesRouter.put("/:id", userExtractor, async (req, res, next) => {
	const { id } = req.params;
	const { content, important } = req.body;

	const newNote = {
		content: content,
		important: important,
	};

	try {
		const updatedNote = await Note.findByIdAndUpdate(id, newNote, {
			new: true,
		});
		res.json(updatedNote);
	} catch (error) {
		next(error);
	}
});

// Eliminar una nota por ID
notesRouter.delete("/:id", userExtractor, async (req, res, next) => {
	const { id } = req.params;

	try {
		await Note.findByIdAndDelete(id);
		res.status(204).end();
	} catch (err) {
		next(err);
	}
});

export default notesRouter;
