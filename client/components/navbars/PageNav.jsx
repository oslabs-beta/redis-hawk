import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import * as actions from "../../action-creators/connections";
import { connect } from "react-redux";

const mapStateToProps = (store) => {
  return {
    currPage: store.currPageStore.currPage,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updatePage: (page) => dispatch(actions.updatePageActionCreator(page)),
});

const PageNav = (props) => {
  return (
    <div id='pageNavContainer'>
      <Link to='/'>
        <div
          id='keyspaceLink'
          className='pageToggle'
          onClick={() => props.updatePage("keyspace")}>
          Keyspace
        </div>
      </Link>
      <Link to='/events'>
        <div
          id='eventsLink'
          className='pageToggle'
          onClick={() => props.updatePage("events")}>
          Events
        </div>
      </Link>
      <Link to='/graphs'>
        <div
          id='graphsLink'
          className='pageToggle'
          onClick={() => props.updatePage("graphs")}>
          Graphs
        </div>
      </Link>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PageNav);
