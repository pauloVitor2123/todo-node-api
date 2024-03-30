import http from "http";
import { Server, Socket } from "socket.io";

const server = http.createServer();

export const io = new Server(server);

io.on("connection", (socket: Socket) => {
  socket.on("updateTask", (taskId: string) => {
    io.emit("taskUpdated", taskId);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Websocket server start ${PORT}`);
});
