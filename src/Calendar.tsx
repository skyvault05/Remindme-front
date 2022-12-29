import { Button, CardActionArea, CardActions } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";

import ScheduleMapper from "./mapper/ScheduleMapper";
import ScheduleRepository from "./repository/ScheduleRepository";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const drawerWidth = 345;
const scheduleMapper = new ScheduleMapper();

type slot = {
  createDate: string;
  description: string;
  duration: string;
  end: Date;
  endDate: string;
  id: number;
  internalType: string;
  internalValue: string;
  members: [];
  modifiedDate: string;
  scheduleReplies: [];
  start: Date;
  startDate: string;
  status: number;
  thumbnail: string;
  title: string;
  user: [];
};
function CalendarApp() {
  const onSelectEventHandler = (slotInfo: slot) => {
    console.log(slotInfo);
    alert(slotInfo.title + slotInfo.start)
  };

  const [myEventList, setMyEventList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const scheduleRepository = new ScheduleRepository();
    scheduleRepository.getMySchedules().then((response) => {
      scheduleMapper
        .toCalendarSchedule(response)
        .then((eventList) => setMyEventList(eventList));
    });
    console.log("myEventList:", myEventList);
  }, []);

  const renderEventContent = (slotInfo: any) => {
    const date = moment(slotInfo.start).format("MMMM D, YYYY");
    return (
      <div>
        <p>
          Date: <strong>{date}</strong>
        </p>
        <p>Location: {slotInfo.location}</p>
      </div>
    );
  };
  return (
    <div className="App">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              RemindMe
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <Card sx={{ maxWidth: 345 }} key={index}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Calendar
            localizer={localizer}
            events={myEventList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={(slotInfo) => onSelectEventHandler(slotInfo)}
            // onSelectSlot={(slotInfo) => onSelectSlotHandler(slotInfo)}
          />
        </Box>
      </Box>
    </div>
  );
}

export default CalendarApp;
