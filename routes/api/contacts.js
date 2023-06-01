const express = require("express");

const { contacts: contactsCtrl } = require("../../controllers");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { contactSchema } = require("../../models");

const getContactsList = require("../../controllers/contacts/getContactsList");

const router = express.Router();

router.get("/", authenticate,
getContactsList);

router.get("/:contactId", authenticate,
isValidId,
contactsCtrl.getContactById);

router.post("/", authenticate,
validateBody(contactSchema.addSchema),
contactsCtrl.addContact);

router.put(
  "/:contactId", authenticate, 
  isValidId,
  validateBody(contactSchema.addSchema),
  contactsCtrl.updateContact
);

router.patch(
  "/:contactId/favorite", authenticate,
  isValidId,
  validateBody(contactSchema.updateStatusContactSchema),
  contactsCtrl.updateContactStatus
);

router.delete("/:contactId", authenticate,
isValidId,
contactsCtrl.deleteContact);

module.exports = router;