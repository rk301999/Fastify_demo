import authRoute from "./authRoute.js";
async function rootRoute(fastify,options){

    fastify.register(authRoute,{prefix:"/auth"})
    
}
export default rootRoute;