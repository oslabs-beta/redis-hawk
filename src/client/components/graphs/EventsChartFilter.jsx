import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// const useStyles = makeStyles((theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
// }));
// classes: {formControl}
class EventsChartFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueKey: "",
      valueEvent: "",
      // classes: {
      //   formControl: {
      //     marin: this.spacing(1),
      //     minwidth: 120,
      //   },
      // },
    };
    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  //  [valueKey, setValueKey] = React.useState("");
  //  [valueEvent, setValueEvent] = React.useState("");

  handleChangeKey(event) {
    console.log("handling change");
    this.setState({
      valueKey: event.target.value,
    });
  }
  handleChangeEvent(event) {
    console.log("handling change");
    this.setState({
      valueEvent: event.target.value,
    });
  }

  // handleChangeSubmit = (event) => {
  //   console.log("handling change");
  //   setValue(event.target.value);
  // };
  // selectChange(event) {
  //   setCategory(event.target.value);
  // }
  //submitting the filter
  handleSubmit(currInstance, currDatabase, queryParams) {
    this.props.clearInt();
    console.log(
      "queryParams.keynameFilter in handlesubmit",
      queryParams.keynameFilter
    );
    console.log(
      "type of queryparmskeynamefilter",
      typeof queryParams.keynameFilter
    );
    let URI;
    // if (queryParams) {
    if (queryParams.keynameFilter)
      URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.keynameFilter}`;
    if (queryParams.filterType)
      URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.filterType}`;
    console.log("URI in handleSubmit FETCH", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in handleSubmit of Filter", response);
        const allEvents = response;
        const dataCopy = Object.assign({}, this.state.data);
        dataCopy.labels = [];
        console.log();
        // const labels = [];
        // const datasets = [];
        for (let i = response.eventTotals.length - 1; i >= 0; i--) {
          const time = new Date(response.eventTotals[i].end_time)
            .toString("MMddd")
            .slice(16, 24);

          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(response.eventTotals[i].eventCount);
        }
        this.setState({
          ...this.state,
          totalEvents: allEvents.eventTotal,
          data: dataCopy,
        });
      });
    // }
    function getMoreFilteredData(
      currInstance,
      currDatabase,
      totalEvents,
      queryParams
    ) {
      let URI;
      // if (queryParams) {
      if (queryParams.keynameFilter)
        URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?totalEvents=${this.props.totalEvents}&keynameFilter=${queryParams.keynameFilter}`;
      if (queryParams.filterType)
        URI = `/api/v2/events/totals/${currInstance}/${currDatabase}/?totalEvents=${this.props.totalEvents}&keynameFilter=${queryParams.filterType}`;
      console.log("URI in handleSubmit FETCH", URI);
      fetch(URI)
        .then((res) => res.json())
        .then((response) => {
          const eventTotal = response.eventTotal;
          const eventCount = response.eventTotals[0].eventCount;
          const dataCopy = Object.assign({}, this.state.data);
          const time = new Date(response.eventTotals[0].end_time)
            .toString("MMddd")
            .slice(16, 24);
          dataCopy.labels.push(time);
          dataCopy.datasets[0].data.push(eventCount);

          this.setState({
            ...this.state,
            totalEvents: eventTotal,
            data: dataCopy,
          });
        });
    }
    setTimeout(getMoreFilteredData, 7000);
  }

  // const clearFilter = () => {
  //      setValue('');
  //   setCategory('');
  // }

  clearFilter(e) {
    e.preventDefault();
    document.getElementById("standard-secondary").value = "";
    document.getElementById("event-type-filter").value = "";
    this.props.clearInt();
    this.props.clearFilterIntID();
    this.props.resetState();
    this.props.getInitialData();
    this.props.getMoreData();
    this.setState({
      valueKey: "",
      valueEvent: "",
    });
  }
  render() {
    // console.log("props in EventChartFilter Render", this.props);
    const newArea = [];

    return (
      <div className='graph-search-filters'>
        <FormControl>
          <TextField
            id='standard-secondary'
            label='key name filter'
            color='secondary'
            onChange={this.handleChangeKey}
          />
        </FormControl>
        <FormControl>
          <TextField
            id='event-type-filter'
            label='event type filter'
            color='secondary'
            onChange={this.handleChangeEvent}
          />
        </FormControl>
        <div className='graph-filter-buttons-container'>
          <Button onClick={this.clearFilter} color='default'>
            Clear Filter
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              this.props.resetState();
              // this.props.clearInt();
              // this.props.clearFilterIntID();
              // e.preventDefault();
              console.log("this.props in onclick function", this.props);
              console.log("valueKey", this.state.valueKey);
              const params = {
                keynameFilter: this.state.valueKey,
                eventTypes: this.state.valueEvent,
              };
              // function timeout() {
              //   this.props.setIntFilter(
              //     this.props.currInstance,
              //     this.props.currDatabase,
              //     this.props.totalEvents,
              //     queryParams
              //   );
              // }

              this.props.getInitialFilteredData(
                this.props.currInstance,
                this.props.currDatabase,
                params
              );
              this.props.setIntFilter(
                this.props.currInstance,
                this.props.currDatabase,
                this.props.totalEvents,
                params
              );
            }}
            color='default'>
            Apply Filter
          </Button>
          {/* <Button color='default'>+</Button> */}
        </div>
        <div>{newArea}</div>
      </div>
    );
  }
}

// <button
//             className='filter-button'
//             id='clearFilterButton'
//             onClick={(e) => {
//               e.preventDefault();
//               this.props.updateCurrDisplay('', '');
//             }}
//           >
//             Clear Filter
//           </button>
export default EventsChartFilter;
