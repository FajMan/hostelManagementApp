import React, { useContext, useEffect, useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { BsCheck2All } from 'react-icons/bs';
import {ClipLoader} from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import PasswordInput from '../PasswordInput/PasswordInput';

const override = {
    display: 'block',
    margin: '100px auto',
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminReg = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        password2: ''
    });
    const [uCase, setUCase] = useState(false);
    const [num, setNum] = useState(false);
    const [sChar, setSChar] = useState(false);
    const [passwordLength, setPasswordLength] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formValidMessage, setFormValidMessage] = useState(false)
    const [loading, setLoading] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);

    const navigate = useNavigate();
    const {setUser} = useContext(UserContext)

    const timesIcon = <FaTimes color='red' size={20}/>
    const checkIcon = <BsCheck2All color='green' size={20}/>

    const switchIcon = (condition) => {
        return condition ? checkIcon : timesIcon
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}))
    }

    useEffect(() => {
        const password = formData.password;
        setUCase(/([a-z].[A-Z])|([A-Z].[a-z])/.test(password));
        setNum(/([0-9])/.test(password));
        setSChar(/([!,%,&,@,#,$,_,*])/.test(password));
        setPasswordLength(password.length > 5);
    }, [formData.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

       try {
        const {fullname, email, password, password2} = formData;

        if(!fullname || !email || !password || !password2) {
            setFormValidMessage('OOps, All fields are required');
            return;
        }
        
        if(password !== password2) {
            setFormValidMessage('Oops, Password does not match');
            return;
        }
        setIsSubmitting(true);
        setLoading(true);

        const response = await axios.post(`${BASE_URL}/admin/register`, formData, {withCredentials: true});

        if(response?.data) {
            setLoading(false)
            setUser(response.data)
            setIsSubmitting(false)
            setFormCompleted(true);
            toast.success('Registration Successful');
            navigate('/home-dash', {state: {user:response.data}})
        }
        
    } catch (error) {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message)
        const message = error?.response?.data?.message ? `${error.response.data.message}` : 'Internal server error'
        console.log(error)
        setFormValidMessage(message);
        setLoading(false);
       }
    }

    const handlePastePassword = (e) => {
        e.preventDefault();
        toast.error('Cannot paste into this field');
        return;
    }

  return (
   <>
    {loading ? (<ClipLoader color='1a80e5' cssOverride={override} loading={loading}/>) : (
         <div className='container form__ --100vh'>
         <div className="form-container">
         <p className='title'>Create an Account</p>
          <form className='form' onSubmit={handleSubmit}>
              <div className="--dir-column">
                  <label htmlFor="fullname">Full Name:</label>
                  <input type="text" className='input' name='fullname' placeholder='Enter Your Full Name' onChange={handleInputChange} value={formData.fullname} required />
              </div>
              
              <div className="--dir-column">
                  <label htmlFor="email">Email:</label>
                  <input type="email" className='input' name='email' placeholder='Enter Your Email' onChange={handleInputChange} value={formData.email} required />
              </div>
  
              <div className="--dir-column">
                  <label htmlFor="password">Password:</label>
                  <PasswordInput type="password" className='input' name='password' placeholder='Enter Your Password' onChange={handleInputChange} value={formData.password} required />
              </div>
              
              <div className="--dir-column">
                  <label htmlFor="password">Confirm Password:</label>
                  <PasswordInput type="password" className='input' name='password2' placeholder='Comfirm Password' onChange={handleInputChange} value={formData.password2} onPaste={handlePastePassword} required />
              </div>
  
              <div className="card">
                  <ul>
                      <li className="indicator"><span>{switchIcon(uCase)}&nbsp; Lowercase & Uppercase</span></li>
                      <li className="indicator"><span>{switchIcon(num)}&nbsp; Number (0 - 9)</span></li>
                      <li className="indicator"><span>{switchIcon(sChar)}&nbsp; Special Characters (!,%,&,@,#,$,_,*)</span></li>
                      <li className="indicator"><span>{switchIcon(passwordLength)}&nbsp; Minimum of 6 characters</span></li>
                  </ul>
              </div>
              <button disabled={isSubmitting} className='--btn'>{isSubmitting ? 'Signing you up...' : 'Create Account'}</button>
          </form>
          {formValidMessage && <p className='acount'>{formValidMessage}</p>}
          <p className='account'>Already have an account? <Link to='/login'>Login</Link> </p>
         </div>
      </div>
    )}
   </>
  )
}
         
export default AdminReg