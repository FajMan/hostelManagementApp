import React from 'react';
import './Dashboard.css';
import { NavLink, useLocation } from 'react-router-dom';

const dashboardLinks = [
    {title: 'Dashboard', route: '/home-dash'},
    {title: 'Student', route: '/student-dash'},
    {title: 'Room', route: '/room'},
    {title: 'Report', route: '#'}
]

const SideBar = () => {
    const location = useLocation()

  return (
    <aside className='--flex-start'>
        <div className="left">
            {dashboardLinks.map(({title, route}, index) => (
                <div key={index} className="--flex-center --dir-column">
                    <NavLink to={route} className={route === location.pathname ? 'active-link' : ''}>{title}</NavLink>
                </div>
            ))}
        </div>
    </aside>
  )
}

export default SideBar