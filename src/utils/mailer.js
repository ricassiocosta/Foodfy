const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fcf3da9c9553c9",
    pass: "fce6463f17b04e"
  }
});