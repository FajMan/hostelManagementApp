import React, { useState } from 'react'
import "./Dashboard.css"

const EditStatusModal = ({room, onUpdateRoom, onClose}) => {
    const [newStatus, setNewStatus] = useState(room.roomStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);    
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("")

        try {

            console.log("Room updated");
            onUpdateRoom({...room, roomStatus: newStatus});
            onClose();
            
        } catch (error) {
            setError("Failed to update room status, try again");
            console.log(error);
        }finally {
            setIsSubmitting(false)
        }
    }


  return (
    <div className='modal'>
        <div className='modal-content'>
            <h2 className='modal-title'>Edit Room Status</h2>
            <p className='room-number'>Room Number: {room.roomNumber}</p>
            <label htmlFor="status" className='status-label'>
                New Status: {newStatus}
            </label>

            <div className='right'>
                <input
                id="status"
                className='search'
                value={newStatus}
                onChange={handleStatusChange}
                type="text" />
            </div>

            <div className='button-group'>
                <button disabled={isSubmitting} className='save-button' onClick={handleSubmit}>
                    Save
                </button>

                <button className='cancel-button' onClick={onClose}>
                    Cancel
                </button>

            </div>

        </div>
      
    </div>
  )
}

export default EditStatusModal