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
  updateKeyspace: (keyspace) =>
    dispatch(actions.updateKeyspaceActionCreator(keyspace)),
  updateEvents: (dbIndex) =>
    dispatch(actions.updateEventsActionCreator(dbIndex)),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichPage: "Keyspace Page",
    };
    this.changePage = this.changePage.bind(this);
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

  changePage(e) {
    if (e.target.id === "keyspaceLink") {
      this.state.whichPage = "Keyspace Page";
      console.log("switched to keyspace page");
      return;
    }
    if (e.target.id === "eventsLink") {
      this.state.whichPage = "Events Page";
      console.log("switched to events page");
      return;
    }
    if (e.target.id === "graphsLink") {
      this.state.whichPage = "Graph Page";
      console.log("switched to graph page");
      return;
    }
  }
  render() {
    return (
      <div id='app'>
        Hello world!
        <BrowserRouter>
          <FilterNav whichPage={this.state.whichPage} />
          <PageNav
            changePage={this.changePage}
            whichPage={this.state.whichPage}
          />
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
