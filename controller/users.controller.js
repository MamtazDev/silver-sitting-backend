const User = require("../models/users.model");
const bcrcypt = require("bcryptjs");
const { generateToken, sendVerificationEmail } = require("../utils/auth");

const registerUser = async (req, res) => {
  try {
    const isExist = await User.findOne({ email: req.body.email });
    const isVerified = isExist?.isVerified;
    if (isExist && isVerified === true) {
      return res.status(403).send({
        message: `${req.body.email} is already Exist!`,
        status: 403,
      });
    } else if (isExist && isVerified === false) {
      const password = bcrcypt.hashSync(req.body.password);
      isExist.password = password;

      const updatedUser = await isExist.save();

      await sendVerificationEmail(updatedUser);
      res.status(200).send({
        message: "We have sent you verification code. Please check your email!",
        status: 200,
      });
    } else {
      const newUser = new User({
        role: req.body.role,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        postCode: req.body.postCode,
        residance: req.body.residance,
        password: bcrcypt.hashSync(req.body.password),
      });
      const user = await newUser.save();
      //   const accessTOken = await generateToken(user);

      await sendVerificationEmail(user);

      res.status(200).send({
        message: "We have sent you verification code. Please check your email!",
        status: 200,
      });

      //   res.status(200).send({
      //     message: "User Created successfully",
      //     user,
      //     accessTOken,
      //     status: 200,
      //   });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const emailVirification = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      res.redirect(`${process.env.MAINWEBSITE_URL}/jkkj`);
    } else if (user && user?.isVerified === true) {
      res.redirect(`${process.env.MAINWEBSITE_URL}/jkkj`);
    } else {
      user.isVerified = true;
      await user.save();
      res.redirect(`${process.env.MAINWEBSITE_URL}/register-success-sms`);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  emailVirification,
};
