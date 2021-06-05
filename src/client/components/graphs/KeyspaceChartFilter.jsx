import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function KeyspaceChartFilter(props) {
  const classes = useStyles();
  const [valueKey, setValueKey] = React.useState("");

  const handleChangeKey = (event) => {
    console.log("handling change");
    setValueKey(event.target.value);
  };
  // const handleChangeSubmit = (event) => {
  //   console.log("handling change");
  //   setValue(event.target.value);
  // };
  function selectChange(event) {
    setCategory(event.target.value);
  }
  //submitting the filter
  function handleSubmit(currInstance, currDatabase, queryParams) {
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
      URI = `/api/events/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.keynameFilter}`;
    if (queryParams.filterType)
      URI = `/api/events/${currInstance}/${currDatabase}/?timeInterval=7000&keynameFilter=${queryParams.filterType}`;
    console.log("URI in handleSubmit FETCH", URI);
    fetch(URI)
      .then((res) => res.json())
      .then((response) => {
        console.log("response in handleSubmit of Filter", response);
      });
    // }
  }
  // const clearFilter = () => {
  //      setValue('');

  // }

  function clearFilter(e) {
    e.preventDefault();
    props.clearInt();
    props.clearFilterIntID();
    props.resetState();
    props.getInitialData();
    props.getMoreData();
    setValueKey("");
    document.getElementById("my-text-field").value = "";
    // setCategory("");
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
  // console.log("props in KSCHARTFILTER", props);
  return (
    <div className='graph-search-filters'>
      <FormControl className={classes.formControl}>
        <TextField
          id='my-text-field'
          label='key name filter'
          color='secondary'
          onChange={handleChangeKey}
        />
      </FormControl>
      <div className='graph-filter-buttons-container'>
        <Button onClick={clearFilter} color='default'>
          Clear Filter
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            props.resetState();

            // e.preventDefault();
            console.log("props in onclick function", props);
            console.log("valueKey", valueKey);
            const params = {
              keynameFilter: valueKey,
            };
            // function timeout() {
            //   this.props.setIntFilter(
            //     this.props.currInstance,
            //     this.props.currDatabase,
            //     this.props.totalEvents,
            //     queryParams
            //   );
            // }

            props.getInitialFilteredData(
              props.currInstance,
              props.currDatabase,
              params
            );
            props.setIntFilter(
              props.currInstance,
              props.currDatabase,
              props.totalEvents,
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
