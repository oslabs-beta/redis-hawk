import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import FilterNav from "./navbars/FilterNav.jsx";
import PageNav from "./navbars/PageNav.jsx";
import InstanceNav from "./navbars/InstanceNav.jsx";
import DatabaseNav from "./navbars/DatabaseNav.jsx";
import KeyspaceComponent from "./keyspace/KeyspaceComponent.jsx";
import GraphComponent from "./graphs/GraphComponent.jsx";
import EventComponent from "./events/EventComponent.jsx";
import "./styles/styles.scss";
import { connect } from "react-redux";
import * as actions from "../action-creators/connections";
import * as keyspaceActions from "../action-creators/keyspaceConnections";
import * as eventActions from "../action-creators/eventsConnections";
import "../../node_modules/react-vis/dist/style.css";

///still need to check dispatchers here

//not using this right now
const mapStateToProps = (store) => {
  return {
    database: store.currDatabaseStore.currDatabase,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadKeyspace: () => dispatch(keyspaceActions.loadKeyspaceActionCreator()),
  loadEvents: (dbIndex) =>
    dispatch(actions.loadAllEventsActionsCreator(dbIndex)),
  updateInstanceInfo: () => dispatch(actions.updateInstanceInfoActionCreator()),
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadKeyspace();
    this.props.loadAllEvents();
    this.props.updateInstanceInfo();
  }

  render() {
    return (
      <div id='app'>
        <BrowserRouter>
          <FilterNav />
          <PageNav />
          <InstanceNav />
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
