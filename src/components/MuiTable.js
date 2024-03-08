import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function MuiTable({ data, identifier, pastData, setNew }) {
  const [cols, setCols] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const jsonparse = (event, route) => {
    if (typeof event !== "object" || event == null)
      return {
        value: event == null ? "Null" : event,
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
    // console.log(data, pastData);
    if (data.length && data[0]) {
      let first = {};
      let pos = 0;

      let flag = false;
      if (pastData.length && data.length === pastData.length) {
        flag = true;
      }

      let maxpos = 0;
      let maxlength = 0;
      data.map((v, i) => {
        const tempL = jsonparse(v, []);
        if (tempL.length > maxlength) {
          maxlength = tempL.length;
          maxpos = tempL;
        }
      });
      // console.log(maxpos);

      // eslint-disable-next-line array-callback-return
      const temp = maxpos.map((v, i) => {
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

      const newArray = [];
      const rowTemp = data.map((row, index) => {
        const obj = {};
        let pastTemp = [];
        if (flag) {
          pastTemp = jsonparse(pastData[index], []);
          // console.log(pastTemp, jsonparse(row, []));
          // console.log(pastTemp.length, jsonparse(row, []).length);
        }
        // eslint-disable-next-line array-callback-return
        const head = row[identifier];
        // console.log(head);
        const newObj = {};
        jsonparse(row, []).map((v, i) => {
          if (flag && pastTemp.length <= jsonparse(row, []).length) {
            obj[v.route.join(".")] =
              v.value + " ( " + pastTemp[i].value + " ) ";
            newObj[head + "." + v.route.join(".")] = {
              past: pastTemp[i].value,
              current: v.value,
            };
            // v.value + " ( " + pastTemp[i].value + " ) ";
          } else {
            obj[v.route.join(".")] = v.value;
            newObj[head + "." + v.route.join(".")] = { current: v.value };
          }
        });
        newArray.push(newObj);
        return { ...obj, id: index + 1 };
      });
      setRows(rowTemp);
      setNew(newArray);
    }
  }, [data, identifier]);

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 100]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
