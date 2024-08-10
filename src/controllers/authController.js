
import fastify from "fastify";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async(request,reply)=>{
    console.log(request.bcrypt);
    //get the request body 
    const {name,password,email} = request.body;

    //check if user is already present
    const existingUser = await User.findOne({
        email:email,
    }) 

    if(existingUser){
        reply.code(411).send({message:"Email already taken"});
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);

    //create new user
    try {
        

        const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword,
        })
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    //jwt token sign
    

    reply.code(200).send({
        "message":"User Created Successfully",
        "token" : token
    })
    } catch (error) {
        reply.code(400).send({
            "message":"Error while registering the user",
        })
    }
    
    
}

export const signin = async(request,reply)=>{

    const {email,password} = request.body;

    try {
        //check if user is already present 
        const user = await User.findOne({
            email,
        })
    
        if(!user){
            reply.code(411).send({message:"User not found"})
        }
    
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
    
        if(!isPasswordCorrect){
            reply.code(411).send({message:"User not found"})
        }
    
    
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    
        reply.code(200).send({
            message: "Signin Successfull",
            token: token,
        });
    } catch (error) {
        console.log(error);
        reply.code(400).send("Error while signing in");
    }
}


export const getUsers = async(request,reply)=>{

    // console.log("user Id",request.userId);

    const cachedData = await fastify.redis.get("getUsersCache");
    if (cachedData) {
        // Return cached data
        return reply.code(200).send(JSON.parse(cachedData));
    }

    const users = await User.find();

    const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user._doc;
        return userWithoutPassword;
    });

    await fastify.redis.set("getUsersCache", JSON.stringify(usersWithoutPassword), 'EX', 300);

    reply.code(200).send(usersWithoutPassword);
}