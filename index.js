import cors from "cors";
import express from "express";
import myMiddleware from "./middleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(myMiddleware);

const notes = [
	{
		id: 1,
		content: "Me tengo que suscribir en youtube",
		date: "2019-05-30T17:30:31.000Z",
		important: true,
	},
	{
		id: 2,
		content: "Tengo que estudiar las clases de fullstack bootcamp",
		date: "2019-05-30T17:30:31.043Z",
		important: true,
	},
	{
		id: 3,
		content: "Repasar los retos de js de midudev",
		date: "2019-05-30T17:30:25.456Z",
		important: false,
	},
];

app.get("/", (req, res) => {
	res.send("<p>Hello World</p>");
});

app.get("/api/notes", (req, res) => {
	res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id);
	const note = notes.find((n) => n.id === id);
	if (note) {
		res.json(note);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/notes/:id", (req, res, next) => {
	const id = Number(req.params.id);
	const noteIndex = notes.findIndex((n) => n.id === id);
	if (noteIndex !== -1) {
		notes.splice(noteIndex, 1);
		res.json(notes);
	}
});

app.post("/api/notes", (req, res) => {
	console.log("Headers:", req.headers);
	console.log("Body:", req.body);
	const newNote = req.body;
	const date = new Date();
	const maxId = notes.map((note) => note.id);
	const id = Math.max(...maxId) + 1;
	notes.push({ id, ...newNote, date, important: false });
	res.json(notes);
});

app.use((req, res) => {
	console.log(req.path);
	res.status(404).json({
		error: "Not Found",
	});
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	console.log("http://localhost:3003");
});
