import React, { useState } from 'react'

const EditRoleModal = ({admin, onUpdateRole, onClose}) => {
    const [newRole, setNewRole] = useState(admin.role);
    const handleRoleChange = (e) => {
        setNewRole(e.target.value);
    }

    const handleSubmit = () => {
        onUpdateRole(admin._id, newRole);
        onClose()
    }
    
  return (
    <div className='modal'>
        <div className="modal-content">
            <h2 className='modal-title'>Edit Role</h2>
            <p className="user-name">Admin: {admin.name}</p>
            <label htmlFor="role" className='role-label'>New Role:</label>
            <input type="text" id='role' className='role-input' value={newRole} onChange={handleRoleChange}/>
            <div className='button-group'>
                <button className='save-button' onClick={handleSubmit}>Save</button>
                <button className='cancel-button' onClick={onClose}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default EditRoleModal