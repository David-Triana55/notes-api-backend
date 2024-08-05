import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const userExtractor = (req, res, next) => {
	const authHeader = req.get("authorization");
	let token = "";

	// revisar si el header de autorización existe y comienza con 'Bearer'
	if (authHeader?.toLowerCase().startsWith("bearer")) {
		// Extraer el token del header
		token = authHeader.split(" ")[1];
	}
	if (!token) {
		return res.status(401).json({ error: "Token missing" });
	}

	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.SECRET);
	} catch (err) {
		return res.status(401).json({ error: "Token invalid" });
	}

	if (!decodedToken.id) {
		return res.status(401).json({ error: "Token invalid" });
	}
	console.log(req.userId);
	req.userId = decodedToken.id;
	req.hola = "hola";
	next();
};

export default userExtractor;
