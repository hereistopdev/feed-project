import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function MuiTable({ data, identifier }) {
  const [cols, setCols] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const jsonparse = (event, route) => {
    if (typeof event !== "object")
      return {
        value: event,
        route: route,
      };
    let result = [];
    for (const key in event) {
      let temp = jsonparse(event[key], [...route, key]);
      if (temp.value == undefined) result = [...result, ...temp];
      else result.push(temp);
    }
    return result;
  };

  React.useEffect(() => {
    if (data.length && data[0]) {
      let first = {};
      let pos = 0;
      const temp = jsonparse(data[0], []).map((v, i) => {
        const name = v.route.join(".");
        if (name === identifier) {
          first = {
            field: name,
            headerName: name,
            width: 200,
          };
          pos = i;
        } else {
          return {
            field: name,
            headerName: name,
            width: 200,
          };
        }
      });
      temp.splice(pos, 1);
      temp.unshift(first);
      console.log(temp, identifier, first, pos);

      setCols(temp);

      const rowTemp = data.map((row, index) => {
        const obj = {};
        jsonparse(row, []).map((v) => {
          obj[v.route.join(".")] = v.value;
        });
        return { ...obj, id: index + 1 };
      });
      setRows(rowTemp);
    }
  }, [data, identifier]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
