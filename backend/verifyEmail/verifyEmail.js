import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import handlebars from "handlebars"

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

export const verifyEmail =  (token,email) => {

     const emailTemplateSource = fs.readFileSync(
        path.join(_dirname,"template.hbs"),
        "utf-8"
     )

     const template = handlebars.compile(emailTemplateSource)
     const htmlTosend = template({token:encodeURIComponent(token)})

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
        html:htmlTosend
    }
    transport.sendMail(mailOptions,function(error,response){
        if(error) throw new error(error);
        console.log("Email has been sent successfully");
        console.log(response);
    })
}