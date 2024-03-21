import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "url",
    headerName: "Url",
    width: 600,
  },
  {
    field: "path",
    headerName: "Path",
    width: 300,
  },
  {
    field: "identifier",
    headerName: "Identifier",
    width: 140,
  },
  {
    field: "time",
    headerName: "Time",
    width: 300,
  },
];

export default function LogTable({ data, setPastData, setPastHistory }) {
  const [rows, setRows] = React.useState([]);

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  React.useEffect(() => {
    if (data.length) {
      const temp = data.map((v, i) => {
        const { url, createdAt, history, identifier } = v;
        return {
          id: i + 1,
          url: url,
          time: createdAt,
          identifier: identifier,
          path: JSON.parse(history).join("/"),
        };
      });
      setRows(temp);
    }
  }, [data]);

  React.useEffect(() => {
    const temp = data[rowSelectionModel[0] - 1];
    if (temp) {
      setPastData(JSON.parse(temp.feed));
      setPastHistory(JSON.parse(temp.history));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionModel]);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 50]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          const temp = [...newRowSelectionModel];
          if (rowSelectionModel.length > 0) {
            temp.shift();
          }
          setRowSelectionModel(temp);
        }}
        rowSelectionModel={rowSelectionModel}
        // disableRowSelectionOnClick
      />
    </Box>
  );
}
