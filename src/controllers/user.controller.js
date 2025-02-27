import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";
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
    console.log(fullname + " " + username + " " + email + " " + password)

    //step2
    if (!fullname || !username || !email || !password) {
        res.status(400);
        throw new ApiError(400, "Please fill all the details")
    }

    //step3
    //check if user already exists
    const alreadyExists = User.findOne({
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
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    // step5
    const avatarUpload =await uploadOnCloudinary(avatarLocalPath) //await bcz is kaam mei time lgta hai
    const coverImageUpload =await uploadOnCloudinary(coverImageLocalPath)

    if (!avatarUpload) {
        throw new ApiError(400,"Avatar upload failed");
                
    }

    const user =await User.create({
        fullname,
        avatar: avatarUpload.url,
        coverimage: coverImageUpload?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })
    const createdUser = await User.findById( user._id).select("-password -refreshtoken")   //password aur refreshtoken nai chahye
    if (!createdUser) {
        throw new ApiError(500, "User creation failed")
        
    }
    return res.status(201).json(new ApiResponse(201, createdUser))

})
export { registerUser }