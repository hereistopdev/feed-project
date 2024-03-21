import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { DataGridPro, GridCell } from "@mui/x-data-grid-pro";

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
      if (temp.value === undefined) result = [...result, ...temp];
      else result.push(temp);
    }
    return result;
  };

  const renderEditor = (props) => {
    console.log(props);
  };

  const renderer = (params) => {
    const temp = params.value;
    let pos = -1;
    if (temp && temp.length) pos = temp.indexOf("^");
    let cur = "";
    let pas = "";
    if (pos !== -1) {
      cur = temp.slice(0, pos);
      pas = temp.slice(pos + 1);
    }
    let flag = cur === pas;
    return (
      <Box>
        <Box style={{ color: "#000" }}>
          {cur === "" && pas === "" ? temp : cur}
        </Box>
        <Box style={{ color: flag ? "grey" : "red" }}>{pas}</Box>
      </Box>
    );
  };

  React.useEffect(() => {
    if (data.length && data[0]) {
      let first = {};
      let pos = 0;

      let flag = false;

      if (pastData.length) {
        flag = true;
      }

      let maxpos = 0;
      let maxlength = 0;
      // eslint-disable-next-line array-callback-return
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
            renderCell: renderer,
            editable: true,
            renderEditCell: renderEditor,
          };
          pos = i;
        } else {
          return {
            field: name,
            headerName: flag ? name + " ( old )" : name,
            renderCell: renderer,
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
            // console.log(pastTemp[i], "check");
            // if (!pastTemp[i]) console.log("nothing", pastTemp);
            if (pastTemp[i]) {
              obj[v.route.join(".")] = v.value + "^" + pastTemp[i].value;
              newObj[head + "." + v.route.join(".")] = {
                past: pastTemp[i].value,
                current: v.value,
              };
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, identifier, pastData]);

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <DataGridPro
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
