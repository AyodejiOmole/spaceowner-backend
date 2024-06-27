const {
  StatusCodes
} = require("http-status-codes");
const {
  nodemailer
} = require("../services");
const {
  Inquirer,
  User
} = require("../models");

const contactUs = async (req, res) => {
  try {
    const payload = req.body;
    const {
      fullName,
      email,
      category,
      phoneNumber,
      message
    } = payload;


    let type;
    const user = await User.findOne({email});
    if (!user) {
      type = "potential_customer";
    }

    const subject = `inquiry from ${fullName} on ${category}`;

    const mailHtml = `<p>${message}</p>`;
    const from = `"${fullName}" <${email}>`;

    const option = {
      email: process.env.Gmail_address,
      subject,
      mailHtml,
      from,
    };

    const newEnquier = {
      fullName,
      email,
      category,
      phoneNumber,
      message,
      type,
    };

    const newInquirer = new Inquirer(newEnquier);

    const data = await newInquirer.save();
    await nodemailer.send(option);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "your email has been sent successfully",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "please retry after some minutes",
    });
  }
};

module.exports = {
  contactUs,
};