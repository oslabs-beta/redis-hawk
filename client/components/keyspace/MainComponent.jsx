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
    const value = e.target.props.keyspace.value;
    this.state.displayValue = value;
  }

  render() {
    // console.log("hey", this.state.displayValue);
    //functionality to render the proper number of KeyListComponents -- obj.props.keyspace???
    if (this.props.keyspace) {
      console.log("keyspace props in main component", this.props.keyspace);
      // const listOfKeys = this.props.keyspace.map((arr, ind) => {
      //   return (
      //     <KeyListComponent
      //       keyspace={arr[ind][0]}
      //       handleClick={this.renderValue}
      //     />
      //   );
      // });

      const myKeys = [];
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
        <div id='keyListHolder'>
          <ul id='keyList'>{console.log("mykeys", this.state.myKeys)}</ul>
        </div>
        <div id='valueDisplay'>
          <h3>{this.state.displayValue}</h3>
        </div>
      </div>
    );
  }
}

export default MainComponent;
