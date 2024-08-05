import { Schema, model } from "mongoose";

const noteSchema = new Schema({
	content: String,
	date: Date,
	important: Boolean,
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.idN = returnedObject._id;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject._id;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject.__v;
	},
});

export const Note = model("Note", noteSchema);
