import { FastifyRequest, FastifyReply } from "fastify";

// Extiende la interfaz FastifyRequest para incluir la propiedad 'user'
declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
  }
}
import { auth } from "../config/firebaseconfig";  

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return reply.status(401).send({ error: 'Authorization header missing' });
    }
    //extracccion
    const token = authHeader.split(' ')[1]; 
    if (!token) {
      return reply.status(401).send({ error: 'Token missing from authorization header' });
    }
    const decodedToken = await auth.verifyIdToken(token);  
    request.user = decodedToken;  //
    request.log.info('Token verified successfully', { decodedToken });
    
    return; // Si la verificación del token es exitosa, continúa

  } catch (error) {
    console.error("Authentication error:", error);
    return reply.status(401).send({ error: 'Invalid token' });
  }
};
