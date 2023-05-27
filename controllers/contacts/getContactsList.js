const { Contact } = require("../../models");

const getContactsList = async (req, res) => {
  const {_id: owner } = req.user;
  const contacts = await Contact.find({ owner });
  res.json({
    status: "Success",
    code: 200,
    data: {
      contacts,
    },
  });
};

module.exports = getContactsList;