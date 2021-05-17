import React, { Component } from 'react';
import { connect } from 'react-redux';



const KeyListComponent = (props) => {
    return (
      <div >
        <li onClick={props.handlClick}>Name: {props.keyspace.name} Type: {props.keyspace.type}</li>
      </div>
    );

}

export default KeyListComponent;
