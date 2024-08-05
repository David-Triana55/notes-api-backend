export const notFound = (req, res) => {
	res.status(400).json({
		error: "Not Found",
	});
};
