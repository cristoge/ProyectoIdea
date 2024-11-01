import Fastify from 'fastify';
import { db, auth } from '../src/config/firebaseconfig';

const fastify = Fastify({ logger: true });

fastify.get('/users', async (request, reply) => {
  try {
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
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    // Usa la variable de entorno PORT, con un valor por defecto de 3000 si no está definida
    const port = 3000;
    await fastify.listen({ port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
