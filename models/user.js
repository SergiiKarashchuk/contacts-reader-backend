const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;


const userSchema = new Schema({
name: {
    type: String,
    required: true,
},
email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: true,
},
password: {
    type: String,
    minlength: 6,
    required: true,
},

token: {
    type:String,
    default: ""
},
avatarURL: {
    type: String,
    required: true,
},
verify: {
type: Boolean,
default: false,
},
verificationCode: {
type: String,
// required: [true, 'Verify token is required'],
},
}, {versionkey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email:Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
    email:Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const emailSchema = Joi.object({
    email:Joi.string().pattern(emailRegexp).required(),
})

const userSchemas = {
    register: registerSchema,
    login: loginSchema,
    email: emailSchema,
}

const User = model("user", userSchema);

module.exports = {
    User,
    userSchemas
}