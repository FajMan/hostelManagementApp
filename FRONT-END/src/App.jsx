import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdminReg from './component/Register/AdminReg'
import StudentReg from './component/Register/StudentReg'
import Login from './component/Register/Login'
import Layout from './component/Layout/Layout'
import AdminPreview from './component/AdminPreview/AdminPreview'
import HomeDash from './component/DashBoard/HomeDash'
import StudentDashboard from './component/DashBoard/StudentDashboard'
import Room from './component/Dashboard/Room'
import RequireAuth from './context/RequireAuth'

function App() {
  const RenderRoute = () => (
    <Routes>
        <Route path='/' element={<AdminReg/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route element={<RequireAuth/>}>
        <Route path='/studentreg' element={
          <Layout>
            <StudentReg/>
          </Layout>
        }/>
        <Route path='/adminprev' element={
          <Layout>
            <AdminPreview/>
          </Layout>
        }/>
        <Route path='/home-dash' element={
          <Layout>
            <HomeDash/>
          </Layout>
        }/>
        <Route path='/student-dash' element={<StudentDashboard/>}/>
        <Route path='/room' element={<Room/>}/>
        </Route>
    </Routes>
  )

  return (
    <>
    {RenderRoute()}
    </>
  )
}

export default App