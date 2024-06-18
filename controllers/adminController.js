const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const loadAdminLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passCheck = await bcrypt.compare(password, adminData.password);
      if (adminData.is_admin) {
        if (passCheck) {
          req.session.admin_id = adminData._id;
          res.redirect("/admin/home");
        } else res.render("login", { message: "Plese check your password" });
      } else {
        res.render("login", { message: "You are not an admin" });
      }
    } else {
      res.render("login", { message: "Incorrect Email" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const adminHome = async (req, res) => {
  try {
    const adminData = await User.findOne({ _id: req.session.admin_id });
    res.render("home", { admin: adminData });
  } catch (error) {
    console.log(error.message);
  }
};
const dashboard = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    const userData = await User.find({
      is_admin: 0,
      $or: [{ name: { $regex: "^" + search + ".*", $options: "i" } }],
    });
    res.render("dashboard", { users: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const viewAdmin = async (req, res) => {
  try {
    const adminData = await User.find({ is_admin: 1 });
    res.render("viewAdmin", { admin: adminData });
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin/home");
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddUser = async (req, res) => {
  try {
    res.render("addUser");
  } catch (error) {
    console.log(error.message);
  }
};
const securePassword = async (password) => {
  try {
    const passwordHash = bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    console.log("add user post method");
    const { email, name } = req.body;
    const trimEmail = email.trim();
    const trimName = name.trim();

    const emailExist = await User.findOne({ email: trimEmail });
    if (emailExist) {
      res.render("addUser", { message: "Email already exist" });
    } else if (!trimEmail) {
      res.render("addUser", {
        message: "Email shouldn't be empty or blank space",
      });
    } else if (!trimName) {
      res.render("addUser", {
        message: "Name shouldn't be empty or blank space",
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.phone,
        password: spassword,
        is_admin: 0,
      });
      const userData = await newUser.save();
      if (userData) {
        res.render("addUser", { message: "New User Added" });
      } else res.render("addUser", { message: "OOPS!" });
    }
    // const newUser =new User({
    //     name:req.body.name,
    //     email:req.body.email,
    //     mobile:req.body.phone,
    //     password:spassword,
    //     is_admin:0
    // })
  } catch (error) {
    console.log(error.message);
  }
};

const editUserLoad = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.query.id });
    if (userData) {
      res.render("editUser", { user: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editUser = async (req, res) => {
  try {
    const { name, email, phone, id, adminCheck } = req.body;
    const trimEmail = email.trim();
    const trimName = name.trim();

    const emailExist = await User.findOne({ email: trimEmail });
    if (!trimEmail) {
      res.render("editUser", {
        message: "Email shouldn't be empty or blank space",
      });
    } else if (!trimName) {
      res.render("addUser", {
        message: "Name shouldn't be empty or blank space",
      });
    } else {
      const user = await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            email: email,
            mobile: phone,
            is_admin: adminCheck,
          },
        }
      );
      if (user) {
        res.redirect("/admin/dashboard");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log(req.query.id);

    const user = await User.deleteOne({ _id: req.query.id });
    if (user) {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadAdminLogin,
  verifyAdmin,
  adminHome,
  adminLogout,
  dashboard,
  viewAdmin,
  loadAddUser,
  addUser,
  editUserLoad,
  editUser,
  deleteUser,
};
