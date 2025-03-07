import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "8728ac001@smtp-brevo.com",
    pass: "qw14Am8s5DCR6rPa",
  },
});
/**
 * Send an email using Nodemailer.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text content.
 * @param {string} [html] - HTML content (optional).
 * @returns {Promise<boolean>} - Returns true if email sent successfully, otherwise false.
 */
export const sendEmail = async (to, subject, text, html = null) => {
  const mailOptions = {
    from: process.env.Mail_ID,
    to,
    subject,
    text,
    ...(html && { html }),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
