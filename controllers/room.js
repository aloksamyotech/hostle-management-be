import messages from "../constants/message.js";
import Room from "../model/Room.js";
import User from "../model/User.js";
import Hostel from "../model/Hostel.js";
import StudentReservation from "../model/StudentReservation.js";
import { v4 as uuidv4 } from "uuid";
import Roomtype from "../model/type.js";

const add = async (req, res) => {
  try {
    const { roomNumber, roomType } = req.body;
    console.log("rohit malviya=============================", req.body);

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists." });
    }

    const fileNames = req.files.map((file) => file.filename);
    const normalizedRoomType = roomType.trim().toLowerCase();

    const bedMapping = {
      "single seater": 1,
      "double seater": 2,
      "three seater": 3,
      "four seater": 4,
      "five seater": 5,
      "six seater": 6,
      "seven seater": 7,
      "eight seater": 8,
      "nine seater": 9,
      "ten seater": 10,
      "eleven seater": 11,
      "twelve seater": 12,
      "thirteen seater": 13,
      "fourteen seater": 14,
      "fifteen seater": 15,
      "sixteen seater": 16,
      "seventeen seater": 17,
      "eighteen seater": 18,
      "nineteen seater": 19,
      "twenty seater": 20,
    };

    const numOfBeds = bedMapping[normalizedRoomType] || 0;

    // ✅ Change bedIDs to an array of objects (bedId + active)
    const bedIDs = [];
    for (let i = 0; i < numOfBeds; i++) {
      bedIDs.push({ bedId: uuidv4(), active: true }); // ✅ Each bed has active: true
    }

    const roomData = new Room({
      roomNumber,
      roomType,
      numOfBeds,
      availableBeds: numOfBeds,
      bedIDs, // ✅ Now storing as an array of objects
      roomphoto: fileNames,
      createdBy: req.params.id,
    });

    await roomData.save();
    res.status(201).json({ message: "Room added successfully!" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const index = async (req, res) => {
  console.log("In room controller..===================rohit");
  console.log("Req Id=>", req.params.id);

  try {
    let result = await Room.find({ deleted: false, createdBy: req.params.id });
    console.log("result===>", result);

    let total_recodes = await Room.countDocuments({
      deleted: false,
      createdBy: req.params.id,
    });
    console.log("total_recodes==>", total_recodes);

    const totalAvailableBeds = result.reduce(
      (sum, room) => sum + room.availableBeds,
      0
    );
    console.log("Total Available Beds =====>", totalAvailableBeds);

    let availableRoomCount = await Room.countDocuments({
      deleted: false,
      createdBy: req.params.id,
      availableBeds: { $ne: 0 },
    });
    console.log("availableRoomCount ======>", availableRoomCount);

    res.status(200).send({
      result,
      totalRecodes: total_recodes,
      availableRoomCount,
      totalAvailableBeds,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const view = async (req, res) => {
  console.log("In room controller..");
  console.log("Id :", req.params.id);

  try {
    const room = await Room.findById(req.params.id);
    console.log("Room Data:", room);

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    const studentReservations = await StudentReservation.find({
      bedId: { $in: room.bedIDs },
      status: "active",
    });

    console.log("Student Reservations:", studentReservations);

    const bedBookings = room.bedIDs.map((bedId) => {
      const student = studentReservations.find((s) => s.bedId === bedId);
      return {
        bedId,
        studentName: student ? student.studentName : null,
        id: student ? student._id : null,
      };
    });

    const response = {
      _id: room._id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      numOfBeds: room.numOfBeds,
      occupiedBeds: room.occupiedBeds,
      availableBeds: room.availableBeds,
      bedBookings,
      roomphoto: room.roomphoto,
      createdBy: room.createdBy,
    };

    res
      .status(200)
      .json({ result: response, message: "Room data found successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const edit = async (req, res) => {
  console.log("In room controller Edit..");
  console.log("Id =>", req.params.id);
  console.log("room File Data =>", req.files);
  try {
    const fileNames = req.files.map((file) => file.filename);
    console.log("fileNames==>", fileNames);

    const bedMapping = {
      "Single Seater": 1,
      "Double Seater": 2,
      "Three Seater": 3,
      "Four Seater": 4,
      "Five Seater": 5,
      "Six Seater": 6,
      "Seven Seater": 7,
      "Eight Seater": 8,
      "Nine Seater": 9,
      "Ten Seater": 10,
      "Eleven Seater": 11,
      "Twelve Seater": 12,
      "Thirteen Seater": 13,
      "Fourteen Seater": 14,
      "Fifteen Seater": 15,
      "Sixteen Seater": 16,
      "Seventeen Seater": 17,
      "Eighteen Seater": 18,
      "Nineteen Seater": 19,
      "Twenty Seater": 20,
    };
    const numOfBeds = bedMapping[req.body.roomType] || 0;

    let result = await Room.updateOne(
      { _id: req.params.id },
      {
        $set: {
          roomNumber: req.body.roomNumber,
          roomType: req.body.roomType,
          numOfBeds: numOfBeds,
          availableBeds: numOfBeds,
          roomphoto: fileNames,
        },
      }
    );
    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  console.log("In room controller deleteData ..");
  console.log("Id:", req.params.id);
  try {
    const result = await Room.findById({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await Room.findByIdAndUpdate({ _id: req.params.id }, { deleted: true });
      console.log("Room Details deleted successfully !!");
      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

const countRooms = async (req, res) => {
  try {
    const roomRecords = await Room.countDocuments({ deleted: false });
    console.log("roomRecords==>", roomRecords);
    res.status(200).json({ roomRecords, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

export const adddd = async (req, res) => {
  try {
    const { Roomtypee } = req.body;
    console.log("Room", req.body);

    if (!Roomtypee) {
      return res.status(400).json({ message: "Room type name is required" });
    }

    const newRoomType = new Roomtype({ Roomtypee, createdBy: req.params.id });
    await newRoomType.save();
    res.status(201).json(newRoomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateBeds = async (req, res) => {
  try {
    console.log("In calculateBeds...");

    const hostels = await Hostel.find({});
    console.log("hostels =>", hostels);

    let hostelIds = hostels.map((hostel) => hostel.uniqueCode);
    console.log("hostelIds =>", hostelIds);

    let hostelNames = hostels.map((hostel) => hostel.hostelName);
    console.log("hostelNames =>", hostelNames);

    let hostelsData = [];

    for (let hostelId of hostelIds) {
      const rooms = await Room.find({ hostelId: hostelId, deleted: false });
      console.log(`Rooms for Hostel ID ${hostelId} =>`, rooms);

      let totalBeds = 0;
      let totalOccupiedBeds = 0;

      for (let room of rooms) {
        totalBeds += room.numOfBeds;
        totalOccupiedBeds += room.occupiedBeds;
      }

      const totalAvailableBeds = totalBeds - totalOccupiedBeds;

      const hostelData = {
        TotalBeds: totalBeds,
        TotalOccupiedBeds: totalOccupiedBeds,
        TotalAvailableBeds: totalAvailableBeds,
      };

      hostelsData.push(hostelData);
    }

    console.log("hostelsData ====>", hostelsData);

    res
      .status(200)
      .json({ hostelsData, hostelNames, message: "Data found successfully." });
  } catch (error) {
    console.error("Error calculating beds:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const gettype = async (req, res) => {
  try {
    const roomTypes = await Roomtype.find();
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    const roomType = await Roomtype.findById(id);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    await Roomtype.findByIdAndDelete(id);

    res.status(200).json({ message: "Room type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  add,
  adddd,
  gettype,
  deleteType,
  index,
  view,
  edit,
  deleteData,
  countRooms,
  calculateBeds,
};
