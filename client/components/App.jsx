import React, { Component } from 'react';
//react router
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import filterNav
import FilterNav from './navbars/FilterNav.jsx';
//import PageNav
import PageNav from './navbars/PageNav.jsx';
//import DatabaseNav
import DatabaseNav from './navbars/DatabaseNav.jsx';
//import KeyspaceComponent
import KeyspaceComponent from './keyspace/KeyspaceComponent.jsx';
//import GraphComponent
import GraphComponent from './graphs/GraphComponent.jsx';
//import EventComponent
import EventComponent from './events/EventComponent.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    state = {
      whichPage: ''
    }
  }
  // changePage(e) {
    //const page = e.target.innerHtml
    //this.state.whichPage = page
  // }
  //declare a fuction that's going to update whichPage state

  render() {
    return (
      <div>
        Hello world!
        <FilterNav whichPage={this.props.whichPage}/>
        <PageNav whichPage={this.props.whichPage}/>
        <DatabaseNav />
        {/* create a react router to switch between the main area of divs */}
        <BrowserRouter>
          <Switch>
            <Route path='/main' render={() => <KeyspaceComponent />} />
            <Route path='/events' render={() => <EventComponent />} />
            <Route path='/graphs' render={() => <GraphComponent />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
