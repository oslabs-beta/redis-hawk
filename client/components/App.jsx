import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import FilterNav from "./navbars/FilterNav.jsx";
import PageNav from "./navbars/PageNav.jsx";
import InstanceNav from "./navbars/InstanceNav.jsx";
import KeyspaceComponent from "./keyspace/KeyspaceComponent.jsx";
import GraphComponent from "./graphs/GraphComponent.jsx";
import EventComponent from "./events/EventComponent.jsx";
import { connect } from "react-redux";
import * as actions from "../action-creators/connections";
import * as keyspaceActions from "../action-creators/keyspaceConnections";
import * as eventActions from "../action-creators/eventsConnections";
import "../../node_modules/react-vis/dist/style.css";
import Logo from '../redishawk-logo.svg';

import './styles/app.global.scss';

///still need to check dispatchers here

//not using this right now
const mapStateToProps = (store) => {
  return {
    database: store.currDatabaseStore.currDatabase,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadKeyspace: () => dispatch(keyspaceActions.loadKeyspaceActionCreator()),
  loadAllEvents: () => dispatch(eventActions.loadAllEventsActionCreator()),
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

      <div id='global'>
          <div id='logo-container'>
            <Logo/>
          </div>
        <div id='app'>
          <BrowserRouter>
            <InstanceNav />
            <div id='tabs-container'>
              <PageNav />
              <FilterNav />
              {/* create a react router to switch between the main area of divs */}
              <Switch>
                <Route exact path='/' render={() => <KeyspaceComponent />} />
                <Route path='/events' render={() => <EventComponent />} />
                <Route path='/graphs' render={() => <GraphComponent />} />
            </Switch>
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
