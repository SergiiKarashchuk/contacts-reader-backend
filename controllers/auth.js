const bcrypt = require("bcrypt");

const {User} = require("../models/user");

const {ctrlWrapper, HttpError} = require("../helpers");


const register = async(req, res) => {
const {email, password} = req.body;
const user = await User.findOne({email});

if(user){
    throw HttpError(409, "Email already in use");
}
const hashPassword = await bcrypt.hash(password, 10);

const newUser = await User.create({...req.body, password: hashPassword});

// const createHashPassword = async(password) => {
//     const result = await bcrypt.hash(password, 10);
//     const compareResalt = await bcrypt.compare(password, result);
    
//     console.log(result);
//     }
//     createHashPassword("123456")


res.status(201).json({
    email: newUser.email,
    name: newUser.name,
})
}

module.exports = {
    register: ctrlWrapper(register),
}