import Fastify from "fastify";
import { db, auth } from "../src/config/firebaseconfig";
import { userRoutes } from "./routes/userRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = Fastify({ logger: true });
//Registrar las rutas
app.register(userRoutes);

// Endpoint raíz
app.get("/", async (request, reply) => {
  reply.send("Servidor funcionando");
});

const start = async () => {
  try {
    // Uso de variable de entorno
    const port = parseInt(process.env.PORT || "4000", 10);
    await app.listen({ port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
