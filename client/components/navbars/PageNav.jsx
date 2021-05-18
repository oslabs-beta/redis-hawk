import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const PageNav = (props) => {
  return (
    <div id='pageNavContainer'>
      <Link to='/main'>
        {/* insert onClick */}
        <div className='pageToggle'>Keyspace</div>
      </Link>
      <Link to='/events'>
        {/* insert onClick */}
        <div className='pageToggle'>Events</div>
      </Link>
      <Link to='/graphs'>
        {/* insert onClick */}
        <div className='pageToggle'>Graphs</div>
      </Link>
    </div>
  );
};

export default PageNav;
