import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
// import TrafficEventTable from "./TrafficEventTable";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Breadcrumbs,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Link,
  // List,
  MenuItem,
  Select,
  TextField,
  // Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import logo from "../logo.svg";
// import TempTable from "./TempTable";
import MuiTable from "./MuiTable";
import {
  GridCheckCircleIcon,
  // GridCheckIcon,
  GridCloseIcon,
} from "@mui/x-data-grid";
import LogTable from "./logTable";
import "react-toastify/dist/ReactToastify.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const FeedFetcher = () => {
  const [pastData, setPastData] = useState([]);
  const [pastHistroy, setPastHistory] = useState([]);
  const [newdata, setNew] = useState([]);
  const [alldata, setAlldata] = useState([]);

  const [url, setUrl] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isloading1, setIsLoading1] = useState(false);
  const [saveFlag, setSaveFlag] = useState(false);
  const [feedData, setFeedData] = useState(null);
  const [history, setHistory] = useState(["Main"]);

  const [record, setRecord] = useState(null);
  const [list, setList] = useState(null);

  const [selected, setSelected] = React.useState(null);
  const [id, setID] = useState("");
  const [idlist, setIDlist] = useState("");

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

  const getFeeds = async () => {
    setIsLoading1(true);
    try {
      const response = await axios.post("http://localhost:4000/data/byURL/", {
        url: url,
      });
      setAlldata(response.data);
      setIsLoading1(false);
      toast.success("Past Data loaded successfully.");
    } catch (error) {
      toast.warning("Invalid URL or Internal Server Error");
      // console.error("Error fetching feed:", error);
      setIsLoading1(false);
      setFeedData();
    }
  };
  const onSave = async () => {
    if (record === null) return;
    if (!id) {
      toast.warning("You should select ID");
      return;
    } // console.log("history", history);
    setPastData(record);
    setPastHistory(history);
    console.log(history, record, url, id);
    setSaveFlag(true);
    try {
      await axios.post("http://localhost:4000/data/", {
        url: url,
        feed: JSON.stringify(record),
        history: JSON.stringify(history),
        identifier: id,
      });
      getFeeds().then(() => {
        toast.success("Data Saved Successfully");
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      toast.warning("You should enter URL");
      // console.log("error");
      return;
    }
    setIsLoading(true);
    getFeeds().then(async () => {
      try {
        // axios.disable("etag");
        const response = await axios.post(
          // "https://optimum-koala-informed.ngrok-free.app/api/data",
          "http://localhost:4000/api/data",
          {
            url: url,
          }
        );
        // console.log(response.data);
        // console.log(Object.keys(response.data));
        filetered(response.data);
        setFeedData(response.data);
        setID("");
        setSelected("");
        setNew([]);
        setHistory(["Main"]);
        // console.log(filetered(response.data));
        toast.success("Fetch Data Successfully");
        setIsLoading(false);
      } catch (error) {
        toast.warning("Invalid URL or Internal Server Error");
        setIsLoading(false);
        setFeedData();
      }
    });
  };

  useEffect(() => {
    // console.log(selected);
    const temp = record ? record[selected] : null;
    // console.log(temp);
    if (temp) filetered(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (pastHistroy.length) {
      console.log(pastHistroy);
      setHistory(pastHistroy);
    }
  }, [pastHistroy]);

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
          <Grid item xs={12}>
            {isloading1 ? (
              <p>Loading past data...</p>
            ) : alldata.length ? (
              <LogTable
                data={alldata}
                setPastData={setPastData}
                setPastHistory={setPastHistory}
              />
            ) : (
              <>No Past Data</>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={3}>
          <Grid item xs={4}>
            <Item>
              <Box m={3}>
                <Breadcrumbs aria-label="breadcrumb">
                  {history.map((v, i) => {
                    return (
                      <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => {
                          let temp = [];
                          temp = history.slice(0, i + 1);
                          setHistory(temp);
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
                    setNew([]);
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
              {isloading ? (
                <p>Loading feed data...</p>
              ) : (
                <>
                  <h4>JSON Viewer</h4>
                  {record && (
                    <ReactJson
                      src={record}
                      theme="harmonic"
                      style={{ textAlign: "left" }}
                      collapsed
                    />
                  )}

                  {newdata.length ? (
                    <>
                      <h4>New JSON</h4>
                      <ReactJson
                        src={newdata}
                        theme="harmonic"
                        style={{ textAlign: "left" }}
                        collapsed
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                padding={"0px 30px"}
              >
                <h2>Result Table</h2>
                <h4>
                  {saveFlag ? (
                    <Chip
                      icon={<GridCheckCircleIcon />}
                      label="Data Saved"
                      variant="outlined"
                      style={{ marginLeft: "20px" }}
                    />
                  ) : (
                    <Chip
                      icon={<GridCloseIcon />}
                      label="Data not Saved"
                      variant="outlined"
                      style={{ marginLeft: "20px" }}
                    />
                  )}
                </h4>
                <Button variant="contained" color="success" onClick={onSave}>
                  SAVE
                </Button>
              </Box>
              {/* {feedData && <ProTable jons_data={feedData} />} */}

              <>
                {/* <pre>
                    {id && record && <TrafficEventTable data={record} />}
                  </pre> */}
                {id && record && (
                  <MuiTable
                    data={record}
                    identifier={id}
                    pastData={pastData}
                    setNew={setNew}
                  />
                )}
                {/* {id && record && <TempTable data={record} />} */}
              </>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default FeedFetcher;
