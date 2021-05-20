import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import FilterNav from "./navbars/FilterNav.jsx";
import PageNav from "./navbars/PageNav.jsx";
import DatabaseNav from "./navbars/DatabaseNav.jsx";
import KeyspaceComponent from "./keyspace/KeyspaceComponent.jsx";
import GraphComponent from "./graphs/GraphComponent.jsx";
import EventComponent from "./events/EventComponent.jsx";
import "./styles/styles.css";
import { connect } from "react-redux";
import * as actions from "../action-creators/connections";
import "../../node_modules/react-vis/dist/style.css";

///still need to check dispatchers here

const mapStateToProps = (store) => {
  return {
    database: store.currDatabaseStore.currDatabase,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateKeyspace: (dbIndex) =>
    dispatch(actions.updateKeyspaceActionCreator(dbIndex)),
  updateEvents: (dbIndex) =>
    dispatch(actions.updateEventsActionCreator(dbIndex)),
  updateDBInfo: () => dispatch(actions.updateDBInfoActionCreator()),
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.updateKeyspace();
    this.props.updateEvents();
    this.props.updateDBInfo();
  }

  render() {
    return (
      <div id='app'>
        Hello world!
        <BrowserRouter>
          <FilterNav />
          <PageNav />
          <DatabaseNav />
          {/* create a react router to switch between the main area of divs */}
          <Switch>
            <Route exact path='/' render={() => <KeyspaceComponent />} />
            <Route path='/events' render={() => <EventComponent />} />
            <Route path='/graphs' render={() => <GraphComponent />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
