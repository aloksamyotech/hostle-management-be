import { sendEmail } from "../controllers/Sendmail.js";

export const noticeEmailTemplate = async (
  to,
  noticeTitle,
  description,
  dateTime
) => {
  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 10px;">
        <h3 style="color: #007bff;">New Notice Posted</h3>
        <p><strong>Notice Title:</strong> ${noticeTitle}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Date & Time:</strong> ${dateTime}</p>
        <p>This is a notification that a new notice has been posted on the Notice Board.</p>
        <p>Thank you!</p>
      </body>
    </html>
  `;

  await sendEmail(to, "New Notice Posted", emailContent);
};
