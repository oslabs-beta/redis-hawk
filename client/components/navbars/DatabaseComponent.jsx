import React, { Component } from 'react';

const DatabaseComponent = (props) => {
  return (
    <div
      className='singleDatabase'
      onClick={() => {
        props.handleClick(props.databaseNum);
      }}
    >
      {`- Database ${props.databaseNum}`}
    </div>
  );
};

export default DatabaseComponent;
