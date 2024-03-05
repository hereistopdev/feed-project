import { TextField } from "@mui/material";
import React from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrafficEventTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
      },
      {
        Header: "Organization",
        accessor: "Organization",
      },
      {
        Header: "Roadway Name",
        accessor: "RoadwayName",
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
        Cell: ({ value }) => new Date(value * 1000).toLocaleString(),
      },
      {
        Header: "End Date",
        accessor: "PlannedEndDate",
        Cell: ({ value }) => new Date(value * 1000).toLocaleString(),
      },
      {
        Header: "Details",
        accessor: "Details",
      },
      {
        Header: "Severity",
        accessor: "Severity",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button onClick={() => handleActionClick(row.original)}>
            Action
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter } = state;

  const handleActionClick = (rowData) => {
    // Example function, replace with your logic
    toast.success(`Action clicked for ID: ${rowData.ID}`);
  };

  return (
    <div style={{ width: "100%", overflow: "auto" }}>
      <TextField
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        fullWidth
        style={{ margin: "20px" }}
      />
      <table {...getTableProps()} style={{ width: "100%" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TrafficEventTable;
