import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import LoginIcon from "@mui/icons-material/Login";

import * as React from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import "moment/locale/ko";

import ScheduleMapper from "../mapper/ScheduleMapper";
import ScheduleRepository from "../repository/ScheduleRepository";
import { AddModal } from "./Add";
import { UpdateModal } from "./Update";

const localizer = momentLocalizer(moment);

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        RemindMe
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const drawerWidth: number = 300;

const mdTheme = createTheme();

export type Member = {
  id: number;
  nickname: string;
  picture: string;
  status: number;
};

function DashboardContent() {
  const [backdropOpen, setBackdropOpen] = React.useState(false);
  const [myEventList, setMyEventList] = React.useState<any[]>([]);
  const [todayFilteredEventList, setTodayFilteredEventList] = React.useState<
    any[]
  >([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [id, setId] = React.useState(0);
  const [intervalType, setIntervalType] = React.useState("");
  const [intervalValue, setIntervalValue] = React.useState(0);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [scheduleReplies, setScheduleReplies] = React.useState([]);
  const [start, setStart] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  const [user, setUser] = React.useState<Member>({
    id: 0,
    nickname: "",
    picture: "",
    status: 0,
  });

  const [secondary, setSecondary] = React.useState(false);

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleBackdropClose = () => setBackdropOpen(false);
  const handleBackdropToggle = () => setBackdropOpen(!backdropOpen);

  const scheduleRepository = new ScheduleRepository();
  const scheduleMapper = new ScheduleMapper();

  React.useEffect(() => {
    getEventLoading();
  }, []);

  const changeDate = (date: any) => {
    const result = moment(date?.toString()).format("YYYY-MM-DDTHH:mm");

    return result;
  };

  const handleSelectEvent = React.useCallback((event: any) => {
    // console.log("event", event);
    setTitle(event.title);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setIntervalType(event.intervalType);
    setIntervalValue(event.intervalValue);
    setDuration(event.duration);
    setDescription(event.description);
    setId(event.id);
    setMembers(event.members);
    setUser(event.user);
    handleEditOpen();
  }, []);

  const handleSelectSlot = React.useCallback(
    ({ start, end }: any) => {
      handleAddOpen();
      setStart(changeDate(start).toString());
      setEnd(changeDate(end).toString());
    },
    [setMyEventList]
  );

  const getEventLoading = () => {
    handleBackdropToggle();
    scheduleRepository.getMySchedules().then((response) => {
      scheduleMapper.toCalendarSchedule(response).then((eventList) => {
        setMyEventList(eventList);
        todayFiltering();
        handleBackdropClose();
      });
    });
  };

  const todayFiltering = () => {
    const result = myEventList.filter(
      (event) =>
        moment(event.startDate).diff(moment().format("YYYY-MM-DD"), "days") >=
          0 ||
        moment(event.endDate).diff(moment().format("YYYY-MM-DD"), "days") >= 0
    );
    setTodayFilteredEventList(result);
    console.log(todayFilteredEventList);
  };

  const intervalTypeCheck = (data: FormData) => {
    let result;
    if (data.get("radio_once") !== null) {
      result = data.get("radio_once");
    } else if (data.get("radio_daily") !== null) {
      result = data.get("radio_daily");
    } else if (data.get("radio_weekly") !== null) {
      result = data.get("radio_weekly");
    } else if (data.get("radio_monthly") !== null) {
      result = data.get("radio_monthly");
    } else if (data.get("radio_annual") !== null) {
      result = data.get("radio_annual");
    }

    return result;
  };

  const storeExecute = (response: any) => {
    myEventList.push(response);
    getEventLoading();
  };

  const deleteExecute = (id: any) => {
    const result = myEventList.filter((event) => event.id !== id);
    setMyEventList(result);
  };

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      title: data.get("title"),
      startDate: changeDate(data.get("startDate")),
      endDate: changeDate(data.get("endDate")),
      intervalType: intervalTypeCheck(data),
      intervalValue: data.get("intervalValue"),
      duration: data.get("duration"),
      description: data.get("description"),
    });

    scheduleRepository
      .storeSchedule({
        title: data.get("title"),
        startDate: changeDate(data.get("startDate")),
        endDate: changeDate(data.get("endDate")),
        intervalType: intervalTypeCheck(data),
        intervalValue: data.get("intervalValue"),
        duration: data.get("duration"),

        description: data.get("description"),
      })
      .then((response) => {
        storeExecute(response);
        alert("추가가 완료되었습니다.");
        handleAddClose();
      })
      .catch((error) => alert(error));
  };

  const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("id", data.get("id"));
    scheduleRepository
      .storeSchedule({
        id: data.get("id"),
        title: data.get("title"),
        startDate: changeDate(data.get("startDate")),
        endDate: changeDate(data.get("endDate")),
        intervalType: intervalTypeCheck(data),
        intervalValue: data.get("intervalValue"),
        duration: data.get("duration"),
        description: data.get("description"),
      })
      .then((response) => {
        console.log("update_response", response);
        storeExecute(response);
        alert("변경이 완료되었습니다.");
        handleEditClose();
      })
      .catch((error) => alert(error));
  };

  const handleDeleteClick = (id: number) => {
    scheduleRepository
      .deleteSchedule(id)
      .then((response) => {
        console.log("delete_response", response);
        deleteExecute(id);
        alert("삭제가 완료되었습니다.");
        handleEditClose();
      })
      .catch((error) => alert(error));
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              RemindMe
            </Typography>
            <IconButton
              color="inherit"
              href="http://localhost:8080/oauth2/authorization/google"
            >
              <LoginIcon />
            </IconButton>
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
            <List>
              {todayFilteredEventList.map((result: any, index) => (
                <Card sx={{ maxWidth: 345 }} key={index}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={result.thumbnail}
                    />
                    <CardContent>
                      <Typography gutterBottom component="div">
                        {result.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      {result.members.length} PEOPLE
                    </Button>
                    <Button size="small" color="primary">
                      {result.startDate} ~ {result.endDate} (D-20)
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
            onClick={handleBackdropClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Calendar
                    localizer={localizer}
                    events={myEventList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700 }}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    popup
                    selectable
                  />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      {AddModal(addOpen, handleAddClose, handleAddSubmit, start, end)}
      {UpdateModal(
        editOpen,
        handleEditClose,
        handleUpdateSubmit,
        id,
        title,
        startDate,
        endDate,
        intervalType,
        intervalValue,
        duration,
        description,
        user,
        secondary,
        members,
        scheduleReplies,
        handleDeleteClick
      )}
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
