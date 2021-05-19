import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { connect } from "react-redux";

const mapStateToProps = (store) => {
  return {
    keyspace: store.keyspaceStore.keyspace,
  };
};

const KeyspacePagination = (props) => {
  console.log("keyspace props", this.props.keyspace);
  return <div> hello </div>;
};

export default connect(mapStateToProps, null)(KeyspacePagination);
