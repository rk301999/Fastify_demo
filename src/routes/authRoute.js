import { register } from "../controllers/authController.js";
import { signin } from "../controllers/authController.js";
import { getUsers } from "../controllers/authController.js";
import { authJWT } from "../middlewares/authJWT.js";

async function authRoute(fastify,options){
    
    fastify.post("/register",register);
    fastify.post("/signin",signin);
    fastify.get("/getusers",{preHandler:authJWT},getUsers);
    
    
}
export default authRoute;