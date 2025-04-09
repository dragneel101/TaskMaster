const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    const errBody =
    error && error.response && error.response.body ?
      error.response.body :
      error.message || error;
    console.error(`Error sending email to ${to}:`, errBody);
  }
};
module.exports = {sendEmail};
