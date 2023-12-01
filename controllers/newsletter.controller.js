let Model = require(`../models/Newsletter`);
const mailer = require("nodemailer");

module.exports = {
  newsletterRegister: async (req, res) => {
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

      try {
        const mail_template = `
            <html dir="rtl">
            <head>
            <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f8f8;
              border: 1px solid #ccc;
              border-radius: 5px;
              direction: rtl
            }
            </style>
            </head>

      
              <body>
                <div class="container">
                  <h1>לכבוד ${name},</h1>
                  <p> תודה לך שנרשמת לעדכונים, אנו נעדכן אותך בכל מבצע חדש</p>
            
                 
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
          to: email,
          subject: `רישום לעדכונים אוצר הספרים`,
          html: mail_template,
        };
        await transporter.sendMail(mail);

        // if (Model.some({ email })) {
        //   throw new Error("מייל זה כבר רשום במערכת");
        // }

        // return success message
        return res.status(200).json({
          success: true,
          message: `success to register to newletter`,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      return res.status(500).json({
        message: `error in add user`,
        error: error.message,
      });
    }
  },

  // ___________________
};
