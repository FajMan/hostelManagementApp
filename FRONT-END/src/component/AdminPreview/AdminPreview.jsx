import React, { useEffect, useState } from 'react'
import './AdminPreview.css'
import UserTable from './UserTable';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { toast } from 'react-toastify';
import {ClipLoader} from 'react-spinners';
import { Link } from 'react-router-dom';

const override = {
    display: 'block',
    margin: '100px auto',
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminPreview = () => {
    const [search, setSearch] = useState('');
    const [admins, setAdmins] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin`, {withCredentials: true})
                const data = response.data
                setFilteredData(data)
                setAdmins(data)
                console.log(data)
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAdmin()
    }, [])
    
    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearch(term)
        const filtered = admins.filter((admin) => 
            admin?.fullname?.toLowerCase().includes(term) || admin?.email?.toLowerCase().includes(term) || admin?.role?.toLowerCase().includes(term) 
        )
        setFilteredData(filtered)
    }

    const handleDelete = async (adminId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/admin/${adminId}`, {withCredentials: true})
            const updatedFilterData = filteredData.filter((admin) => admin._id !== adminId);
            setFilteredData(updatedFilterData);
            toast.success(response?.data?.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    const handleUpdateRole = async (adminId, newRole) => {
        try {
            const response = await axios.patch(`${BASE_URL}/admin/${adminId}`, {role: newRole}, {withCredentials: true})
            const updatedFilteredRole = filteredData.map((admin) => 
                admin._id === adminId ? {...admin, role: newRole} : admin
            )
            setFilteredData(updatedFilteredRole);
            toast.success(response?.data?.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    if(isLoading) return <ClipLoader color='1a80e5' cssOverride={override} isLoading={isLoading}/>

  return (
    <>
        <div className='__prevCon'>
            <h2 className="__prevHeader">Admins</h2>
            <div className="__prevSearchCon">
                <CiSearch className="__prevSearchIcon"/>
                <input type="text" className='__prevSearch' placeholder='Search by name, email or role' value={search} onChange={handleSearchChange}/>
            </div>
            <div className='__prevList'><UserTable data={filteredData} onDelete={handleDelete} onUpdateRole={handleUpdateRole}/></div>
            <div className='__inviteBtnCon'>
                <Link to="/"><button className="__inviteBtn">Invite Admin</button></Link>  
            </div>
        </div>
    </>
  )
}

export default AdminPreview;