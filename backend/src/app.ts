import Fastify from "fastify";
import { db, auth } from "../src/config/firebaseconfig";
import { userRoutes } from "./routes/userRoutes";
import fastifyCors from '@fastify/cors';
import dotenv from "dotenv";
dotenv.config();

const app = Fastify({ logger: true });
app.register(fastifyCors, {
  origin: 'http://localhost:5173', // Cambia a la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Si tu frontend envía cookies o headers de autenticación
});
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
