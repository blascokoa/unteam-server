const nodeoutlook = require('nodejs-nodemailer-outlook')

const sendVerifyEmail = ( async (email, code) => {
  const link = process.env.VERIFY_EMAIL + "/signup/email-confirmation/" + code
  nodeoutlook.sendEmail({
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD
    },
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: 'Please Verify your Unteam account.',
    html: "<h1>Welcome to Unteam</h1> <p>Please verify your email account clicking on the following link:</p> <a href='"+ link +"'>Verify your email</a> <br> <h5>Best regards:</h5> <h6> Unteam Staff </h6>",
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i)
  });
});

const sendRecoverEmail = ( async (email, code) => {
  const link = process.env.VERIFY_EMAIL + "/api/auth/recover?code=" + code
  nodeoutlook.sendEmail({
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD
    },
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: 'Password recovery for your Unteam account.',
    html: "<h1>Welcome to Unteam</h1> <p>Please paste the following code into our website:</p> <pre><code>"+ code +"</code></pre> <br> <h5>Best regards:</h5> <h6> Unteam Staff </h6>",
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i)
  });
});


module.exports = {sendVerifyEmail, sendRecoverEmail};



// const nodemailer = require("nodemailer");
// const xoauth2 = require('xoauth2');
//
// const sendVerifyEmail = (email, code) => {
//   const to = email;
//   const smtpTransport = nodemailer.createTransport({
//     service: "Gmail",
//     port: 465,
//     secure: true,
//     auth: {
//       xoauth2: xoauth2.createXOAuth2Generator({
//         user: process.env.SENDER_EMAIL,
//         pass: process.env.SENDER_EMAIL_PASSWORD
//       })
//     }
//   });
//   const mailOptions = {
//     from: process.env.SENDER_EMAIL,
//     to: to,
//     subject: 'Verify your Unteam Account',
//     text: `Welcome to Unteam\n
//     Please verify your email account clicking on the following link:\n
//     ${process.env.ORIGIN}/api/verify/${code}`
//   }
//
//   smtpTransport.sendMail(mailOptions, function(error, response){
//     if(error){
//       console.log(error);
//       return false
//     }else{
//       return response;
//     }
//   });
//   return true;
// }
//
// module.exports = sendVerifyEmail;


// const ProtonMail = require('protonmail-api');
//
// const sendVerifyEmail = ( async (email, code) => {
//   const pm = await ProtonMail.connect({
//     username: process.env.PROTON_EMAIL,
//     password: process.env.PROTON_PASSWORD,
//   })
//   await pm.sendEmail({
//     to: email,
//     subject: 'Please Verify your Unteam account.',
//     body: `
//     <h1>Welcome to Unteam</h1>
//     <p>Please verify your email account clicking on the following link:</p>
//     <p><a href="${process.env.VERIFY_EMAIL}/api/auth/verify?code=${code}">Verification Link</a></p>
//     <br>
//     <h5>Best regards:</h5>
//     <h6>Unteam Staff</h6>`
//   })
//   await pm.close()
// })
//
// module.exports = sendVerifyEmail;

