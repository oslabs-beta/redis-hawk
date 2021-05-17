import React, { Component } from 'react';

const KeyEventComponent = (props) => {
  return (
    <div>
      <li className='keyEventItem'>
        Name: {props.events.name} Event: {props.events.event} Time:
        {props.events.time}
      </li>
    </div>
  );
};

export default EventHolder;
