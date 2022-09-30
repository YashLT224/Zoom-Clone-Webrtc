import React, { useContext } from "react";
import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";

import { SocketContext } from "../Context";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));
const VideoPlayer = () => {
  const { call, callAccepted, myVideo, userVideo, stream, name, callEnded } =
    useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {/* own video */}
      {stream && (        //if there is a stream then renders my own stream
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}


      {/* user video */}
      {callAccepted&& !callEnded &&(
           <Paper className={classes.paper}>
           <Grid item xs={12} md={6}>
             <Typography variant="h5" gutterBottom>
               {call.Name || "Name"}
             </Typography>
             <video
               playsInline
               muted
               ref={userVideo}
               autoPlay
               className={classes.video}
             />
           </Grid>
         </Paper>
      )}
     
    </Grid>
  );
};

export default VideoPlayer;
