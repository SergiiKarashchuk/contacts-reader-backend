const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const {User} = require("../models/user");

const {ctrlWrapper, HttpError} = require("../helpers");
const nodemon = require("nodemon");

const {SECRET_KEY} = process.env;


const register = async(req, res) => {
const {email, password} = req.body;
const user = await User.findOne({email});

if(user){
    throw HttpError(409, "Email already in use");
}
const hashPassword = await bcrypt.hash(password, 10);

const newUser = await User.create({...req.body, password: hashPassword});

console.log("newUser", newUser);
res.status(201).json({
    email: newUser.email,
    name: newUser.name,
})
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){ 
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }
 
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

    res.json({
        token,
    })
}
    // щоб розшифрувати токен
    // const decodeToken = jwt.decode(token);
    // console.log(token);

//     щоб перевірити чи токен валідний
//     try {
//         const {id} = jwt.veryfy(token, SECRET_KEY);
//         console.log(id);
//    наприклад
//         const invalidToken = "$2b$10$/6Xqu2oV7OM/261EQ8SIbunKDV6GcaogXAYhCpLCKFNIwXDBsZV1m";
// const result = jwt.veryfy(invalidToken, SECRET_KEY);
//     }
//     catch(error) {
//         console.log(error.message);
//     }



// const createHashPassword = async(password) => {
//     const result = await bcrypt.hash(password, 10);
//     const compareResalt = await bcrypt.compare(password, result);
    
//     console.log(result);
//     }
//     createHashPassword("123456")




module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}