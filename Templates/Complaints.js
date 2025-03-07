import { sendEmail } from "../controllers/Sendmail.js";

export const complaintEmailTemplate = async (
  to,
  studentName,
  roomNumber,
  datetime,
  problemDescription
) => {
  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 10px;">
        <h3 style="color: #007bff;">New Complaint Registered</h3>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Room No:</strong> ${roomNumber}</p>
        <p><strong>Date & Time:</strong> ${datetime}</p>
        <p><strong>Issue:</strong> ${problemDescription}</p>
        <p>Please check and resolve it.</p>
      </body>
    </html>
  `;

  await sendEmail(to, "New Student Complaint", emailContent);
};
