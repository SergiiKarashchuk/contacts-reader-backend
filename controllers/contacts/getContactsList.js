const { Contact } = require("../../models");

const getContactsList = async (req, res) => {
  const {_id: owner } = req.user;
  const { page = 1, limit = 3} = req.query;
  const skip = (page - 1)*limit;
  
  const contacts = await Contact.find({ owner },"", {skip, limit}).populate("owner", "name email");
  res.json({contacts});
};


module.exports = getContactsList;