import React, { useState } from "react";
import "./Register.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const initialState = {
  email: "",
  name: "",
  age: "",
  nationality: "",
  g_name: "",
  g_email: "",
  gender: "",
  roomNum: "",
};

const override = {
  display: "block",
  margin: "100px auto",
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const StudentReg = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        email,
        name,
        age,
        nationality,
        g_name,
        g_email,
        gender,
        roomNum,
      } = formData;

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
        toast.error("All fields are required");
        return;
      }
      setIsSubmitting(true);

      await axios.post(
        `${BASE_URL}/student/register-student`,
        formData,
        { withCredentials: true }
      );

      toast.success("Student added successfully");
      setIsLoading(true);
      navigate("/student-dash");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // const gender = ["Select", "Male", "Female", "Others"];

  return (
    <>
      {isLoading ? (
        <ClipLoader
          color="#3a86ff"
          cssOverride={override}
          loading={isLoading}
        />
      ) : (
        <div className="container form__ --100vh">
          <div className="form-container">
            <p className="title">Register a new student</p>
            <form className="form" onSubmit={handleSubmit}>
              <div className="--dir-column">
                <label htmlFor="name">Student Name:</label>
                <input
                  type="text"
                  className="input"
                  name="name"
                  placeholder="Enter your full name"
                  onChange={handleInputChange}
                  value={formData.name}
                  required
                />
              </div>
              <div className="--dir-column">
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  className="input"
                  name="age"
                  placeholder="Enter age"
                  onChange={handleInputChange}
                  value={formData.age}
                  required
                />
              </div>

              <div className="--dir-column">
                <label htmlFor="nationality">Nationality:</label>
                <input
                  type="text"
                  className="input"
                  name="nationality"
                  placeholder="Enter nationality"
                  onChange={handleInputChange}
                  value={formData.nationality}
                  required
                />
              </div>

              <div className="--dir-column">
                <label htmlFor="gender">Gender:</label>
                <select
                  name="gender"
                  className="input"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value={"select"}>Select</option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                  <option value={"Others"}>Others</option>
                </select>
              </div>

              <div className="--dir-column">
                <label htmlFor="roomNum">Room Number:</label>
                <input
                  type="number"
                  className="input"
                  name="roomNum"
                  placeholder="Enter room number"
                  onChange={handleInputChange}
                  value={formData.roomNum}
                  required
                />
              </div>
              <div className="--dir-column">
                <label htmlFor="email">Contact Email:</label>
                <input
                  type="email"
                  className="input"
                  name="email"
                  placeholder="Enter your Email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
              </div>
              <div className="--dir-column">
                <label htmlFor="g_name">Guardian's Name:</label>
                <input
                  type="text"
                  className="input"
                  name="g_name"
                  placeholder="Enter guardian Name"
                  onChange={handleInputChange}
                  value={formData.g_name}
                  required
                />
              </div>
              <div className="--dir-column">
                <label htmlFor="g_email">Guardian's Contact Email:</label>
                <input
                  type="email"
                  className="input"
                  name="g_email"
                  placeholder="Guardian's email"
                  onChange={handleInputChange}
                  value={formData.g_email}
                  required
                />
              </div>

              <button className="--btn" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add student"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentReg;
