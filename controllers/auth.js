const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const {nanoid} = require("nanoid");

const {User} = require("../models/user");

const {ctrlWrapper, HttpError, sendEmail} = require("../helpers");

const {SECRET_KEY, PROJECT_URL} = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async(req, res) => {
const {email, password} = req.body;
const user = await User.findOne({email});

if(user){
    throw HttpError(409, "Email already in use");
}
const hashPassword = await bcrypt.hash(password, 10);

const avatarURL = gravatar.url(email);

const verificationCode = nanoid();

const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationCode});

const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`
}

const sendEmail_1 = await sendEmail(verifyEmail);

res.status(201).json({
    user: {
        name: newUser.name,
        email: newUser.email,    
    }
})
}

const verify = async(req, res) => {
    const {verificationCode} = req.params;
    const user = await User.findOne({verificationCode});
    if(!user) {
        throw HttpError(404);
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});
    res.json({
        message: "Verify success"
    })
    }

    const resendVerifyEmail = async(req, res) => {
        const {email} =req.body;
        // const {error} = schemas.email.validate({email});
        // if(error){
        //     throw createError(400, error.message);
        // }
        const user = await User.findOne({email});
        if(!user) {
            throw HttpError(404);
        }
        if(user.verify) {
            throw HttpError(400, "Email alredy verify")
        }
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`
        }
        await sendEmail(verifyEmail);
        
        res.json({
            message: "Verify email send"
        })
        }

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){ 
        throw HttpError(401, "Email wrong");
    }   if(!user.verify){ 
        throw HttpError(401, "Email not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Password wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
await User.findByIdAndUpdate(user._id, {token});

    res.json({
        token,
        user: {
            email: user.email,
            name: user.name,
        
        }
    })
}

const getCurrent = async(req, res) => {
    const {email, name} = req.user;
    res.json({
        email,
        name,
    })
}

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
}

const updateAvatar = async(req, res) => {

    const {_id} = req.user;
const { path: tempUpload, originalname} = req.file;
const filename = `${_id}_${originalname}`;
const resultUpload = path.join(avatarsDir, filename);
await fs.rename(tempUpload, resultUpload);
const avatarURL = path.join("avatars", filename);
await User.findByIdAndUpdate(_id, {avatarURL});
res.json ({
    avatarURL,
})
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}
