export const handleError = (error, req, res, next) => {
	console.log(error.name);

	if (error.name === "CastError") {
		res.status(400).send({
			error: "id used is incorrect",
			http: 400,
		});
	} else {
		res.status(500).send({
			error: "Not Found",
		});
	}
};
