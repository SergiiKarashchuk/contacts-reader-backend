const mongoose = require("mongoose");

const DB_HOST = "mongodb+srv://Sergii:M4Kg2TQ1VUakIOtL@cluster0.4i8grq6.mongodb.net/contacts_reader?retryWrites=true&w=majority"

mongoose.set("strictQuery", true);
mongoose.connect(DB_HOST)
.then (() => {app.listen(3000)})
.catch ( error => {console.log(error.message),
process.exit(1)})

const app = require('./app')

