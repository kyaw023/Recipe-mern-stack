const nodemailer = require("nodemailer");
const ejs = require("ejs");

const sendEmail = async ({ path, data, from, to, subject }) => {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MIAL_PASS,
      },
    });

    const dataString = await ejs.renderFile(`./views/${path}.ejs`, data);

    const info = transport.sendMail({
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      html: dataString, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendEmail;
