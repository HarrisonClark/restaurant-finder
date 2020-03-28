import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
require("dotenv").config();

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Countdown Restaurant Finder
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function GooglePlaces(keyword) {
  let placesAPI =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
  const apiKey = "AIzaSyDW9ojweUR4sjuQ6e0PaRyrBAjGS6PdDUE";
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  placesAPI =
    placesAPI +
    "input=" +
    encodeURI(keyword) +
    "&inputtype=textquery&fields=geometry&key=" +
    apiKey;

  // return fetch(placesAPI);
  const myHeaders = new Headers();

  console.log(placesAPI);
  fetch(proxyUrl + placesAPI, {
    method: "GET",
    headers: myHeaders,
    cache: "default"
  })
    .then(res => {
      return res.json();
    })
    .then()
    .catch(error => {
      console.log(error);
    });
}

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function App() {
  const classes = useStyles();
  const [restPin, setRestPin] = useState("");
  const [location, setLocation] = useState("");
  const [scene, setScene] = useState(1);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 33.5186,
    longitude: -86.8104,
    zoom: 8
  });

  function Scene() {
    if (scene === 1) {
      return (
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Find A Restaurant Near You!
          </Typography>
          <form
            className={classes.form}
            noValidate
            onChange={event => {
              setLocation(event.target.value);
            }}
            onSubmit={event => {
              if (location === "") {
                setLocation("null");
              }
              event.preventDefault();
              let placesAPI =
                "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
              const apiKey = "AIzaSyDW9ojweUR4sjuQ6e0PaRyrBAjGS6PdDUE";
              const proxyUrl = "https://cors-anywhere.herokuapp.com/";
              placesAPI =
                placesAPI +
                "input=" +
                encodeURI(location) +
                "&inputtype=textquery&fields=geometry&key=" +
                apiKey;

              console.log(placesAPI);
              fetch(proxyUrl + placesAPI)
                .then(res => res.json())
                .then(res => {
                  console.log(res);
                  setViewport({
                    ...viewport,
                    latitude: res.candidates[0].geometry.location.lat,
                    longitude: res.candidates[0].geometry.location.lng,
                    zoom: 10
                  });
                });
              setScene(2);
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={location}
              id="location"
              label="Location"
              name="location"
              autoComplete="on"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Search Nearby
            </Button>

            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      );
    } else if (scene === 2) {
      return (
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            What type of Restaurant?
          </Typography>
          <form
            className={classes.form}
            noValidate
            onChange={event => {
              setLocation(event.target.value);
            }}
            onSubmit={event => {
              if (location === "") {
                setLocation("null");
              }
              event.preventDefault();
              let placesAPI =
                "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
              const apiKey = "AIzaSyDW9ojweUR4sjuQ6e0PaRyrBAjGS6PdDUE";
              const proxyUrl = "https://cors-anywhere.herokuapp.com/";
              placesAPI =
                placesAPI +
                "input=" +
                encodeURI(location) +
                "&locationbias=circle:10000@" +
                viewport.latitude +
                "," +
                viewport.longitude +
                "&inputtype=textquery&fields=geometry,name&key=" +
                apiKey;

              console.log(placesAPI);
              fetch(proxyUrl + placesAPI)
                .then(res => res.json())
                .then(res => {
                  setRestPin(
                    <Marker
                      latitude={res.candidates[0].geometry.location.lat}
                      longitude={res.candidates[0].geometry.location.lng}
                      offsetLeft={-20}
                      offsetTop={-10}
                    >
                      <div>{res.candidates[0].name}</div>
                    </Marker>
                  );
                  console.log(res);
                });
              setScene(3);
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={location}
              id="location"
              label="Location"
              name="location"
              autoComplete="on"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Search Nearby
            </Button>

            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      );
    } else if (scene === 3) {
      return (
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Restaurant Found!
          </Typography>
        </div>
      );
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}>
        <ReactMapGL
          {...viewport}
          onViewportChange={setViewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        >
          {restPin}
        </ReactMapGL>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Scene />
      </Grid>
    </Grid>
  );
}

export default App;
