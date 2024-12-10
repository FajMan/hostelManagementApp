import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';

const HeaderSideNav = ({setNavToggle, items}) => {
    const location = useLocation();

  return (
    <aside>
        <div className="--flex-end --sidebar-close">
            <IoCloseOutline className='sidebar-toggle-icon' onClick={() => setNavToggle(false)}/>
        </div>

        <div className="left">
            {items.map(({title, url}, index) => (
               
                <div className='--flex-center dir-column' key={index}>
                    <Link to={url} className={url === location.pathname ? 'active-link' : ''}>{title}</Link>
                </div>
            ))}

            <div className='--flex-start --flex-center'>
                <button className='btn-primary'>New</button>
            </div>
        </div>
    </aside>
  )
}

export default HeaderSideNav