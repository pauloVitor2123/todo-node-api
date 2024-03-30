import fastify from "fastify";
import dotenv from "dotenv";
import taskRoutes from "./routes/task.routes";
import mongoose from "mongoose";

dotenv.config();

const server = fastify({ logger: true });

// Connect database
mongoose
  .connect(process.env.MONGODB_URI as string, {
    dbName: "todo-database",
  })
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Error connecting to database", e));

server.register(taskRoutes, { prefix: "/api/v1/tasks" });

// Start project
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
