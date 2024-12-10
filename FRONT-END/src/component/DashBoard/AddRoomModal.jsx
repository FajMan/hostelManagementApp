import React, { useState } from 'react'
import "./Dashboard.css"

const AddRoomModal = ({onAddRoom, onClose}) => {

    const [newRoom, setNewRoom] = useState({
        roomNumber: "",
        roomCapacity: "",
        roomLocation: ""

    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;

        setNewRoom((prevRoom) => ({...prevRoom, [name]: value}))
    };

    const handleSubmit = async() => {
        setIsSubmitting(true);
        setError("");

        try {
            
            onAddRoom({...newRoom, _id: 8, roomStatus: "Available", roomOccupancy: []});
            onClose()
        } catch (error) {
            setError("Failed to add room", error);
            console.log(error);
        }finally {
            setIsSubmitting(false)
        }
    }
  return (
    <div className='modal'>
        <div className='modal-content --flex-start --dir-column'>
            <h2 className='modal-title'>
                Add New Room
            </h2>
            <label htmlFor="roomNumber" className='room-label'>Room Number:</label>
            <input 
            name='roomNumber'
            type="number"
            id='roomNumber'
            value={newRoom?.roomNumber}
            onChange={handleChange}
            className='input-field'
            />

            <label htmlFor="roomCapacity" className='room-label'>Capacity:</label>
            <input 
            name='roomCapacity'
            type="number"
            id='roomCapacity'
            value={newRoom?.roomCapacity}
            onChange={handleChange}
            className='input-field'
            />

            <label htmlFor="roomLocation">Location:</label>
            <input 
            name='roomLocation'
            type="text"
            id='roomLocation'
            value={newRoom?.roomLocation}
            onChange={handleChange}
            className='input-field'
            />

            {error && <p>{error}</p>}

            <div className="button-group">
                <button className='btn-primary' onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add"}
                </button>

                <button className='btn-secondary' onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  )
}

export default AddRoomModal