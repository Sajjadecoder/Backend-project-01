import {Router} from "express"
import { registerUser,loginUser,logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),

    registerUser
)

router.route("/login").post(loginUser)
//secured routes(will only work when user is logged in)
router.route("/logout").post(verifyJWT, logoutUser)    
router.route("/refresh-token").post(refreshAccessToken)    
router.route("/change-password").post(verifyJWT,changeCurrentPassword)    
router.route("/current-user").get(verifyJWT,getCurrentUser)    
router.route("/update-details").patch(verifyJWT,updateAccountDetails)    //when we only want to change only a few things then we use patch. post req changes the entire values
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)    
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)    
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)    
//since we fetched the username from req.params(in the getUserChannelProfile function) thats why we'll write /c/:username in the route
router.route("/watch-history").get(verifyJWT,getWatchHistory)    
export default router
