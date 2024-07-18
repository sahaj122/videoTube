import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation-not empty better to handle at backend, in case frontend code doesn't work
    // check if user already exist : username, email
    // check for immages, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    // data can come from form, url, direct json
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User exists with same username or email")
    }

    // handling files, since we added middlewarein route in this case multer, 
    // we get access to more fields/methods to use in "req" 
   
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is rquired")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is rquired")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        // since coverImage isn't checked above we need to check it now
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating  the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export {registerUser}