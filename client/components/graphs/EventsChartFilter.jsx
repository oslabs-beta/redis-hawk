import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function EventsChartFilter(props) {
  const classes = useStyles();
  const [valueKey, setValueKey] = React.useState("");
  const [valueEvent, setValueEvent] = React.useState("");

  const handleChangeKey = (event) => {
    console.log("handling change");
    setValueKey(event.target.value);
  };
  const handleChangeEvent = (event) => {
    console.log("handling change");
    setValueEvent(event.target.value);
  };

  const handleChangeSubmit = (event) => {
    console.log("handling change");
    setValue(event.target.value);
  };
  function selectChange(event) {
    setCategory(event.target.value);
  }
  console.log("props in eventsChartFilter", props);
  //submitting the filter
  function handleSubmit(currInstance, currDatabase, queryParams) {
    props.clearInt();
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

  function clearFilter() {
    setValueKey("");
    setValueEvent("");
    // props.updateCurrDisplay({ filterType: "keyName", filterValue: "" });
    // props.updateCurrDisplay({ filterType: "keyType", filterValue: "" });
    // const queryOptions = {
    //   pageSize: props.pageSize,
    //   pageNum: props.pageNum,
    //   refreshScan: 0,
    //   keyNameFilter: props.currDisplay.keyNameFilter,
    //   keyTypeFilter: props.currDisplay.keyTypeFilter,
    // };
    // props.changeKeyspacePage(
    //   props.currInstance,
    //   props.currDatabase,
    //   queryOptions
    // );
  }

  const newArea = [];

  return (
    <div style={{ width: "75%", display: "flex", flexDirection: "column" }}>
      <FormControl className={classes.formControl}>
        <TextField
          id='standard-secondary'
          label='key name filter'
          color='secondary'
          onChange={handleChangeKey}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          id='standard-secondary'
          label='event-type filter'
          color='secondary'
          onChange={handleChangeEvent}
        />
      </FormControl>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItem: "center",
        }}>
        <Button onClick={clearFilter} color='default'>
          Clear
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            console.log("valueKey", valueKey);
            const params = { keynameFilter: valueKey, eventTypes: valueEvent };
            handleSubmit(props.currInstance, props.currDatabase, params);
          }}
          color='default'>
          Filter
        </Button>
        <Button color='default'>+</Button>
      </div>
      <div>{newArea}</div>
    </div>
  );
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
