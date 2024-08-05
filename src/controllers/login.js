import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
dotenv.config();
const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		// obtenemos los valores de la peticion y hacemos una consulta a la base de datos
		const user = await User.findOne({ username });

		// Si el usuario no se encuentra, respondemos con un error

		// Comparamos la clave que digitan con la que hay en la base de datos
		const passwordCorrect =
			user === null ? false : await bcrypt.compare(password, user.passwordHash);

		if (!user || !passwordCorrect) {
			return res.status(401).json({
				error: "invalid user or password",
			});
		}

		const userForToken = {
			id: user._id,
			username: user.username,
		};

		// const token = jwt.sign(payload, secretKey, { options });
		// payload: información que se quiere enviar en el token
		// secretKey: clave secreta para firmar el token
		// options: configuración del token

		const token = jwt.sign(userForToken, process.env.SECRET);

		// Respondemos con los detalles del usuario si la autenticación es correcta
		res.json({
			name: user.name,
			username: user.username,
			token,
		});
	} catch (error) {
		// Pasamos el error al middleware de manejo de errores
		next(error);
	}
});
export default loginRouter;
