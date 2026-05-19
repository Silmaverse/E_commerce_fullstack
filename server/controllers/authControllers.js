const { mailSender } = require("../helpers/mailService");
const { OTPMailTemp } = require("../helpers/mailTemplate");
const {
  genertaeOTp,
  validateEmail,
  generateAccessToken,
  generateRefreshToken,
  uploadToCloudinary,
  destroyFromCloudinary,
} = require("../helpers/util");
const userschema = require("../models/authSchema");

const signup = async (req, res) => {
  const { fullname, email, passowrd } = req.body;
  try {
    if (!fullname)
      return res.status(400).send({ message: "Fullname is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!validateEmail(email))
      return res.status(400).send({ message: "Email is not valid" });
    if (!passowrd)
      return res.status(400).send({ message: "Password is required" });
    const existemail = await userschema.find({ email });
    if (existemail)
      return res.status(400).send({ message: "This email alreday exist" });
    const otp = genertaeOTp();
    const user = new userschema({
      fullname,
      email,
      password,
      otp,
      otpexpiry: Date.now() + 5 * 60 * 1000,
    });

    await user.save();
    mailSender({
      email,
      subject: "Verify your Otp",
      template: OTPMailTemp(otp),
    });
    res
      .status(200)
      .send({ message: "Registration successfully verify your mail" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server Error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!otp) return res.status(400).send({ message: "OTP code is required" });
    const userdata = await userschema.findOneAndUpdate(
      { email, otp, otpexpiry: { $gt: Date.now() }, isVerified: false },
      {
        $set: {
          isVerified: true,
          otp: null,
          otpexpiry: null,
        },
      },
      { returnDocument: true },
    );

    if (!userdata) {
      return res.status(200).send({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server Error" });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const userdata = await userschema.findOneAndUpdate({
      email,
      isVerified: false,
    });
    if (!userdata) return res.status(400).send({ message: "Invalid request" });
    const otp = genertaeOTp();
    userdata.otp = otp;
    userdata.otpexpiry = Date.now() + 5 * 60 * 1000;
    await userdata.save();
    mailSender({
      email,
      subject: "Verify your Otp",
      template: OTPMailTemp(otp),
    });
    res.status(200).send({ message: "New OTP send to your email" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const cookie_config = {
  httpOnly: false,
  secure: false,
  sameSite: "strict",
};

const signin = async (req, res) => {
  const { email, passowrd } = req.body;
  try {
    const userdata = await userschema.findOne({ email }).select("+password");
    if (!userdata)
      return res.status(400).send({ message: "Invalid Credential" });
    if (userdata.isVerified === false)
      return res.status(400).send({ message: "Email is not verified" });

    const matchPassword = await userdata.comparePassword(passowrd);
    if (!matchPassword)
      return res.status(400).send({ message: "Invalid Credentials" });
    const accesstoken = generateAccessToken(userdata);
    const refreshtoken = generateRefreshToken(userdata);
    res
      .status(200)
      .cookie("acc_tkn", accesstoken, cookie_config)
      .cookie("ref_tkn", refreshtoken, cookie_config)
      .send({ messge: "Login Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Interna; server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const profileData = await userSchema.findOne(
      { _id: req.user._id },
      { fullName: 1, email: 1, role: 1, avatar: 1, address: 1 },
    );
    if (!profileData)
      return res.status(400).send({ message: "Invalid request" });

    res.status(200).send(profileData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const updateProfile = async (req, res) => {
  const { fullName, address } = req.body;
  const avatar = req.file;
  try {
    const userData = await userSchema.findOne({ _id: req.user._id });
    if (!userData)
      return res.status(400).send({ message: "Something went wrong" });
    if (fullName && fullName.trim()) userData.fullName = fullName;
    if (address && address.trim()) userData.address = address;
    if (avatar) {
      try {
        const avatarUrl = await uploadToCloudinary({
          mimetype: avatar.mimetype,
          imgBuffer: avatar.buffer,
        });
        if (userData.avatar) destroyFromCloudinary(userData.avatar);
        userData.avatar = avatarUrl;
      } catch (error) {}
    }
    userData.save();
    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

const userList = async (req, res) => {
  const { verified } = req.query || "";

  const filterQueries = {};

  if (verified && verified.toLowerCase() != "all") {
    filterQueries.isVerified = verified === "true";
  }

  try {
    const users = await userSchema.find(filterQueries, {
      fullName: 1,
      email: 1,
      role: 1,
      avatar: 1,
      isVerified: 1,
    });
    res.status(200).send(users);
  } catch (error) {}
};

module.exports = { signup,verifyOtp,resendOTP,signin,getProfile,updateProfile ,userList};
