import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const connection = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;

export const mongoDb = () => {
	mongoose
		.connect(connection)
		.then(() => {
			console.log("database conected");
		})
		.catch((err) => {
			console.error(err);
		});
};

// const note = new Note({
// 	content: "Aprendiendo mongoDb",
// 	data: new Date(),
// 	important: true,
// });

// note
// 	.save()
// 	.then((response) => {
// 		console.log(response);
// 		mongoose.connection.close();
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 	});
