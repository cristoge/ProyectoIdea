import Fastify from 'fastify';
import { db, auth } from '../src/config/firebaseconfig';
import dotenv from 'dotenv';
dotenv.config();

const app = Fastify({ logger: true });

app.get('/users', async (request, reply) => {
  try {
    // Cambiar User por user y usar minusculas
    const usersSnapshot = await db.collection('User').get(); 
    const users: any[] = []; // Cambia 'any' por un tipo específico si tienes uno

    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    reply.send(users);
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ error: 'Error al obtener los usuarios' });
  }
});

// Endpoint raíz
app.get('/', async (request, reply) => {
  reply.send('Servidor funcionando')
});

const start = async () => {
  try {
    // Uso de variable de entorno
    const port = parseInt(process.env.PORT || '4000', 10);
    await app.listen({ port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
