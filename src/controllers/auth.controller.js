const { StatusCodes } = require("http-status-codes");
const { User, Wallet, Notification } = require("../models");
const {
  argon2Service,
  jwtService,
  nodemailer,
  Services,
} = require("../services");

const passwordHasher = argon2Service();
const WalletService = new Services(Wallet);
const NotificationService = new Services(Notification);

const { checkIfEmailExists } = require("../utils");

const blacklistedTokens = new Set();

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const prodURL = `https://warehouzit-server.onrender.com`;
// const devURL = `http://localhost:8000`;

const register = async (req, res) => {
  try {
    const { username, role, firstname, lastname, email, phonenumber, password } = req.body;
    const subject = "Account Verification";
    const hashedPassword = await passwordHasher.hashPassword(password);

    const CreateNewUser = {
      username,
      firstname,
      lastname,
      email,
      phonenumber,
      password: hashedPassword,
      role,
    };
    // check if username already exists
    let userExists = await User.findOne({
      $or: [
        {
          email,
        },
      ],
    });

    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "user already exists",
      });
    }

    // check if the email already exists
    const newUser = new User(CreateNewUser);

    if (!newUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "user not created",
      });
    }
    const savedUser = await newUser.save();

    if (!savedUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "user not saved",
      });
    }

    // sign a token using the username and email newusersID
    const payload = {
      ID: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    };

    const token = jwtService.signToken(payload, "24h");

    const mailHtml = `
    <p>
      <strong>
        Hello ${firstname},
      </strong> 
      <br><br>
      Thank you for registering with the <strong>warehouzit application</strong>.
      <br>
      My name is Olugbenga, and I am the CEO of Warehӧuzit.  <br>
      Since you've recently signed in with the application, I thought I'd extend a warm welcome on behalf of the entire team. 
      <br>
      Warehouzit is dedicated to meeting all of your warehousing and storage needs. 
      <br>
      <br>
      Please follow the link below to complete your registration.<a href="${prodURL}/api/v1/auth/verify?token=${token}">Verify email</a> 
      <br>
    </p>`;

    const from = '"WarehouzIt" <verification@warehouzit.com>';

    const option = {
      email,
      subject,
      mailHtml,
      from
    };

    await nodemailer.send(option);

    const adminNotification = {
      admin: true,
      title: "Registration of a new user",
      message: `A new user ${firstname} ${lastname} has been registered`,
    };

    await NotificationService.create(adminNotification);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        "user created successfully, please check your email to verify your account",
      newUser,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "Please retry after some minutes",
    });
  }
};

const login = async (req, res) => {
  try {
    const emailOrUsername = req.body.email_or_username;
    const password = req.body.password;
    let user;
    if (emailRegex.test(emailOrUsername)) {
      user = await User.findOne({
        email: emailOrUsername,
        isDeleted: false,
      });
    } else {
      user = await User.findOne({
        username: emailOrUsername,
        isDeleted: false,
      });
    }

    // if the user is not found
    if (!user || user == "") {
      return res.status(404).json({
        status: "error",
        error: "User not found",
      });
    }
    // if user is deleted
    if (user.isDeleted) {
      return res.status(404).json({
        status: "error",
        error: "User has been deleted",
      });
    }

    // verify the password
    const isMatch = await passwordHasher.verifyPassword(
      user.password,
      password
    );

    // if the password is not correct
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        error: "Incorrect password",
      });
    }
    // if the password is correct
    // create a token

    const token = jwtService.signToken({
      id: user._id,
      email: user.email,
    });

    // remove these fields from the response, they are not needed, password, __v, isVerified, createdAt, updatedAt, isDeleted
    user.password = undefined;
    user.__v = undefined;
    user.updatedAt = undefined;
    user.isDeleted = undefined;
    user.isSuspended = undefined;

    // send the response
    res.status(200).json({
      status: "success",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "please retry after some minutes",
    });
  }
};

