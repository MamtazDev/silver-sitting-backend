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
        message: "We have sent you verification link. Please check your email!",
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
        message: "We have sent you verification link. Please check your email!",
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

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user?.isVerified === false) {
      return res.status(401).send({
        message: "Please Verify your email.",
      });
    } else if (
      user &&
      bcrcypt.compareSync(req.body.password, user.password) &&
      user?.isVerified === true
    ) {
      const accessTOken = generateToken(user);
      return res.send({
        message: "Logged in successfully",
        status: 200,
        user,
        accessTOken,
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password",
        status: 401,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      data: users,
      status: 200,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then((result) => {
        res.status(200).send({
          message: `${result.name} is successfully removed!`,
          status: 200,
        });
      })
      .catch((err) => {
        res.send({
          message: err.message,
        });
      });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, {
      name: 1,
      email: 1,
      isVerified: 1,
    });
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  emailVirification,
  loginUser,
  getAllUsers,
  deleteUser,
  getUser,
};
