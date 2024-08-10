import jwt from "jsonwebtoken"

export const authJWT = async(request ,reply )=>{

    const authHeader = request.headers['authorization'];
    console.log(authHeader);
    if(!authHeader){
        reply.code(403).send("you are not authorised")
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log("decoded",decoded);
        request.userId = decoded.id;
    }catch(error){
        return reply.code(403).send("not authorised");
    }
}