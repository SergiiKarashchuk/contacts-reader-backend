const { Contact, schemas:contactSchema } = require("./contact");
const { User, schemas:userSchema } = require("./user");

module.exports = {
  Contact,
  contactSchema,
  User,
  userSchema
};