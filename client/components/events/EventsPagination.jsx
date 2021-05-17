import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

const mapStateToProps = (store) => {
  return {
    events: store.events,
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const PaginationComponent = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Pagination
        count={Math.ceil(this.props.events.length / 100)}
        variant='outlined'
      />
    </div>
  );
};

export default EventPagination;
