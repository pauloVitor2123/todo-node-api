import fastify from "fastify";
import dotenv from "dotenv";
import taskRoutes from "./routes/task.routes";
import startDatabase from "./database";

dotenv.config();

const server = fastify({ logger: true });

// Connect database
startDatabase();

server.register(taskRoutes, { prefix: "/api/v1/tasks" });

// Start project
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
