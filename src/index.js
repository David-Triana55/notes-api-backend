import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import loginRouter from "./controllers/login.js";
import notesRouter from "./controllers/notes.js";
import usersRouter from "./controllers/users.js";
import { handleError } from "./middleware/handleError.js";
import { notFound } from "./middleware/notFound.js";
import { mongoDb } from "./mongo.js";
// dotenv se usa para cargar las variables de entorno
dotenv.config();
const app = express();

mongoDb();
app.use(cors());
app.use(express.json());
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// middleware not found enpoint
app.use(notFound);

// middleware para el error
app.use(handleError);

const { PORT, PORT_TEST, NODE_ENV } = process.env;
const connection = NODE_ENV === "test" ? PORT_TEST : PORT;

export const server = app.listen(connection, () => {
	console.log(`Listening on port ${connection}`);
});

export default app;
