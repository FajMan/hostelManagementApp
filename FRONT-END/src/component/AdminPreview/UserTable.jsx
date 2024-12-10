import React, { useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import EditRoleModal from './EditRoleModal';

const UserTable = ({data, onDelete, onUpdateRole}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectAdmin, setSelectAdmin] = useState(null);
    const openModal = (admin) => {
        setModalOpen(true);
        setSelectAdmin(admin);
    }
    
    const closeModal = () => {
        setModalOpen(false);
        setSelectAdmin(null);
    }

    const onEdit = (admin) => {
        openModal(admin)
    }

  return (
    <div>
        <table className='__prevTable'>
            <thead>
                <tr>
                    <th className='__tableHead'>Name</th>
                    <th className='__tableHead'>Email</th>
                    <th className='__tableHead'>Role</th>
                    <th className='__tableHead'>Actions</th>
                </tr>
            </thead>

            <tbody id='__tableBody'>
                {data.map((admin, index) => (
                <tr key={index}>
                    <td className='__tableData __tableName'>{admin.fullname}</td>
                    <td className='__tableData __tableEmail'>{admin.email}</td>
                    <td className='__tableData __tableRole'><p>{admin.role}</p></td>
                    <td className='__tableData __tableAction'>
                        <button className='__prevEditButton' onClick={() => onEdit(admin)}>Edit</button>
                        <button className="__prevDelButton" onClick={() => onDelete(admin._id)}><RiDeleteBin6Line/></button>
                    </td>
                </tr>
                ))}

            </tbody>
        </table>
       {modalOpen && (<EditRoleModal admin={selectAdmin} onUpdateRole={onUpdateRole} onClose={closeModal}/>)}
    </div>
  )
}

export default UserTable