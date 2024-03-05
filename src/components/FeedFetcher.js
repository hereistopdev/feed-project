import React, { useState } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import TrafficEventTable from "./TrafficEventTable";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import logo from "../logo.svg";

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

  const sendUrlToServer = async () => {
    if (url.length === 0) {
      toast.success("Hi");
      alert("You should enter URL");
      console.log("error");
      return;
    }
    setIsLoading(true);
    try {
      // axios.disable("etag");
      const response = await axios.post(
        "https://optimum-koala-informed.ngrok-free.app/api/data",
        {
          url: url,
        }
      );
      setFeedData(response.data);
      console.log(JSON.stringify(response.data));
      setIsLoading(false);
    } catch (error) {
      alert("Invalid URL or Internal Server Error");
      console.error("Error fetching feed:", error);
      setIsLoading(false);
      setFeedData();
    }
  };

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
              <h4>JSON Viewer</h4>
              {feedData && (
                <ReactJson
                  src={feedData[0]}
                  theme="harmonic"
                  style={{ textAlign: "left" }}
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
                <pre>{feedData && <TrafficEventTable data={feedData} />}</pre>
              )}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FeedFetcher;
