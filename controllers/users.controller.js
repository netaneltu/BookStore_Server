let Model = require(`../models/User`);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  registerCustomer: async (req, res) => {
    try {
      // gettind values from the body request
      const {
        first_name,
        last_name,
        password,
        email,
        user_address: { city, street, building, appartment },
        phone_number,
        cart,
        user_orders,
      } = req.body;
      console.log(req.body);
      // creating new model using the values from req.body
      const new_model = new Model({
        first_name,
        last_name,
        password,
        email,
        user_address: {
          city,
          street,
          building,
          appartment,
        },
        phone_number,
        cart,
        user_orders,
      });

      // actual saving
      await new_model.save();

      if (Model.some({ email })) {
        throw new Error("מייל זה כבר רשום במערכת");
      }

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new user`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add user`,
        error: error.message,
      });
    }
  },
  newsletter: async (req, res) => {
    try {
      // gettind values from the body request
      const { name, email } = req.body;
      console.log(req.body);
      // creating new model using the values from req.body
      const new_model = new Model({
        name,
        email,
      });

      // actual saving
      await new_model.save();

      if (Model.some({ email })) {
        throw new Error("מייל זה כבר רשום במערכת");
      }

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new user`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add user`,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const models = await Model.find();

      return res.status(200).json({
        success: true,
        message: `success to find all users`,
        data: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all users`,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const models = await Model.findById(req.params.id, { password: 0 });

      return res.status(200).json({
        success: true,
        message: `success to find user by id`,
        user: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find user by id}`,
        error: error.message,
      });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const id = req.params.id;

      await Model.findByIdAndUpdate(id, req.body);

      return res.status(200).json({
        success: true,
        message: `success to update user by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update user by id`,
        error: error.message,
      });
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;

      await Model.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: `success to delete user by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete user by id`,
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("missing required filds");
      }
      const user = await Model.findOne({ email });
      if (!user) {
        throw new Error("bad password or email");
      }

      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        const data = {
          user_id: user.id,
        };

        const access_token = await jwt.sign(data, process.env.JWT_SECRET, {
          expiresIn: "3h",
        });
        const refresh_token = await jwt.sign(data, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.cookie("jwt", refresh_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
          success: true,
          message: "success to login",
          access_token,
        });
      } else {
        throw new Error("bad password or user name");
      }
    } catch (error) {
      return res.status(500).json({
        message: `error in login user`,
        error: error.message,
      });
    }
  },
  refreshtoken: async (req, res) => {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt) return res.sendstatus(401);
      const refresh_token = cookies.jwt;

      jwt.verify(
        refresh_token,
        process.env.SECRET_REFRESH_TOKEN,
        (err, decoded) => {
          if (err) return res.sendStatus(403);
          const access_token = jwt.sign(
            { username: decoded.username },
            process.env.JWT_SECRET,
            {
              expiresIn: "3h",
            }
          );
          res.json({ access_token });
        }
      );
    } catch (error) {
      return res.status(500).json({
        message: `error in login user`,
        error: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      //  console.log(req);
      //   const cookies = req.cookies;
      // if (!cookies?.jwt) return res.status(204);

      res.clearCookie("token", { httpOnly: true });
      return res.status(200).json({
        success: true,
        message: `logout success`,
      });
    } catch (error) {
      return res.status(404);
    }
  },
  authCustomer: async (req, res) => {
    try {
      const customer_token = req.headers.authorization;
      console.log(customer_token);
      if (!customer_token) {
        throw new Error("no token provided");
      }
      const bearer = customer_token.split(" ")[0];
      console.log(bearer);
      const decode = jwt.verify(bearer, process.env.JWT_SECRET);
      console.log(decode);
      const user = await Model.findById(decode.user_id).exec();

      if (!user) {
        throw new Error("access denied");
      }
      return res.status(201).json({
        success: true,
        message: "user authorized",
        token: customer_token,
        user: {
          _id: user._id,
          name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(401).json({
        message: "unauthorized",
        error: error.message,
      });
    }
  },
  // managers requests
  getCustomerByIdForManager: async (req, res) => {
    try {
      const models = await Model.findById(req.params.user_id); /* .populate([
        "user_cart",
        "user_orders.order",
      ]).exec() */

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id - for manager`,
        [controler_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id - for manager`,
        error: error.message,
      });
    }
  },
  getAllCustomersForManager: async (req, res) => {
    try {
      /*       const models = await Model.find().populate([
        "user_cart",
        "user_orders.order",
      ]).exec(); */

      const models = await Model.find().exec();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name} - for manager`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name}  - for manager`,
        error: error.message,
      });
    }
  },
  deleteUserByIdForManager: async (req, res) => {
    try {
      const id = req.params.user_id;

      const exists = await Order.findOne({ user: id });

      if (exists) {
        throw new Error(
          "cannot delete this user because have orders related to this user"
        );
      }

      await Model.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to delete ${controler_name} by id -  - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete ${controler_name} by id - for managers`,
        error: error.message,
      });
    }
  },
  addUserForManager: async (req, res) => {
    try {
      // gettind values from the body request
      const { user_name, user_email, user_password, user_phone, user_address } =
        req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        user_name,
        user_email,
        user_password,
        user_phone: user_phone || "",
        user_address: user_address || "",
      });

      // actual saving
      await new_model.save();

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new ${controler_name}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name}`,
        error: error.message,
      });
    }
  },
  updateUserByIdForManager: async (req, res) => {
    try {
      const id = req.params.user_id;

      await Model.findByIdAndUpdate(id, req.body).exec();

      return res.status(200).json({
        success: true,
        message: `success to update ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} by id`,
        error: error.message,
      });
    }
  },
  // ___________________
};
