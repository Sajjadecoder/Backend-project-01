import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../db/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found")

        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshtoken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Token generation failed")
    }
}
const registerUser = asyncHandler(async (req, res) => {

    //step 1: get user details from frontend
    //step2: validation -> any detail empty
    //step3: check if user already exists(unique username/email)

    //step4: check for image, and avatar(since its compulsory)
    //upload them to cloudinary
    //create user object -> create entry in db
    //remove password and refresh token from response
    //check for successful user creation
    //return response to frontend

    //this is step1
    const { fullname, username, email, password } = req.body;
    console.log(req.body)
    console.log(fullname + " " + username + " " + email + " " + password)

    //step2
    if (!fullname && !username && !email && !password) {
        res.status(400);
        throw new ApiError(400, "Please fill all the details")
    }

    //step3
    //check if user already exists
    const alreadyExists = await User.findOne({
        $or: [
            { username }, { email }
        ]
    })
    if (alreadyExists) {
        throw new ApiError(409, "User with this username or email already exists")
    }
    // step4
    const avatarLocalPath = req?.files.avatar[0]?.path;
    const coverImageLocalPath = req?.files.coverimage[0]?.path;
    // console.log('Avatar path:', avatarLocalPath);
    // console.log('Cover image path:', coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    // step5
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath) //await bcz is kaam mei time lgta hai
    const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatarUpload) {
        throw new ApiError(400, "Avatar upload failed");

    }

    const user = await User.create({
        fullname,
        avatar: avatarUpload.url,
        coverimage: coverImageUpload?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshtoken")   //password aur refreshtoken nai chahye
    if (!createdUser) {
        throw new ApiError(500, "User creation failed")

    }
    return res.status(201).json(new ApiResponse(201, createdUser))

})
const loginUser = asyncHandler(async (req, res) => {
    //fetch data from req.body
    //check if user exists(based on username or email)
    //check if password is correct
    //generate access token and refresh token
    //send cookie
    const { username, password, email } = req.body;
    if (!username || !email || !password) {
        throw new ApiError(400, "Please fill all the details")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Password");
    }
    const { accessToken, refreshtoken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");

    //sending cookies

    const options = {
        httpOnly: true,
        secure: true

    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshtoken, options)
        .json(new ApiResponse(200, { loggedInUser, accessToken, refreshtoken }, "User logged in successfully"))


})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $set: [{
            refreshtoken: undefined
        }, {
            new: true
        }]
    })
    const options = {
        httpOnly: true,
        secure: true

    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRequestToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRequestToken) {
        throw new ApiError(400, "Refresh token not found")
    }
    try {
        const decodedToken = jwt.verify(incomingRequestToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
        if (!user) {
            throw new ApiError(404, "User not found")
    
        }
        if (incomingRequestToken != user.refreshtoken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken,newRefreshToken}= await generateAccessAndRefreshToken(user._id)
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, {accessToken,refreshToken: newRefreshToken}, "Access token refreshed successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh token")
        
    }
})
export { registerUser, loginUser, logoutUser,refreshAccessToken }