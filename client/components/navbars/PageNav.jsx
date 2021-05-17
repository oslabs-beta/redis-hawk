import React from "react";
import { Link } from "react-router-dom";

const PageNav = (props) => {
  return (
    <div id='pageNavContainer'>
      <Link to='/main' style={{ textDecoration: "none" }}>
        <div className='pageToggle' onClick={}>
            Keyspace
        </div>
      </Link>
      <Link to='/events' style={{ textDecoration: "none" }}>
        <div className='pageToggle' onClick={}>
            Events
        </div>
      </Link>
      <Link to='/graphs' style={{ textDecoration: "none" }}>
        <div className='pageToggle' onClick={}>
            Graphs
        </div>
      </Link>
    </div>
  );
};

export default PageNav;
