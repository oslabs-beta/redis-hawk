import React from "react";

const KeyListComponent = (props) => {
  return (
    <div className='keyListComponentContainer'>
      <li onClick={props.handleClick}>
        Name: {props.keyspace[0].name} Type: {props.keyspace[0].type}
      </li>
    </div>
  );
};

export default KeyListComponent;
