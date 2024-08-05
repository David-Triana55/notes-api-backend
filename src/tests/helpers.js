import supertest from "supertest";
// mock of notes
import app from "../index";

export const api = supertest(app);
export const initialNotes = [
	{
		content: "ya le escribi a joshua",
		date: "2024-07-27T00:00:59.744Z",
		important: false,
		id: "66a438bb77673e384d353173",
	},
	{
		content: "estoy tomando cafe",
		date: "2024-07-27T00:12:53.786Z",
		important: false,
		id: "66a43b8539064a92ea275ec1",
	},
];

// function for factor code
export async function getNotes() {
	const response = await api.get("/api/notes");
	const contents = response.body.map((note) => note.content);

	return { response, contents };
}
