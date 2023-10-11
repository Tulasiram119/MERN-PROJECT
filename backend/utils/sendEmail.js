const nodemailer = require("nodemailer");






const sendEmail = async (options)=>{


    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.SMT_MAIL,
            pass: process.env.SMT_PASSWORD
        }
    });

      
        // send mail with defined transport object
          const info = await transporter.sendMail({
          from: `TULASIRAM 👻 <${process.env.SMT_MAIL}>`, // sender address
          to: `${options.email}`, // list of receivers
          subject: `${options.subject}`, // Subject line
          text: `${options.text}`, // plain text body
          html: "<b>Hello world?</b>", // html body
        });

 

}

module.exports = sendEmail;