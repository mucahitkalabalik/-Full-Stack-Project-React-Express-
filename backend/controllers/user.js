const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
require("dotenv").config();

const register = async (req, res) => {
  console.log(req, "register request");

  try {
    const { name, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
 
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, cookieOptions).json({
      newUser,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    // Kullanıcı kontrolü
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword,'vali,spassss');
    
    if (!validPassword) {
      return res.status(401).json({ message: "Şifre Yanlış" });
    }

    // JWT oluşturma
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, cookieOptions).json({
      user,
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({ message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Güvenli Token Üretme
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Token'ı Hash'leyip Kaydet
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Kullanıcıya Gönderilecek URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    const user = await User.findOne({ email });
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: "Email could not be sent" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    // Token'ı hashleyerek veritabanında ara
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Yeni şifreyi hashleyerek kaydet
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // Kullanılan token’ı temizle
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Password reset failed", error: error.message });
  }
};

const userDetail = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    user,
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  userDetail,
};
