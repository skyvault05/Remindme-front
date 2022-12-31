import { Button, CardActionArea, CardActions } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
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
  intervalType: string;
  intervalValue: number;
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
  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const [addOpen, setAddOpen] = React.useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  const [title, setTitle] = React.useState("");
  const [createdDate, setCreatedDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [id, setId] = React.useState(0);
  const [intervalType, setIntervalType] = React.useState("");
  const [intervalValue, setIntervalValue] = React.useState(0);
  const [members, setMembers] = React.useState([]);
  const [modifiedDate, setModifiedDate] = React.useState("");
  const [scheduleReplies, setScheduleReplies] = React.useState([]);
  const [start, setStart] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  const [user, setUser] = React.useState({});

  const scheduleRepository = new ScheduleRepository();

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const intervalTypeDropdown = [
    {
      value: "ONCE",
      label: "한번",
    },
    {
      value: "DAILY",
      label: "매일",
    },
    {
      value: "WEEKLY",
      label: "매주",
    },
    {
      value: "MONTHLY",
      label: "매달",
    },
    {
      value: "ANNUAL",
      label: "매년",
    },
  ];

  const handleSelectSlot = React.useCallback(
    ({ start, end }: any) => {
      // const title = window.prompt("New Event Name");
      handleAddOpen();
      if (title) {
        setMyEventList((prev) => [...prev, { start, end, title }]);
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
    setTitle(event.title);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setIntervalType(event.intervalType);
    setIntervalValue(event.intervalValue);
    setDescription(event.description);
    setId(event.id);
    handleEditOpen();
  }, []);

  // const handleDeleteEvent = React.useCallback(() => {
  //   console.log(id);
  //   scheduleRepository.deleteSchedule(id);
  // }, []);

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
            <Button
              color="inherit"
              href="http://localhost:8080/oauth2/authorization/google"
            >
              Login
            </Button>
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
          <Modal
            open={addOpen}
            onClose={handleAddClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                추가
              </Typography>
              <div>
                <TextField
                  fullWidth
                  required
                  id="standard-title"
                  label="제목"
                  variant="standard"
                />
                <TextField
                  fullWidth
                  required
                  id="standard-startDate"
                  label="시작날짜"
                  variant="standard"
                />
                <Button variant="outlined">Today</Button>
                <TextField
                  fullWidth
                  required
                  id="standard-endDate"
                  label="종료날짜"
                  variant="standard"
                />
                <Button variant="outlined">Today</Button>
                <TextField
                  fullWidth
                  id="standard-select-currency"
                  select
                  label="반복 주기"
                  variant="standard"
                >
                  {intervalTypeDropdown.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  id="standard-number"
                  label="반복 횟수"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                />

                <TextField
                  fullWidth
                  id="standard-multiline-flexible"
                  label="설명"
                  multiline
                  maxRows={20}
                  variant="standard"
                  defaultValue={description}
                />
                <Button variant="contained">추가</Button>
                <Button variant="outlined">취소</Button>
              </div>
            </Box>
          </Modal>
          <Modal
            open={editOpen}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                수정
              </Typography>
              <div>
                <TextField
                  fullWidth
                  required
                  id="standard-title"
                  label="제목"
                  defaultValue={title}
                  variant="standard"
                />
                <TextField
                  fullWidth
                  required
                  id="standard-startDate"
                  label="시작날짜"
                  defaultValue={startDate}
                  variant="standard"
                />
                <TextField
                  fullWidth
                  required
                  id="standard-endDate"
                  label="종료날짜"
                  defaultValue={endDate}
                  variant="standard"
                />
                <TextField
                  fullWidth
                  id="standard-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  defaultValue={intervalValue}
                  variant="standard"
                />
                <TextField
                  fullWidth
                  id="standard-select-currency"
                  select
                  label="Select"
                  defaultValue={intervalType}
                  helperText="반복할 주기를 선택해주세요."
                  variant="standard"
                >
                  {intervalTypeDropdown.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  id="standard-multiline-flexible"
                  label="설명"
                  multiline
                  maxRows={5}
                  variant="standard"
                  defaultValue={description}
                />
                <Button variant="contained">변경</Button>
                <Button
                  variant="contained"
                  color="error"
                  // onClick={() => handleDeleteEvent()}
                >
                  삭제
                </Button>
                <Button variant="outlined">취소</Button>
              </div>
            </Box>
          </Modal>
          <Box sx={{ overflow: "auto" }}>
            {["All mail", "Trash"].map((text, index) => (
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
            style={{ height: 800 }}
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
