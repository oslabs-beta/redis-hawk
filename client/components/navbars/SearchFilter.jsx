import React, { Component } from 'react';

const SearchFilter = (props) => {

if (props.keyspace){
  return (
    <div>
      <div className="searchFilterContainer">
        <input id="searchInput" />
        <button id='searchButton' onClick={}>Search</button>
      </div>
        <div className="filterType" onClick={}>Filter By Keyname</div>
        <div className="filterType" onClick={}>Filter By KeyType</div>
    </div>
  )
}
if (props.events){
  return (
    <div>
      <div className="searchFilterContainer">    
        <input id="searchInput" />
        <button>Search</button>   
    </div>
      <div className="filterType" onClick={}>Filter By Keyname</div>
      <div className="filterType" onClick={}>Filter By KeyType</div>
      <div className="filterType" onClick={}>Filter By Event</div>
    </div>
  )
}

if (props.graphs){
  return (
    <div>
      <div className="searchFilterContainer">    
        <input id="searchInput" />
        <button>Search</button>   
      </div>
        <div className="filterType" onClick={}>Filter By Keyname</div>
        <div className="filterType" onClick={}>Filter By KeyType</div>
        <div className="filterType" onClick={}>Filter By KeyEvent</div>
        <div className="filterType" onClick={}>Filter By Time</div>
    </div>
    )
  }
}

export default SearchFilter;