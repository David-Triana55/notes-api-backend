import mongoose from "mongoose";
const connection = `mongodb+srv://davidtriana796:pkMYOHDwMYDRP7eo@cluster0.xtbyilv.mongodb.net/davidb?retryWrites=true&w=majority&appName=Cluster0
`;

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
