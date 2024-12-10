const asyncHandler = require("express-async-handler");
const Student = require("../models/StudentModel");
const Room = require("../models/RoomModel");
const { json } = require("express");

const date = new Date();
const formatDate = (input) => {
  return input > 9 ? input : ` 0${input}`;
};

const formatHour = (input) => {
  return input > 12 ? input - 12 : input;
};

const format = {
  dd: formatDate(date.getDate()),
  mm: formatHour(date.getMonth() + 1),
  yyyy: formatDate(date.getFullYear()),

  HH: formatDate(date.getHours()),
  hh: formatDate(formatHour(date.getHours())),

  MM: formatDate(date.getMinutes()),
  SS: formatDate(date.getSeconds()),
};

const format24Hour = ({ dd, mm, yyyy, HH, MM, SS }) => {
  return ` ${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`;
};

const registerStudent = asyncHandler(async (req, res) => {
  try {
    const { email, name, age, nationality, g_name, g_email, gender, roomNum } =
      req.body;

    console.log(
      email,
      name,
      age,
      nationality,
      g_name,
      g_email,
      gender,
      roomNum
    );

    if (
      !email ||
      !name ||
      !age ||
      !nationality ||
      !g_name ||
      !g_email ||
      !gender ||
      !roomNum
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // checking if student already exist

    const studentExist = await Student.findOne({ email });

    if (studentExist) {
      return res.status(400).json({ message: "Student already exist" });
    }

    const room = await Room.findOne({ roomNumber: roomNum });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.roomStatus !== "available") {
      return res.status(400).json({ message: "Room is not available" });
    }

    const student = await Student.create({
      email,
      name,
      age,
      nationality,
      guardian: {
        guardianName: g_name,
        guardianEmail: g_email,
      },
      gender,
      room: room._id,
      checkedIn: true,
      checkedInTime: new Date(),
    });

    room.roomOccupancy.push(student._id);

    if (room.roomOccupancy.length >= room.roomCapacity) {
      room.roomStatus = "unavailable";
    }
    await room.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllStudents = asyncHandler(async (req, res) => {
  // find all students and sort them in descending order so new student comes first

  try {
    const students = await Student.find().populate("room").sort("createdAt");
    if (!students) {
      return res.status(404).json({ msg: "No student found" });
    }
    res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

const getStudent = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (student) {
      return res.status(200).json(student);
    } else {
      return res.status(404), json({ message: "student not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateStudentProfile = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { name, age, nationality, g_name, g_email } = req.body;

    console.log("reqbody", req.body);

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name || student.name;
    student.age = age || student.age;
    student.nationality = nationality || student.nationality;
    student.guardian.guardianName = g_name || student.guardian.guardianName;
    student.guardian.guardianEmail = g_email || student.guardian.guardianEmail;

    const updateStudent = await student.save();
    res.status(200).json(updateStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const changeStudentRoom = asyncHandler(async (req, res) => {
  const { studentId, newRoomNum } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const currentRoom = await Room.findById(student.room);

    // remove current student from the list of students in the current room
    currentRoom.roomOccupancy = currentRoom.roomOccupancy.filter(
      (occupant) => occupant.toString() != studentId
    );

    // if length of current room is less than its capacity, change its status
    if (currentRoom.roomOccupancy.length < currentRoom.roomCapacity) {
      currentRoom.roomStatus = "available";
    }

    await currentRoom.save();

    const newRoom = await Room.findOne({ roomNumber: newRoomNum });
    if (!newRoom) {
      return res.status(404).json({ message: "New room not found" });
    }

    if (newRoom.roomStatus !== "available") {
      return res.status(400).json({ message: "New room is not available" });
    }
    student.room = newRoom._id;
    newRoom.roomOccupancy.push(student._id);

    if (newRoom.roomOccupancy.length >= newRoom.roomCapacity) {
      newRoom.roomStatus = "unavailable";
    }

    await newRoom.save();
    await student.save();
    res
      .status(200)
      .json({ message: "Room changed successfully" }, student, newRoom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateCheckInStatus = asyncHandler(async (req, res) => {
  const { studentId, action, roomNumber } = req.body;

  const student = await Student.findById(studentId);

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  if (action === "checkIn") {
    student.checkedIn = true;
    student.checkedInTime = format24Hour(format);
  } else if (action === "checkOut") {
    student.checkedIn = false;
    student.checkedOutTime = format24Hour(format);
  } else {
    return res.status(400).json({ message: "invalid action" });
  }

  const room = await Room.findOne({ roomNumber });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  if (action === "checkIn") {
    room.roomOccupancy.push(studentId);

    await room.save();
    await student.save();

    return res.status(200).json({ message: "Student checked-in" });
  } else if (action === "checkOut") {
    const filteredStudent = room.roomOccupancy.filter(
      (stdId) => stdId != studentId
    );

    room.roomOccupancy = filteredStudent;

    await room.save();
    await student.save();

    return res.status(200).json({ message: "Student checked-out" });
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }

    await student.deleteOne();
    res.status(200).json({ message: "student deleted successfully" });

    const studentRoom = await Room.findById(student.room);

    if (studentRoom && student) {
      studentRoom.roomOccupancy = studentRoom.roomOccupancy.filter(
        (occupant) => occupant.toString() != studentId
      );

      await studentRoom.save();
      await student.save();

      return res.status(200).json("student successfully deleted");
    } else {
      return res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  registerStudent,
  getAllStudents,
  getStudent,
  updateStudentProfile,
  changeStudentRoom,
  updateCheckInStatus,
  deleteStudent,
};
