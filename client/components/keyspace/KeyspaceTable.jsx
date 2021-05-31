// import * as React from 'react';
// import { DataGrid } from '@material-ui/data-grid';
// import { useDemoData } from '@material-ui/x-grid-data-generator';

// function loadServerRows(page, data) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(data.rows.slice(page * 5, (page + 1) * 5));
//     }, Math.random() * 500 + 100); // simulate network latency
//   });
// }

// function KeyspaceTable() {
//   const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 100,
//     maxColumns: 6,
//   });

//   const [page, setPage] = React.useState(0);
//   const [rows, setRows] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);

//   const handlePageChange = (params) => {
//     setPage(params.page);
//   };

//   React.useEffect(() => {
//     let active = true;

//     (async () => {
//       setLoading(true);
//       const newRows = await loadServerRows(page, data);

//       if (!active) {
//         return;
//       }

//       setRows(newRows);
//       setLoading(false);
//     })();

//     return () => {
//       active = false;
//     };
//   }, [page, data]);

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={data.columns}
//         pagination
//         pageSize={5}
//         rowCount={100}
//         paginationMode='server'
//         onPageChange={handlePageChange}
//         loading={loading}
//       />
//     </div>
//   );
// }

import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useDemoData } from "@material-ui/x-grid-data-generator";

function KeyspaceTable() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div
      style={{ height: 400, width: "100%", backgroundColor: "rgb(233, 0, 0)" }}>
      <DataGrid autoPageSize pagination {...data} />
    </div>
  );
}

export default KeyspaceTable;
