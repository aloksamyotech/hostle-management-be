import Payment from "../model/Payment.js";
import StudentReservation from "../model/StudentReservation.js";
import messages from "../constants/message.js";

// const add = async (req,res ) => {
//     console.log("in payment controller id=>",req.params.id);
//     console.log("req.body Dataaaaaaaa =>", req.body);
//     console.log("File Data paymentAttachment =>", req.file);
//     try{
//         console.log("in try");
//         const {studentName, month, paymentDate, paymentType, paymentAmount,} = req.body;

//         let data = await StudentReservation.findOne({studentName : studentName });
//         console.log("student Data =>",data);

//         let studentId = data._id;
//         console.log("studentId==>",studentId);

//         let totalAmmount = data.totalAmount;
//         console.log("totalAmount => ",totalAmmount);

//         let monthlyAmmount = data.MonthlyTotalAmmount;
//         console.log("monthlyAmmount => ",monthlyAmmount);

//         let monthlyPending = monthlyAmmount - paymentAmount ;
//         console.log("monthlyPending =>",monthlyPending);

//         let totalPending  = (totalAmmount - paymentAmount) + monthlyPending ;
//         console.log("totalPending =>",totalPending);

//         const newPayment = new Payment({
//             studentId,
//             studentName,
//             month,
//             paymentDate,
//             paymentType,
//             paymentAmount,
//             totalAmmount,
//             monthlyAmmount,
//             monthlyPending,
//             totalPending,
//             paymentAttachment : req.file.filename,
//             createdBy : req.params.id,
//         });
//         newPayment.save();
//         console.log("newPayment==>",newPayment);

//         res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});
//     }catch(error){
//         console.log("Error Found While add Data",error);
//         res.status(500).json({ message : messages.INTERNAL_SERVER_ERROR});
//     }
// }
function getMonthIndex(monthName) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthNames.indexOf(monthName);
}
const add = async (req, res) => {
  console.log(" Payment Controller ID =>", req.params.id);
  console.log(" Request Body Data =>", req.body);

  try {
    console.log(" Inside try block");

    const { studentName, month, paymentDate, paymentType, paymentAmount } =
      req.body;
    let actualPaymentAmount = Number(paymentAmount);

    let studentData = await StudentReservation.findOne({ studentName });

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(" Student Data Found:", studentData);
    let studentId = studentData._id;
    let studentPhoneNo = studentData.studentPhoneNo;
    let advancePayment = Number(studentData.advancePayment) || 0;

    let libraryAmount = Number(studentData.libraryAmount) || 0;
    let foodAmount = Number(studentData.foodAmount) || 0;
    let hostelRent = Number(studentData.hostelRent) || 0;
    let baseMonthlyAmount = libraryAmount + foodAmount + hostelRent;

    console.log(" Default Monthly Total Amount =>", baseMonthlyAmount);

    const startDate = new Date(studentData.startDate);
    const endDate = new Date(studentData.endDate);
    const paymentDateObj = new Date(paymentDate);
    const paymentMonth = getMonthIndex(month) + 1;

    const paymentYear = paymentDateObj.getFullYear();
    console.log("payment month ================", month);

    let adjustedMonthlyAmount = baseMonthlyAmount;

    let isFirstMonth =
      startDate.getMonth() + 1 === paymentMonth &&
      startDate.getFullYear() === paymentYear;

    if (isFirstMonth) {
      console.log(" First Month Calculation Needed");

      const startDay = startDate.getDate();
      const daysInMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      ).getDate();

      if (startDay > 1) {
        const dailyRate = baseMonthlyAmount / daysInMonth;
        let remainingDays = daysInMonth - startDay + 1;
        adjustedMonthlyAmount = Math.round(dailyRate * remainingDays);
      } else {
        console.log(" Student joined on the 1st, full month charge applied.");
      }
    } else {
      adjustedMonthlyAmount = baseMonthlyAmount;
    }

    let latestPayment = await Payment.findOne({ studentId }).sort({
      paymentDate: -1,
    });

    let monthlyPending = adjustedMonthlyAmount - actualPaymentAmount;
    let totalPending = adjustedMonthlyAmount - actualPaymentAmount;

    if (latestPayment) {
      console.log(" Latest Payment Data =>", latestPayment);

      monthlyPending = Math.max(
        0,
        latestPayment.monthlyPending +
          (adjustedMonthlyAmount - actualPaymentAmount)
      );
      totalPending = Math.max(latestPayment.totalPending - actualPaymentAmount);
    } else {
      console.log(" First Payment, Deducting Advance Payment");
      console.log("advance payment ========================", advancePayment);

      monthlyPending = Math.max(monthlyPending - advancePayment);
      actualPaymentAmount = actualPaymentAmount + advancePayment;
    }

    console.log(" Monthly Pending =>", monthlyPending);
    console.log(" Total Pending =>", totalPending);

    const newPayment = new Payment({
      studentId,
      studentName,
      studentPhoneNo,
      month,
      paymentDate,
      paymentType,
      paidAmount: actualPaymentAmount,
      libraryAmount,
      foodAmount,
      hostelRent,
      monthlyTotalAmount: adjustedMonthlyAmount,
      totalAmount: adjustedMonthlyAmount,
      monthlyPending,
      totalPending,
      paymentAttachment: req.file ? req.file.filename : undefined,
      createdBy: req.params.id,
    });

    await newPayment.save();
    console.log(" New Payment Added:", newPayment);

    res.status(201).json({ message: "Data submitted successfully" });
  } catch (error) {
    console.log(" Error While Adding Data:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const index = async (req, res) => {
  console.log("In index in payment id=>", req.params.id);
  try {
    let result = await Payment.find({
      deleted: false,
      createdBy: req.params.id,
    });
    let total_recodes = await Payment.countDocuments({
      deleted: false,
      createdBy: req.params.id,
    });
    res.status(200).send({
      result,
      totalRecodes: total_recodes,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const view = async (req, res) => {
  try {
    console.log("In view Id=====>", req.params.id);
    const result = await Payment.find({ studentId: req.params.id });
    const total_recodes = await Payment.countDocuments({
      studentId: req.params.id,
    });
    console.log("result==>", result, "total_recodes==>", total_recodes);
    res.status(200).send({
      result,
      totalRecodes: total_recodes,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

export default { add, index, view };
