import React, { Component } from 'react';

const DatabaseComponent = (props) => {
  return (
    <div id='singleDatabase'>
      {/* insert onClick  and on hover above*/}
      Database {props.databaseNum}
    </div>
  );
};

export default DatabaseComponent;
