const nodemailer=require('nodemailer');

const mailHelper =async (options) => 
{
    const transporter = nodemailer.createTransport({
        // @ts-ignore
        host : process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.SMTP_USER,
            pass:process.env.SMTP_PASS,
        },
    });

    const message ={
        from: '"Utkarsh@lco.dev"', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        
      };

      await transporter.sendMail(message);
    }

module.exports = mailHelper;