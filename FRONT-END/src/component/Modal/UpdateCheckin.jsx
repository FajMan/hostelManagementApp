import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateCheckin = ({ student, onClose, currentRoomNumber }) => {
  const [action, setAction] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(student);

  const handleRoomChange = (e) => {
    setRoomNumber(e.target.value);
  };
  const handleActionChange = (e) => {
    setAction(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(student);
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/student/check-in-status`,
        {
          studentId: student._id,
          action,
          roomNumber: student?.room?.roomNumber,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      toast.success(res?.data?.message);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.res?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Check-In Status</h2>

        <p>Current Status: {student.checkedIn ? "CheckedIn" : "Checked Out"}</p>

        <p>Current Room: </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="">Room Number</label>
            <input
              type="number"
              value={currentRoomNumber || roomNumber}
              onChange={handleRoomChange}
              placeholder="Enter Room Number"
            />
          </div>

          <div>
            <label htmlFor="">Action</label>
            <select value={action} onChange={handleActionChange}>
              <option value="&nbsp;">Select an action</option>
              <option value="checkIn" disabled={student.checkedIn}>
                Check In
              </option>
              <option value="checkOut" disabled={!student.checkedIn}>
                Check Out
              </option>
            </select>
          </div>

          <button type="submit">
            {isSubmitting ? "Updating..." : "Update Status"}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCheckin;
