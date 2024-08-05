import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
	},
	name: String,
	passwordHash: String,
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note",
		},
	],
});

// cambiar nombre o no mostrar cierta informacion de la base de datos
userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.idU = returnedObject._id;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject._id;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject.__v;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete returnedObject.passwordHash;
	},
});

userSchema.plugin(mongooseUniqueValidator);

export const User = model("User", userSchema);
