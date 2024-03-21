import * as React from "react";
import Box from "@mui/material/Box";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import { DataGridPro, GridCell } from "@mui/x-data-grid-pro";
import { useDemoData } from "@mui/x-data-grid-generator";

const TraceUpdates = React.forwardRef((props, ref) => {
  const { Component, ...other } = props;
  const rootRef = React.useRef();
  const handleRef = useForkRef(rootRef, ref);

  React.useEffect(() => {
    const root = rootRef.current;
    root.classList.add("updating");
    root.classList.add("updated");

    const timer = setTimeout(() => {
      root.classList.remove("updating");
    }, 360);

    return () => {
      clearTimeout(timer);
    };
  });

  return <Component ref={handleRef} {...other} />;
});

const CellWithTracer = React.forwardRef((props, ref) => {
  return <TraceUpdates ref={ref} Component={GridCell} {...props} />;
});

const slots = {
  cell: CellWithTracer,
};

export default function GridVisualization() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 100,
    editable: true,
    maxColumns: 15,
  });

  return (
    <Box
      sx={{
        height: 400,
      }}
    >
      <DataGridPro {...data} rowHeight={38} slots={slots} />
    </Box>
  );
}
