import { Button, CardActionArea, CardActions } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
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
  const [myEventList, setMyEventList] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scheduleRepository = new ScheduleRepository();

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleSelectSlot = React.useCallback(
    ({ start, end }: any) => {
      const title = window.prompt("New Event Name");
      if (title) {
        // console.log("myEventList", myEventList);
        setMyEventList((prev) => [...prev, { start, end, title }]);
        // console.log(start, end, title);
        // console.log(moment(start), moment(end), title);

        // window.alert(moment(start));
        scheduleRepository.storeSchedule({
          startDate: moment(start),
          endDate: moment(end),
          title,
          intervalType: "ONCE",
          intervalValue: 1,
        });
      }
    },
    [setMyEventList]
  );

  const handleSelectEvent = React.useCallback((event: slot) => {
    // scheduleRepository.deleteSchedule(event.id);
    console.log(event);
    handleOpen();
  }, []);

  React.useEffect(() => {
    scheduleRepository.getMySchedules().then((response) => {
      console.log("response", response);
      scheduleMapper
        .toCalendarSchedule(response)
        .then((eventList) => setMyEventList(eventList));
    });
  }, []);

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
          {/* <Button onClick={handleOpen}>Open modal</Button> */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
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
            style={{ height: 1000 }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            showAllEvents={true}
            selectable
          />
        </Box>
      </Box>
    </div>
  );
}

export default CalendarApp;
