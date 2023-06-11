// const Mailjet = require('node-mailjet');
// // require("dotenv").config();

// const {MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, MJ_SENDER_EMAIL} = process.env;

// const mailjet = new Mailjet({
//     apiKey: MJ_APIKEY_PUBLIC,
//     apiSecret: MJ_APIKEY_PRIVATE
//   });

const nodemailer = require("nodemailer");

const {UKR_NET_EMAIL, UKR_NET_PASS} = process.env;

nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASS,
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async(data) => {
    const email = {...data, from: UKR_NET_EMAIL};
    await transport.sendMail(email);
    return true;
}

//   const sendEmail = async (data) => {
//     await mailjet.post('send', { version: 'v3.1' }).request({
//       Messages: [
//         {
//           From: {
//             Email: MJ_SENDER_EMAIL,
//           },
//           To: [
//             {
//               Email: data.to,
//             }
//           ],
//           Subject: data.subject,
//           TextPart: "Dear User, welcome to Contacts book!",
//           HTMLPart: data.html,
//         }
//       ]
//     });
//     return true;
//   }
  
  module.exports = sendEmail;