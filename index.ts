import fastify from "fastify";

const server = fastify();

// server.get<{
//   Querystring: IQuerystring,
//   Headers: IHeaders,
//   Reply: IReply
// }>('/auth', async (request, reply) => {
//   const { username, password } = request.query
//   const customerHeader = request.headers['h-Custom']
//   // do something with request data

//   // chaining .statusCode/.code calls with .send allows type narrowing. For example:
//   // this works
//   reply.code(200).send({ success: true });
//   // but this gives a type error
//   reply.code(200).send('uh-oh');
//   // it even works for wildcards
//   reply.code(404).send({ error: 'Not found' });
//   return `logged in!`
// })

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
