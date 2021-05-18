import React from 'react';
import { Link } from 'react-router-dom';

const PageNav = (props) => {
  return (
    <div id='pageNavContainer'>
      <Link to='/main' style={{ textDecoration: 'none' }}>
        {/* insert onClick */}
        <div className='pageToggle'>Keyspace</div>
      </Link>
      <Link to='/events' style={{ textDecoration: 'none' }}>
        {/* insert onClick */}
        <div className='pageToggle'>Events</div>
      </Link>
      <Link to='/graphs' style={{ textDecoration: 'none' }}>
        {/* insert onClick */}
        <div className='pageToggle'>Graphs</div>
      </Link>
    </div>
  );
};

export default PageNav;
