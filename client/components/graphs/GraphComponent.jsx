import React, { Component } from "react";
import GraphHolder from "./GraphHolder.jsx";

class GraphComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='graphsComponentContainer'>
        <GraphHolder />
      </div>
    );
  }
}

export default GraphComponent;
