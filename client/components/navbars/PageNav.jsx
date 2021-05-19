import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

const PageNav = (props) => {
  return (
    <div id='pageNavContainer'>
      <Link to='/'>
        <div
          id='keyspaceLink'
          className='pageToggle'
          onClick={props.changePage}>
          Keyspace
        </div>
      </Link>
      <Link to='/events'>
        <div id='eventsLink' className='pageToggle' onClick={props.changePage}>
          Events
        </div>
      </Link>
      <Link to='/graphs'>
        <div id='graphsLink' className='pageToggle' onClick={props.changePage}>
          Graphs
        </div>
      </Link>
    </div>
  );
};

export default PageNav;
