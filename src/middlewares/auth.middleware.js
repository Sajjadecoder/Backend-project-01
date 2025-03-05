import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import dotenv from "dotenv"
import {User} from "../db/user.model.js" 
dotenv.config()
import jwt from "jsonwebtoken" 
export const verifyJWT = asyncHandler (async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if (!token) {
            throw new ApiError("404","Token not found");
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
        if(!user){
            throw new ApiError(404,"Invalid access token")     
        }
        req.user = user
        next() 
    } catch (error) {
        throw new ApiError(404,error?.message || "Invalid access token")
    }
    }
)