import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import * as actions from "../../action-creators/connections";
import { connect } from "react-redux";

const mapStateToProps = (store) => {
  return {
    currPage: store.currPageStore.currPage,
    currInstance: store.currInstanceStore.currInstance,
    currDatabase: store.currDatabaseStore.currDatabase,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updatePage: (page) => dispatch(actions.updatePageActionCreator(page)),
});

const PageNav = (props) => {
  return (
    <div id='pageNavContainer'>
      <Link to='/' style={{ textDecoration: "none" }}>
        <div
          id='keyspaceLink'
          className={
            props.currPage === "keyspace"
              ? "selected-page-toggle"
              : "page-toggle"
          }
          onClick={() => props.updatePage("keyspace")}>
          Keyspace
        </div>
      </Link>
      <Link to='/events' style={{ textDecoration: "none" }}>
        <div
          id='eventsLink'
          className={
            props.currPage === "events" ? "selected-page-toggle" : "page-toggle"
          }
          onClick={() => {
            props.updatePage("events");
          }}>
          Events
        </div>
      </Link>
      <Link to='/graphs' style={{ textDecoration: "none" }}>
        <div
          id='graphsLink'
          className={
            props.currPage === "graphs" ? "selected-page-toggle" : "page-toggle"
          }
          onClick={() => {
            props.updatePage("graphs");
          }}>
          Graphs
        </div>
      </Link>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PageNav);
