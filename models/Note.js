import { Schema, model } from "mongoose";

const noteSchema = new Schema({
	content: String,
	date: Date,
	important: Boolean, // Boolean is shorthand for
});

noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject._id;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject.__v;
	},
});

export const Note = model("Note", noteSchema);
