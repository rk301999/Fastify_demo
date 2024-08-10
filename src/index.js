import Fastify from "fastify";
import rootRoute from "./routes/rootRoute.js";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import fastifyCors from "@fastify/cors";
// import Redis from "ioredis";
// import fastifyRedis from "@fastify/redis";
// import fastifyBcrypt from "fastify-bcrypt";

dotenv.config();
const port = process.env.PORT || 8000;

//create a instance of fastify , uses pino under the hood
const fastify = Fastify({
  logger: true,
});

// const redis = new Redis({
//   host: 'localhost', 
//   port: 6379,        
// });

// fastify.decorate('redis',redis);


const start = async () => {
  try {
    // Register plugins
    await fastify.register(fastifyCors);
    
   

    // Register routes
    fastify.register(rootRoute, { prefix: "/api/v1" });

    // DB connection
    await connectDB();

    fastify.get("/", async (request, reply) => {
      reply.send("Build using Fastify");
    });

  }
  catch(error){
    console.log("error while loading the plugins");
  } 
  fastify.listen({ port }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  });
};

start();

