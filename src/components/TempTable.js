import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const TempTable = ({ data }) => {
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

  console.log(data, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {data.length &&
              Object.keys(data[0]).map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length &&
            data.map((row, index) => {
              return (
                <TableRow key={index}>
                  {Object.values(row).map((value, index) => {
                    // console.log(value);
                    if (typeof value == "object") {
                      return <TableCell key={index}>{"Array"}</TableCell>;
                    } else return <TableCell key={index}>{value}</TableCell>;
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TempTable;
