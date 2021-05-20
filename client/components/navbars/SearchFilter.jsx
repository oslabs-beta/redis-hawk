import React from 'react';
import { connect } from 'react-redux';
import { Component } from 'react';
import * as actions from '../../action-creators/connections.js';

const mapStateToProps = (store) => {
  return {
    currPage: store.currPageStore.currPage,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrDisplay: (filter, category) =>
    dispatch(actions.updateCurrDisplayActionCreator(filter, category)),
});

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      category: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleClick(event) {
    // console.log('handle click event target', event.target.value);
    this.setState({ category: event.target.id });
  }

  handleSubmit(event) {
    event.preventDefault();
    const filter = this.state.value;
    this.setState({ value: '' });
    console.log('newState', this.state.value);
    // console.log('in onSubmit', e);
    console.log(filter, this.state.category);
    this.props.updateCurrDisplay(this.state.value, this.state.category);
  }

  render() {
    if (this.props.currPage === 'events') {
      return (
        <div className='searchFilterDiv'>
          <form onSubmit={this.handleSubmit}>
            <label>
              Search:
              <input
                id='uniqueInput'
                type='text'
                value={this.state.value}
                onChange={this.handleChange}
              />
              <input
                className='filter'
                id='name'
                type='submit'
                value='filter by name'
                onClick={this.handleClick}
              />
              <input
                className='filter'
                id='event'
                type='submit'
                value='filter by event'
                onClick={this.handleClick}
              />
              {/* <input
                className='filter'
                id='type'
                type='submit'
                value='filter by type'
                onClick={this.handleClick}
              /> */}
            </label>
          </form>
        </div>
      );
    } else if (this.props.currPage === 'graphs') {
      return (
        <div className='searchFilterDiv'>
          <form onSubmit={this.handleSubmit}>
            <label>
              Search:
              <input
                type='text'
                value={this.state.value}
                onChange={this.handleChange}
              />
              <input
                className='filter'
                id='name'
                type='submit'
                value='filter by name'
                onClick={this.handleClick}
              />
              <input
                className='filter'
                id='event'
                type='submit'
                value='filter by event'
                onClick={this.handleClick}
              />
              {/* <input
                className='filter'
                id='type'
                type='submit'
                value='filter by type'
                onClick={this.handleClick}
              /> */}
            </label>
          </form>
        </div>
      );
    } else {
      return (
        <div className='searchFilterDiv'>
          <form onSubmit={this.handleSubmit}>
            <label>
              Search:
              <input
                type='text'
                value={this.state.value}
                onChange={this.handleChange}
              />
              <input
                className='filter'
                id='name'
                type='submit'
                value='filter by name'
                onClick={this.handleClick}
              />
              <input
                className='filter'
                id='type'
                type='submit'
                value='filter by type'
                onClick={this.handleClick}
              />
            </label>
          </form>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);
