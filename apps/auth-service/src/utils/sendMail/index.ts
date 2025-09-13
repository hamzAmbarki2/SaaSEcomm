import nodemailer from "nodemailer";
import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

 const renderEmailTemplate = async (templateName: string, data:Record<string, any>) : Promise<string> => { // Render the email template with the provided data
    const templatePath =path.join(process.cwd(), 'apps', 'auth-service', 'src', 'utils', 'sendMail', 'templates', `${templateName}.ejs`);
    return  ejs.renderFile(templatePath, data);
}
export const sendEmail = async (to: string, subject: string, templateName: string, data: Record<string, any>) => {
  try {
    const htmlContent = await renderEmailTemplate(templateName, data);  // Render the email template with the provided data
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};