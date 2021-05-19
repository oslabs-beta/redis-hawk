import React, { Component } from "react";
import GraphHolder from "./GraphHolder.jsx";

class GraphComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("In graphComponent");
    return <div id='graphsComponentContainer'>Graph Component!</div>;
  }
}

export default GraphComponent;
