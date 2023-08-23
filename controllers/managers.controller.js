let Model = require(`../models/Manager`);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  addManagerForAdmins: async (req, res) => {
    try {
      // gettind values from the body request
      const { manager_name, manager_email, manager_password, phone_number } =
        req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        manager_name,
        manager_email,
        manager_password,
        phone_number,
      });

      // actual saving
      await new_model.save();

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
      const models = await Model.findById(req.params.id);

      return res.status(200).json({
        success: true,
        message: `success to find user by id`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find user by id}`,
        error: error.message,
      });
    }
  },

  updateById: async (req, res) => {
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
  loginManager: async (req, res) => {
    try {
      const { manager_email, manager_password } = req.body;

      if (!manager_email || !manager_password) {
        throw new Error("missing required filds");
      }
      const user = await Model.findOne({ manager_email });
      if (!user) {
        throw new Error("אימייל לא קיים");
      }

      const compare = await bcrypt.compare(
        manager_password,
        user.manager_password
      );
      if (compare) {
        const data = {
          manager: user.id,
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
            process.env.SECRET_ACCESS_TOKEN,
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

  logoutManager: async (req, res) => {
    try {
      console.log(req.cookies);
      const cookies = req.cookies.token;
      if (!cookies?.jwt) return res.status(204);

      res.clearCookie("jwt", { httpOnly: true });
      return res.status(200).json({
        success: true,
        message: `logout success`,
      });
    } catch (error) {
      return res.status(404);
    }
  },

  authManager: async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("no token provided");
      }

      const bearer = token.split(" ")[1];

      const decode = jwt.verify(bearer, process.env.JWT_SECRET);
      console.log(decode);
      const manager = await Model.findById(decode.manager).exec();
      console.log(manager);

      if (!manager || manager.permission !== 1) {
        throw new Error("access denided");
      }

      let payload = {
        manager: manager._id,
      };
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 10800,
      });

      let oldTokens = manager.tokens || [];

      if (oldTokens.length) {
        oldTokens = oldTokens.filter((t) => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 1000) {
            return t;
          }
        });
      }

      await Model.findByIdAndUpdate(manager._id, {
        tokens: [
          ...oldTokens,
          { token: refreshToken, signedAt: Date.now().toString() },
        ],
      }).exec();

      return res.status(201).json({
        success: true,
        message: "manager authoraized",
        token: refreshToken,
        manager: {
          _id: manager._id,
          manager_name: manager.manager_name,
          manager_email: manager.manager_email,
        },
      });
    } catch (error) {
      return res.status(401).json({
        message: "unauthoraized",
        error: error.message,
      });
    }
  },
};
