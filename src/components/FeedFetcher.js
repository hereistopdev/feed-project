import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import TrafficEventTable from "./TrafficEventTable";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  List,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import logo from "../logo.svg";
import TempTable from "./TempTable";
import MuiTable from "./MuiTable";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const FeedFetcher = () => {
  const [url, setUrl] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [feedData, setFeedData] = useState(null);
  const [history, setHistory] = useState(["Main"]);

  const [record, setRecord] = useState(null);
  const [list, setList] = useState(null);

  const [selected, setSelected] = React.useState(null);
  const [id, setID] = useState("");
  const [idlist, setIDlist] = useState("");

  const filetered = (obj) => {
    if (!obj) return [];
    // console.log("here", obj, typeof obj);

    if (typeof obj === "string" || typeof obj === "number") {
      // console.log(selected);
      setList([selected]);
      setIDlist([]);
      setRecord([obj]);
      // setList(selected);
      return;
    }
    if (obj.length === 0) return;
    const temp = Object.keys(obj);
    setRecord(obj);
    setList(temp);
    if (temp[0] === "0") setIDlist(Object.keys(obj[temp[0]]));
    // console.log(obj, temp);
  };

  const sendUrlToServer = async () => {
    if (url.length === 0) {
      toast.success("Hi");
      alert("You should enter URL");
      // console.log("error");
      return;
    }
    setIsLoading(true);
    try {
      // axios.disable("etag");
      const response = await axios.post(
        "https://optimum-koala-informed.ngrok-free.app/api/data",
        // "http://localhost:4000/api/data",
        {
          url: url,
        }
      );
      // console.log(response.data);
      // console.log(Object.keys(response.data));
      filetered(response.data);
      setFeedData(response.data);
      setID("");
      // console.log(filetered(response.data));
      setIsLoading(false);
    } catch (error) {
      alert("Invalid URL or Internal Server Error");
      // console.error("Error fetching feed:", error);
      setIsLoading(false);
      setFeedData();
    }
  };

  useEffect(() => {
    // console.log(selected);
    const temp = record ? record[selected] : null;
    // console.log(temp);
    if (temp) filetered(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Box bgcolor="#fff">
      <Box sx={{ flexGrow: 1 }} style={{ padding: "30px" }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <img src={logo} className="App-logo" alt="logo" />
          </Grid>
          <Grid item xs={9}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Enter URL"
                variant="outlined"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: "100%" }}
              />
              <Button variant="contained" onClick={sendUrlToServer}>
                Send URL to Server
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={3}>
          <Grid item xs={4}>
            <Item>
              <Box m={3}>
                <Breadcrumbs aria-label="breadcrumb">
                  {history.map((v) => {
                    return (
                      <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => {
                          const num = history.indexOf(v);
                          let temp = [];
                          if (num !== -1) {
                            temp = history.slice(0, num + 1);
                            setHistory(temp);
                          }
                          if (temp.length === 1) filetered(feedData);
                          if (temp.length) {
                            let val = feedData;
                            for (let i = 1; i < temp.length; i++) {
                              val = val[temp[i]];
                            }
                            filetered(val);
                          }
                        }}
                      >
                        {v}
                      </Link>
                    );
                  })}
                </Breadcrumbs>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "10px" }}
                  onClick={() => {
                    setID("");
                    setSelected("");
                    setHistory(["Main"]);
                    // console.log(feedData);
                    if (feedData == null) return;
                    filetered(feedData);
                  }}
                >
                  Reset
                </Button>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">RECORD</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selected}
                    label="Age"
                    onChange={(e) => {
                      setHistory([...history, e.target.value]);
                      setSelected(e.target.value);
                    }}
                  >
                    {list &&
                      list.map((v) => {
                        return <MenuItem value={v}>{v}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  size="small"
                  style={{ marginTop: "10px" }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Identifier
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    value={id}
                    onChange={(e) => setID(e.target.value)}
                  >
                    {idlist &&
                      idlist.map((v) => {
                        return <MenuItem value={v}>{v}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </Box>
              <h4>JSON Viewer</h4>
              {record && (
                <ReactJson
                  src={record}
                  theme="harmonic"
                  style={{ textAlign: "left" }}
                  collapsed
                />
              )}
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>
              <h4>Result Table</h4>
              {/* {feedData && <ProTable jons_data={feedData} />} */}
              {isloading ? (
                <p>Loading feed data...</p>
              ) : (
                <>
                  {/* <pre>
                    {id && record && <TrafficEventTable data={record} />}
                  </pre> */}
                  {id && record && <MuiTable data={record} identifier={id} />}
                  {/* {id && record && <TempTable data={record} />} */}
                </>
              )}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FeedFetcher;
