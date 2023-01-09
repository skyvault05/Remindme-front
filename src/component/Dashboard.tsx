import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";

import * as React from "react";
import { mainListItems, secondaryListItems } from "./listItems";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import "moment/locale/ko";

import ScheduleMapper from "../mapper/ScheduleMapper";
import ScheduleRepository from "../repository/ScheduleRepository";

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

type Member = {
  id: number;
  nickname: string;
  picture: string;
  status: number;
};

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

  const scheduleRepository = new ScheduleRepository();
  const scheduleMapper = new ScheduleMapper();

  React.useEffect(() => {
    getEventLoading();
  }, []);

  const changeDate = (date: any) => {
    const result = moment(date?.toString()).format("YYYY-MM-DDTHH:mm");

    return result;
  };

  //2023-01-23T00:00:00
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
    scheduleRepository.getMySchedules().then((response) => {
      scheduleMapper.toCalendarSchedule(response).then((eventList) => {
        setMyEventList(eventList);
      });
    });
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
            <Grid container spacing={1.5}>
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
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  Charts
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  Deposits
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography gutterBottom variant="h5" component="div">
                    Events
                  </Typography>
                  {myEventList.map((result: any, index) => (
                    <Card sx={{ maxWidth: 345 }} key={index}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={result.thumbnail}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {result.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {result.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button size="small" color="primary">
                          10 PEOPLE
                        </Button>
                        <Button size="small" color="primary"></Button>
                        <Button size="small" color="primary">
                          {result.startDate} ~ {result.endDate} (D-20)
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Paper>
              </Grid>
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
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="제목"
                  name="title"
                  autoComplete="title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="startDate"
                  label="시작일자"
                  name="startDate"
                  type="datetime-local"
                  autoComplete="startDate"
                  defaultValue={start}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="endDate"
                  label="종료일자"
                  name="endDate"
                  type="datetime-local"
                  autoComplete="endDate"
                  defaultValue={end}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormLabel id="radiobutton-label">IntervalType</FormLabel>
                <RadioGroup
                  aria-labelledby="radiobutton-label"
                  defaultValue="ONCE"
                  name="radio-buttons-group"
                  row
                >
                  <FormControlLabel
                    value="ONCE"
                    name="radio_once"
                    control={<Radio />}
                    label="한번"
                  />
                  <FormControlLabel
                    value="DAILY"
                    name="radio_daily"
                    control={<Radio />}
                    label="매일"
                  />
                  <FormControlLabel
                    value="WEEKLY"
                    name="radio_weekly"
                    control={<Radio />}
                    label="매주"
                  />
                  <FormControlLabel
                    value="MONTHLY"
                    name="radio_monthly"
                    control={<Radio />}
                    label="매달"
                  />
                  <FormControlLabel
                    value="ANNUAL"
                    name="radio_annual"
                    control={<Radio />}
                    label="매년"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="intervalValue"
                  label="반복횟수"
                  name="intervalValue"
                  autoComplete="intervalValue"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="duration"
                  label="소요시간"
                  name="duration"
                  autoComplete="duration"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="설명"
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="user"
                  label="작성인"
                  name="user"
                  autoComplete="user"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="members"
                  label="참가자"
                  name="members"
                  autoComplete="members"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="scheduleReplies"
                  label="댓글"
                  name="scheduleReplies"
                  autoComplete="scheduleReplies"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                  등록
                </Button>
                <Button type="reset" variant="outlined" sx={{ mt: 3, mb: 2 }}>
                  취소
                </Button>
              </Grid>
            </Grid>
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
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="id"
                  label="id"
                  name="id"
                  autoComplete="id"
                  value={id}
                  defaultValue={id}
                  sx={{ display: "none" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="제목"
                  name="title"
                  autoComplete="title"
                  defaultValue={title}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="startDate"
                  label="시작일자"
                  name="startDate"
                  type="datetime-local"
                  autoComplete="startDate"
                  defaultValue={startDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="endDate"
                  label="종료일자"
                  name="endDate"
                  type="datetime-local"
                  autoComplete="endDate"
                  defaultValue={endDate}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormLabel id="radiobutton-label">IntervalType</FormLabel>
                <RadioGroup
                  aria-labelledby="radiobutton-label"
                  defaultValue={intervalType}
                  name="radio-buttons-group"
                  row
                >
                  <FormControlLabel
                    value="ONCE"
                    name="radio_once"
                    control={<Radio />}
                    label="한번"
                  />
                  <FormControlLabel
                    value="DAILY"
                    name="radio_daily"
                    control={<Radio />}
                    label="매일"
                  />
                  <FormControlLabel
                    value="WEEKLY"
                    name="radio_weekly"
                    control={<Radio />}
                    label="매주"
                  />
                  <FormControlLabel
                    value="MONTHLY"
                    name="radio_monthly"
                    control={<Radio />}
                    label="매달"
                  />
                  <FormControlLabel
                    value="ANNUAL"
                    name="radio_annual"
                    control={<Radio />}
                    label="매년"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="intervalValue"
                  label="반복횟수"
                  name="intervalValue"
                  autoComplete="intervalValue"
                  defaultValue={intervalValue}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="duration"
                  label="소요시간"
                  name="duration"
                  autoComplete="duration"
                  defaultValue={duration}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="설명"
                  name="description"
                  autoComplete="description"
                  defaultValue={description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                참가자
                {members.map((member) => (
                  <Card>
                    <Box sx={{ p: 1, display: "flex" }}>
                      <Avatar
                        sx={{ width: 30, height: 30 }}
                        src={member.picture}
                      />
                      <Typography fontWeight={700}>
                        {member.nickname}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12} sm={6}>
                생성자
                <Card>
                  <Box sx={{ p: 1, display: "flex" }}>
                    <Avatar sx={{ width: 30, height: 30 }} src={user.picture} />
                    <Typography fontWeight={700}>{user.nickname}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="scheduleReplies"
                  label="리플"
                  name="scheduleReplies"
                  autoComplete="scheduleReplies"
                  defaultValue={scheduleReplies}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                  변경
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteClick(id)}
                  sx={{ mt: 3, mb: 2 }}
                >
                  삭제
                </Button>
                <Button type="reset" variant="outlined" sx={{ mt: 3, mb: 2 }}>
                  취소
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
