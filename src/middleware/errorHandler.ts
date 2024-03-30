import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const errorHandler = async (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    return reply.status(500).send("An internal server error occurred.");
  }

  console.error("Unexpected error:", error);
  return reply.status(500).send("An internal server error occurred.");
};

export default async function errorHandlerMiddleware(fastify: FastifyInstance) {
  fastify.setErrorHandler(errorHandler);
}
