import React, { Component } from "react";
import KeyListComponent from "./KeyListComponent.jsx";


class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: "I am data!",
    };
    this.renderValue = this.renderValue.bind.this;
  }

  renderValue(e) {
    e.preventDefault();
    const value = e.target.props.keyspace[0].value;
    this.state.displayValue = value;
  }

  render() {
    console.log('In mainComponent')
    const myKeys = [];
    if (this.props.keyspace) {
      for (let i = 0; i < this.props.keyspace.length; i += 1) {
        myKeys.push(
          <KeyListComponent
            keyspace={this.props.keyspace[i]}
            handleClick={this.renderValue}
          />
        );
      }
      console.log("myKeys", myKeys);
    }
    return (
      <div id='mainComponentContainer'>
        {/* //this would be our filterNav */}
        <div id='keyListHolder'>
          <ul id='keyList'>{myKeys}</ul>
        </div>
        <div id='valueDisplay'>
          <h3>{this.state.displayValue}</h3>
        </div>
      </div>
    );
  }
}

export default MainComponent;
