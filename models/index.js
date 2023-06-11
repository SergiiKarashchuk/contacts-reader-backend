const { Contact, schemas: contactSchema } = require("./contact");
const { User, userSchemas: userSchema } = require("./user");

module.exports = {
  Contact,
  contactSchema,
  User,
  userSchema,
};