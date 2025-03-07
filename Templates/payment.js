import { sendEmail } from "../controllers/Sendmail.js";

export const paymentEmailTemplate = async (
  to,
  studentName,
  month,
  paymentDate,
  paymentType,
  paidAmount,
  libraryAmount,
  foodAmount,
  hostelRent,
  monthlyTotalAmount,
  baseMonthlyAmount
) => {
  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 10px;">
        <h3 style="color: #28a745;">Payment Confirmation</h3>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Month:</strong> ${month}</p>
        <p><strong>Payment Date:</strong> ${paymentDate}</p>
        <p><strong>Payment Type:</strong> ${paymentType}</p>
        <p><strong>Paid Amount:</strong> ${paidAmount}</p>
        <p><strong>Library Amount:</strong> ${libraryAmount}</p>
        <p><strong>Food Amount:</strong> ${foodAmount}</p>
        <p><strong>Hostel Rent:</strong> ${hostelRent}</p>
        <p><strong>Monthly Total Amount:</strong> ${monthlyTotalAmount}</p>
        <p><strong>Total Amount:</strong> ${baseMonthlyAmount}</p>
        <p>Thank you for your payment!</p>
      </body>
    </html>
  `;

  await sendEmail(to, "Payment Confirmation", emailContent);
};
