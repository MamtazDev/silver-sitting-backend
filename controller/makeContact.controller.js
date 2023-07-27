const MakeContact = require("../models/makeContact.model");

const addNewContanctMessage = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  try {
    const newMakeContact = new MakeContact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    await newMakeContact.save();
    res.status(200).send({
      message: "Thanks for your message. We will contact you soon",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addNewContanctMessage,
};
