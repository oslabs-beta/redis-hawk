import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { connect } from "react-redux";

const mapStateToProps = (store) => {
  return {
    keyspace: store.keyspaceStore.keyspace,
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const KeyspacePagination = (props) => {
  const classes = useStyles();

  console.log("keyspace props", this.props.keyspace);
  return (
    <div className={classes.root}>
      <Pagination
        count={Math.ceil(this.props.keyspace.length / 100)}
        variant='outlined'
      />
    </div>
  );
};

export default connect(mapStateToProps, null)(KeyspacePagination);
