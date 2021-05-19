import React, { Component } from "react";

const KeyListComponent = (props) => {
  return (
    <div className='keyListComponentContainer'>
      <li onClick={props.handleClick}>
        Name: {props.keyspace.name} Type: {props.keyspace.type}
      </li>
    </div>
  );
};

export default KeyListComponent;
