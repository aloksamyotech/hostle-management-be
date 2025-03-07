import { sendEmail } from "../controllers/Sendmail.js";
export const reservationEmailTemplate = async (
  to,
  studentName,
  roomNumber,
  startDate,
  totalAmount,
  endDate
) => {
  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 10px;">
          <h3 style="color: #28a745;">Reservation Confirmed</h3>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Room Number:</strong> ${roomNumber}</p>
          <p><strong>Start Date:</strong> ${startDate}</p>
          <p><strong>End Date:</strong> ${endDate}</p>
          <p><strong>Total Amount:</strong> ${totalAmount}</p>
          <p>Thank you for your reservation!</p>
        </body>
    </html>
  `;

  await sendEmail(to, "Reservation Confirmation", emailContent);
};
