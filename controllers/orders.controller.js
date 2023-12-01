let controler_name = "order";
let object_name = "Order";
let objects_name = "orders";
const mailer = require("nodemailer");

let Model = require(`../models/${object_name}`);

module.exports = {
  addNewOrderForCustomer: async (req, res, next) => {
    try {
      // getting values from the body request
      const { user, products, customer_details } = req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        user,
        products,
        customer_details,
      });
      // actual saving
      await new_model.save();

      try {
        const mail_template = `
            <html dir="rtl">
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                  }
            
                  h1 {
                    color: #333;
                  }
            
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f8f8;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    direction: rtl
                  }
            
                  .order-details {
                    margin-bottom: 20px;
                  }
            
                  .order-details table {
                    width: 100%;
                    border-collapse: collapse;
                  }
            
                  .order-details th,
                  .order-details td {
                    padding: 10px;
                    border: 1px solid #ccc;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>לכבוד ${customer_details.customer_name},</h1>
                  <p> תודה רבה לך על ההזמנה! קיבלנו את התשלום והתחלנו את תהליך ההזמנה</p>
            
                  <div class="order-details">
                    <h2>פרטי ההזמנה:</h2>
                    <table>
                      <tr>
                        <th>מספר הזמנה:</th>
                        <td>${new_model.order_number}</td>
                      </tr>
                      <tr>
                        <th>סכום כולל:</th>
                        <td>${new_model.total_price} ₪</td>
                      </tr>
                    </table>
                  </div>
            
                  
            
                  <p>תודה רבה שבחרת את שירותינו.</p>
            
                  <p>לשירותך,<br>אוצר הספרים</p>
                </div>
              </body>
            </html>
            `;

        const transporter = mailer.createTransport({
          service: "gmail",
          auth: {
            user: "netaneltu@gmail.com",
            pass: "blpc goui fpjy vlrp",
          },
        });

        const mail = {
          to: customer_details.customer_email,
          subject: `New Order : ${new_model.order_number}`,
          html: mail_template,
        };

        await transporter.sendMail(mail);

        return res.status(200).json({
          success: true,
          message: `success to add new order - for registered user`,
          order_number: new_model.order_number,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name} - for guest`,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const models = await Model.find();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name}`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name}`,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const models = await Model.findById(req.params.id);

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id}`,
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
        message: `success to update ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} by id`,
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
        message: `success to delete ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete ${controler_name} by id`,
        error: error.message,
      });
    }
  },
};
