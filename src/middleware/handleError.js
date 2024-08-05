const ERROR_HANDLERS = {
	CastError: (res) => res.status(400).send({ error: "id used is incorrect" }),
	validationError: (res, { message }) =>
		res.status(409).send({ error: message }),
	TypeError: (res) => res.status(400).end(),
	defaultError: (res) => res.status(500).end(),
};

export const handleError = (error, req, res, next) => {
	console.log(error.name, "error");
	const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
	handler(res, error);
};
