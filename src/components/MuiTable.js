import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const rows1 = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function MuiTable({ data }) {
  const [cols, setCols] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    console.log(data);
    if (data.length) {
      const arr = [];
      const temp = Object.keys(data[0]).map((v) => {
        arr.push(v);
        return {
          field: v,
          headerName: v,
        };
      });
      //   temp.push({ field: "id", headerName: "ID" });
      setCols(temp);
      console.log(temp);

      const rowTemp = data.map((row, index) => {
        return { ...row, id: index + 1 };
        // console.log(arr, row);
        // const temp = {};
        // row.map((v)=>{
        //     temp[v]=
        // })
        // return {
        //   id: index + 1,
        // };
        // return (
        //   <TableRow key={index}>
        //     {Object.values(row).map((value, index) => {
        //       console.log(value);
        //       if (typeof value == "object") {
        //         return <TableCell key={index}>{"Array"}</TableCell>;
        //       } else return <TableCell key={index}>{value}</TableCell>;
        //     })}
        //   </TableRow>
        // );
      });
      console.log(temp, rowTemp);
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
