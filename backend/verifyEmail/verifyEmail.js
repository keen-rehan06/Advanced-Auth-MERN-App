import nodemailer from "nodemailer"

export const verifyEmail =  (token,email) => {
    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })
    const mailOptions = {
        from: process.env.MAIL_USER,
        to:email,
        subject:"hey this is simply testing",
        html: <h1>This is testing</h1>
    }
    transport.sendMail(mailOptions,function(error,response){
        if(error) throw new error(error);
        console.log("Email has been sent successfully");
        console.log(response);
    })
}