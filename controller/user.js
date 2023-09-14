const userModel = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  singUp: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: 'Required Fields Cannot be an empty' });
      }

      const userFound = await userModel.findOne({
        email: email,
      });
      if (userFound) {
        return res.status(400).send({ message: 'Email already Exist' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASSWORD,
      //   },
      // });
      const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',     // Etherial
        port: 587,
        auth: {
          user: 'process.env.EMAIL',
          pass: 'process.env.PASSWORD',
        },
      });
      const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
      const htmlContent = `<p>Click the following link to verify your email:</p>
      <a href="http://localhost:4000/api/users/verify/${token}">Verify Email</a>`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Link for LogIn',
        html: htmlContent,
      };
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).send({ message: 'Failed to send email.' });
        } else {
          console.log('Link email sent:', info.response);
          res.status(201).send({
            newUser,
            token,
            message: 'Link sent. Proceed to Link verification.',
          });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'An error occurred.' });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await userModel.findOneAndUpdate(
        { verificationURL: token },
        { isVerify: true, verificationURL: undefined }
      );

      if (!user) {
        return res.status(400).json({ message: 'Invalid verification token.' });
      }
      res.status(200).send({ message: 'Email verified successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'An error occurred.' });
    }
  },
};
