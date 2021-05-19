import React from "react";

// add onclicks to the #filtertypes

const SearchFilter = (props) => {
  console.log("in search filter");
  console.log("props in searchFilter", props.keyspaces);
  if (props.keyspace) {
    return (
      <div className='searchFilterDiv'>
        <div className='filterContainer'>
          <div className='filter'>Filter By Keyname</div>
          <div className='filter'>Filter By KeyType</div>
        </div>
        <div>
          <input id='searchInput' />
          <button id='searchButton'>Search</button>
        </div>
      </div>
    );
  }
  if (props.events) {
    return (
      <div className='searchFilterDiv'>
        <div className='filterContainer'>
          <div className='filter'>Filter By Keyname</div>
          <div className='filter'>Filter By KeyType</div>
          <div className='filter'>Filter By Event</div>
        </div>
        <div>
          <input id='searchInput' />
          <button>Search</button>
        </div>
      </div>
    );
  }

  if (props.graphs) {
    return (
      <div className='searchFilterDiv'>
        <div className='filterContainer'>
          <div className='filter'>Filter By KeyType</div>
          <div className='filter'>Filter By KeyEvent</div>
          <div className='filter'>Filter By Time</div>
        </div>
        <div>
          <input id='searchInput' />
          <button>Search</button>
        </div>
        <div className='filter'>Filter By Keyname</div>
      </div>
    );
  } else return null;
};

export default SearchFilter;
