const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { generateToken } = require("../helpers/token");
const Donation = require("../models/donation");
const { ObjectID } = require("bson");
const Beneficiary = require("../models/beneficiary");

exports.SignUp = async (req, res) => {
  try {
    const { username, mobile, password } = req.body;

    const check = await User.findOne({ mobile });
    if (check) {
      return res.send({
        error: "This mobile number already exists.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.array() });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    const user = await new User({
      username,
      mobile,
      password: cryptedPassword,
    }).save();

    // const token = generateToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      username: user.username,
      message: "Register Successfully Completed !",
    });
  } catch (error) {
    console.log("error message", error);
    res.send({ message: error.message });
  }
};

exports.Login = async (req, res) => {
  try {
    const { username, password, adminLogin } = req.body;

    let Member;
    let admin;
    if (!adminLogin) {
      Member = true;
    } else {
      admin = true;
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        error: "This username not found.",
        param: "username",
      });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.send({
        error: "Invalid credentials.Please try again.",
        param: "password",
      });
    }
    console.log("checking process completed");

    // const token = generateToken({ id: user._id.toString() }, "7d");
    // console.log("token", token);

    res.send({
      user,
      Member,
      admin,
      message: "Login Success",
      result: "OK",
    });
  } catch (error) {
    res.send({ message: error.message });
  }
};

exports.Donate = async (req, res) => {
  try {
    let { userId, amount, transactionId, comment } = req.body;

    const check = await Donation.findOne({ transactionId });
    if (check) {
      return res.send({
        error: "TransactionID already exists.",
      });
    }
    const donation = await new Donation({
      userId,
      amount,
      transactionId,
      comment,
    }).save();

    res.send({
      id: donation._id,
      message: "Donation Successfully Completed !",
    });
  } catch (error) {
    res.send({ message: error.message });
  }
};

exports.getDetails = async (req, res) => {
  const post = await Donation.find()
    .populate("userId", "username ")
    .sort({ createdAt: -1 });

  res.json(post);
};

exports.getDonationDetails = async (req, res) => {
  console.log("a calll from back end // getdetails......");
  const beneficiary = await Beneficiary.find()
  res.json(beneficiary);
};

exports.Beneficiary = async (req, res) => {
  try {
    const { name, location, type, amount } = req.body;

    const beneficiary = await new Beneficiary({
      name,
      location,
      type,
      amount,
    }).save();

    res.send({
      message: "beneficiary Successfully added !",
    });
  } catch (error) {
    console.log(error);
  }
};
