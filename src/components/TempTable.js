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
  console.log(data);
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
                    console.log(value);
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
