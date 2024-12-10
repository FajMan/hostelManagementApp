const express = require("express");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const { createNewRoom, getAllRooms, getRoom, deleteRoom, updateRoom } = require("../controller/RoomController");

router.post("/create-room", protectAdmin, createNewRoom);
router.get("/", protectAdmin, getAllRooms);
router.get("/:roomId", protectAdmin, getRoom);
router.patch("/update-room/:roomId", protectAdmin, updateRoom);
router.delete("/delete/:roomId", protectAdmin, deleteRoom);

module.exports = router;