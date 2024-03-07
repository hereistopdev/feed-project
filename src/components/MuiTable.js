import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function MuiTable({ data, identifier, pastData }) {
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

      let flag = false;
      if (
        pastData.length &&
        jsonparse(data, []).length === jsonparse(pastData, []).length
      ) {
        flag = true;
      }

      const temp = jsonparse(data[0], []).map((v, i) => {
        const name = v.route.join(".");
        if (name === identifier) {
          first = {
            field: name,
            headerName: flag ? name + " ( old )" : name,
            width: 200,
          };
          pos = i;
        } else {
          return {
            field: name,
            headerName: flag ? name + " ( old )" : name,
            width: 200,
          };
        }
      });
      temp.splice(pos, 1);
      temp.unshift(first);

      setCols(temp);

      const rowTemp = data.map((row, index) => {
        const obj = {};
        let pastTemp = [];
        if (flag) {
          pastTemp = jsonparse(pastData[index], []);
        }
        // eslint-disable-next-line array-callback-return
        jsonparse(row, []).map((v, i) => {
          flag
            ? (obj[v.route.join(".")] =
                v.value + " ( " + pastTemp[i].value + " ) ")
            : (obj[v.route.join(".")] = v.value);
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