const verify = async (req, res) => {
  const token = req.query.token;
  try {
    const decodedInfo = jwtService.decodeToken(token);
    console.log(decodedInfo.ID);
    if (!decodedInfo) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Verification error",
        message: "invalid token",
      });
    }

    const result = await User.findById(decodedInfo.ID);
    console.log(decodedInfo.ID);
    if (!result) {
      console.log("step 0");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: "Authentication error",
        message: "user not found",
      });
    }

    console.log("step 1");

    // if the user role is not spaceseeker then create a wallet object for the user
    if (result.role == "spaceowner") {
      console.log("step 2");
      const wallet = {
        owner: result._id,
        balance: 0,
      };

      // create a new wallet with the walletservice
      const newWallet = await WalletService.create(wallet);

      console.log("step 3");
      result.wallet = newWallet._id;
    }
    console.log("step 4");
    result.isVerified = true;
    result.save();

    const adminNotification = {
      admin: true,
      title: "Verification of a new user",
      message: `user ${result.firstname} ${result.lastname}, has successfully verified his account`,
    };

    await NotificationService.create(adminNotification);
    // send a welcome email
    const mailHtml = `
    <p>
      <strong>
        Hi ${result.firstname},
      </strong> 
      <br><br>
      Thank you for registering with the <strong>warehouzit application</strong>.
      <br>
      Welcome to the world's biggest digital warehouse marketplace! I am so excited that you have decided to come onboard our platform.  We are thrilled to have you and we look forward to helping you achieve your goals on our platform. 
      <br><br>
      You have now successfully registered with Warehouzit. Our platform is disrupting the storage and warehousing industry by providing a simple, quick and transparent way to find warehouses in Nigeria and the world at large. We offer a comprehensive warehouse management platform with the goal of connecting commercial, operational, and strategic warehouse space with potential users.  We are an ecosystem enabler for both the upstream and downstream of the warehouse market.      
      <br>
      <br>
      As a registered user, you have access to all of our platform features. You can search for warehouses and make payments for desired warehouses as a warehouse seeker or update your business profile and create a warehouse profile as a warehouse owner.
      If you have any questions or concerns, our support team is available to assist you. You can contact us at <strong>info@warehouzit.com</strong>.
      We encourage you to start exploring the platform and take advantage of all the features available to you. We are confident that you will find Warehouzit to be an excellent resource for achieving your goals.
      <br><br>
      New platforms can be overwhelming, but not Warehouzit. My team and I will be helping you improve your customer suppor-t with the help of chatbots and customer service personnel. 
      Excited to have you be a part of our Warehouzit Family.
      Your Warehouzit Team.
      If you have any questions, reply back to this email or send us an in-app chat message
      <br><br>
      Cheers,<br>
      Olugbenga Ojo<br>
      CEO, Warehouzit.<br>
    </p>
    `;
    const from = '"WarehouzIt" <info@warehouzit.com>';
    const subject = `Welcome to Warehouzit`;

    const option = {
      email: result.email,
      subject,
      mailHtml,
      from,
    };
    await nodemailer.send(option);

    return res.redirect(
      "https://warehouzit.net/verification-success"
    );
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "please retry after some minutes",
    });
  }
};

// this handles the collection of email and sending of email
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const realEmail = await checkIfEmailExists(email);
    const subject = "Forgot Password";

    if (realEmail) {
      const token = jwtService.signToken(
        {
          email,
        },
        "1h"
      );

      // send email
      const mailHtml = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account. </p> \n\n
      <p>Click on this link to reset your password:  \n\n
      <a href="https://warehouzit.net/reset-password?token=${token}">Reset password</a>\n\n
      </p> \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`;
      const option = {
        email,
        subject,
        mailHtml,
      };

      await nodemailer.send(option);

      return res.status(StatusCodes.ACCEPTED).json({
        message: `An email has been sent to ${email} with further instructions.`,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "No account with that email address was found.",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "please retry after some minutes",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    // Verify the JWT and get the user id
    const subject = "Password Reset Confirmation";
    const { token } = req.params;
    const decoded = jwtService.decodeToken(token);
    const userEmail = decoded.email;

    // Find the user in the database and update their password
    const user = await User.findOne({
      email: userEmail,
      isDeleted: false,
    });
    const hashedPassword = await passwordHasher.hashPassword(req.body.password);
    user.password = hashedPassword;
    await user.save();

    // Send a confirmation email
    const mailHtml = `This is a confirmation that the password for your account ${user.email} has been changed.`;

    const option = {
      email: userEmail,
      subject,
      mailHtml,
    };

    await nodemailer.send(option);

    return res.status(StatusCodes.ACCEPTED).json({
      message: `Your password has been updated successfully`,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: "please retry after some minutes",
    });
  }
};

const resetOldPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: "Authentication error",
        message: "user not found",
      });
    }

    const isMatch = await passwordHasher.verifyPassword(
      user.password,
      oldPassword
    );
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Authentication error",
        message: "incorrect password",
      });
    }

    const hashedPassword = await passwordHasher.hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "password updated successfully",
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
  register,
  login,
  verify,
  forgotpassword,
  resetPassword,
  resetOldPassword,
};
