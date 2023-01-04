import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";

import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { mainListItems, secondaryListItems } from "./listItems";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import "moment/locale/ko";
import ScheduleMapper from "../mapper/ScheduleMapper";
import ScheduleRepository from "../repository/ScheduleRepository";

const localizer = momentLocalizer(moment);

function Copyright(props: any) {
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
}

const drawerWidth: number = 240;

const modalBoxStyle = {
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [myEventList, setMyEventList] = React.useState<any[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [id, setId] = React.useState(0);
  const [intervalType, setIntervalType] = React.useState("");
  const [intervalValue, setIntervalValue] = React.useState(0);
  const [members, setMembers] = React.useState([]);
  const [scheduleReplies, setScheduleReplies] = React.useState([]);
  const [start, setStart] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  const [user, setUser] = React.useState({});

  const scheduleRepository = new ScheduleRepository();
  const scheduleMapper = new ScheduleMapper();

  React.useEffect(() => {
    scheduleRepository.getMySchedules().then((response) => {
      scheduleMapper
        .toCalendarSchedule(response)
        .then((eventList) => setMyEventList(eventList));
    });
  }, []);

  const changeDate = (date: any) => {
    return moment(date?.toString()).format("YYYY-MM-DDTHH:mm:ss");
  };

  //2023-01-23T00:00:00
  const handleSelectEvent = React.useCallback((event: any) => {
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

  const handleSelectSlot = React.useCallback(
    ({ start, end }: any) => {
      handleAddOpen();

      setStart(changeDate(start).toString());
      setEnd(changeDate(end).toString());
    },
    [setMyEventList]
  );

  const handleDelete = (id: number) => {
    scheduleRepository
      .deleteSchedule(id)
      .then(() => alert("삭제가 완료되었습니다."))
      .catch((error) => alert(error));
  };

  const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    scheduleRepository
      .storeSchedule({
        id: data.get("id"),
        title: data.get("title"),
        startDate: changeDate(data.get("startDate")),
        endDate: changeDate(data.get("endDate")),
        intervalType: data.get("intervalType"),
        intervalValue: data.get("intervalValue"),
        description: data.get("description"),
      })
      .then(() => alert("변경이 완료되었습니다."))
      .catch((error) => alert(error));
  };

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      title: data.get("title"),
      startDate: changeDate(data.get("startDate")),
      endDate: changeDate(data.get("endDate")),
      intervalType: data.get("intervalType"),
      intervalValue: data.get("intervalValue"),
      description: data.get("description"),
    });

    // console.log(moment(data.get("endDate")))
    scheduleRepository
      .storeSchedule({
        title: data.get("title"),
        startDate: changeDate(data.get("startDate")),
        endDate: changeDate(data.get("endDate")),
        intervalType: data.get("intervalType"),
        intervalValue: data.get("intervalValue"),
        description: data.get("description"),
      })
      .then(() => alert("추가가 완료되었습니다."))
      .catch((error) => alert(error));
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
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
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {/* <Orders /> */}
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
              {/* Chart */}
              {/* <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                </Paper>
              </Grid> */}
              {/* Recent Deposits */}
              {/* <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid> */}
              {/* Recent Orders */}
              {/* <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Orders />
                </Paper>
              </Grid> */}
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <Typography component="h1" variant="h5">
            추가 모달
          </Typography>
          <Box component="form" onSubmit={handleAddSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="title"
              name="title"
              autoComplete="title"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="startDate"
              label="startDate"
              name="startDate"
              autoComplete="startDate"
              defaultValue={start}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="endDate"
              label="endDate"
              name="endDate"
              autoComplete="endDate"
              defaultValue={end}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="intervalType"
              label="intervalType"
              name="intervalType"
              autoComplete="intervalType"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="intervalValue"
              label="intervalValue"
              name="intervalValue"
              autoComplete="intervalValue"
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="description"
              name="description"
              autoComplete="description"
            />
            <TextField
              margin="normal"
              fullWidth
              id="thumbnail"
              label="thumbnail"
              name="thumbnail"
              autoComplete="thumbnail"
              defaultValue={thumbnail}
            />
            <Button variant="contained" component="label">
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              등록
            </Button>
            <Button type="reset" variant="outlined" sx={{ mt: 3, mb: 2 }}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <Typography component="h1" variant="h5">
            수정 모달
          </Typography>
          <Box component="form" onSubmit={handleUpdateSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="id"
              name="id"
              autoComplete="id"
              defaultValue={id}
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="title"
              name="title"
              autoComplete="title"
              defaultValue={title}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="startDate"
              label="startDate"
              name="startDate"
              autoComplete="startDate"
              defaultValue={startDate}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="endDate"
              label="endDate"
              name="endDate"
              autoComplete="endDate"
              defaultValue={endDate}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="intervalType"
              label="intervalType"
              name="intervalType"
              autoComplete="intervalType"
              defaultValue={intervalType}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="intervalValue"
              label="intervalValue"
              name="intervalValue"
              autoComplete="intervalValue"
              defaultValue={intervalValue}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="description"
              name="description"
              autoComplete="description"
              defaultValue={description}
            />
            <TextField
              margin="normal"
              fullWidth
              id="thumbnail"
              label="thumbnail"
              name="thumbnail"
              autoComplete="thumbnail"
              defaultValue={thumbnail}
            />
            <Button variant="contained" component="label">
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              변경
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(id)}
              sx={{ mt: 3, mb: 2 }}
            >
              삭제
            </Button>
            <Button type="reset" variant="outlined" sx={{ mt: 3, mb: 2 }}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
