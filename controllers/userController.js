const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const passwordHash = bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log("Error from load Register" + error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const sPassword = await securePassword(req.body.password);
    const { email, name } = req.body;
    const trimEmail = email.trim();
    const trimName = name.trim();

    const emailExist = await User.findOne({ email: trimEmail });
    if (emailExist) {
      res.render("register", { message: "Email already exist" });
    } else if (!trimEmail) {
      res.render("register", {
        message: "Email shouldn't be empty or blank space",
      });
    } else if (!trimName) {
      res.render("register", {
        message: "Name shouldn't be empty or blank space",
      });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.phone,
        password: sPassword,
        is_admin: 0,
      });
      const userData = await user.save();
      if (userData) {
        res.render("register", { message: "Registration Succesfull" });
      } else res.render("register", { message: "OOPS!Registration Failed" });
    }
  } catch (error) {
    console.log("Error from insert user" + error.message);
  }
};

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const emailMatch = await User.findOne({ email: email });
    if (emailMatch) {
      const passwordMatch = await bcrypt.compare(password, emailMatch.password);
      if (passwordMatch) {
        req.session.user_id = emailMatch._id;
        console.log("no error in verifylogin");
        res.redirect("home");
      } else {
        res.render("login", { message: "Please check your password" });
      }
    } else {
      res.render("login", {
        message: "Incorrect Email or Email not registered",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user_id });

    res.render("home", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
};
