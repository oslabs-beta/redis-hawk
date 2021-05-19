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

///still need to check dispatchers here

const mapStateToProps = (store) => {
  return {
    database: store.currDatabaseStore.currDatabase,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateKeyspace: (keyspace) =>
    dispatch(actions.updateKeyspaceActionCreator(keyspace)),
  updateEvents: (dbIndex) =>
    dispatch(actions.updateEventsActionCreator(dbIndex)),
});

class App extends Component {
  constructor(props) {
    super(props);
    const state = {
      whichPage: "",
    };
  }
  // changePage(e) {
  //const page = e.target.innerHtml
  //this.state.whichPage = page
  // }
  //declare a fuction that's going to update whichPage state
  componentDidMount() {
    this.props.updateKeyspace(1, this.props.database);
    this.props.updateEvents(1, this.props.database);
  }

  render() {
    return (
      <div id='app'>
        Hello world!
        <BrowserRouter>
          <FilterNav whichPage={this.props.whichPage} />
          <PageNav whichPage={this.props.whichPage} />
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
