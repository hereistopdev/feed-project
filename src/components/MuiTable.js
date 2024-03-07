import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function MuiTable({ data }) {
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
    console.log(data[0]);
    if (data.length && data[0]) {
      const temp = jsonparse(data[0], []).map((v) => {
        const name = v.route.join(".");
        return {
          field: name,
          headerName: name,
          width: 200,
        };
      });
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
  }, [data]);

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
      />
    </div>
  );
}
