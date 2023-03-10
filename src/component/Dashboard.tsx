import DeleteIcon from "@mui/icons-material/Delete";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import * as React from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import "moment/locale/ko";

import { customAxios } from "../lib/customAxios";
import ScheduleMapper from "../mapper/ScheduleMapper";
import ReplyRepository from "../repository/ReplyRepository";
import ScheduleRepository from "../repository/ScheduleRepository";
import UserRepository from "../repository/UserRepository";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const localizer = momentLocalizer(moment);

const Copyright = (props: any) => {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright ?? "}
        <Link color="inherit" href="">
          RemindMe
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="button">????????? ??????: RemindmeTestAcc@gmail.com // remindmeacc</Typography>
    </>
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

export type Replies = {
  id: number;
  user: Member;
  schedule: number;
  description: string;
  createdDate: string;
  modifiedDate: string;
  status: number;
};

const modalBoxStyle = {
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute" as "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function DashboardContent() {
  const [backdropOpen, setBackdropOpen] = React.useState(false);
  const [myEventList, setMyEventList] = React.useState<any[]>([]);
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
  const [scheduleReplies, setScheduleReplies] = React.useState<Replies[]>([]);
  const [start, setStart] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  const [imageSrc, setImageSrc] = React.useState("");
  const [replyValue, setReplyValue] = React.useState("");

  const [user, setUser] = React.useState<Member>({
    id: 0,
    nickname: "",
    picture: "",
    status: 0,
  });

  const [secondary, setSecondary] = React.useState(false);

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setImageSrc("");
  };
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleBackdropClose = () => setBackdropOpen(false);
  const handleBackdropToggle = () => setBackdropOpen(!backdropOpen);

  const scheduleRepository = new ScheduleRepository();
  const replyRepository = new ReplyRepository();
  const userRepository = new UserRepository();
  const scheduleMapper = new ScheduleMapper();

  React.useEffect(() => {
    getEventLoading();
    checkLogin();
  }, []);

  const changeDate = (date: any) => {
    const result = moment(date?.toString()).format("YYYY-MM-DDTHH:mm");
    return result;
  };

  const handleSelectEvent = React.useCallback((event: any) => {
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
    getScheduleReplies(event.id);
    // setScheduleReplies(event.scheduleReplies); // getScheduleReply??? ??????
    handleEditOpen();
  }, []);

  const getScheduleReplies = (id: number) => {
    replyRepository.getScheduleReplies(id).then((response) => {
      setScheduleReplies(response);
    });
  };
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
      scheduleMapper
        .toCalendarSchedule(response)
        .then((eventList) => {
          setMyEventList(eventList);
          handleBackdropClose();
        })
        .catch((error) => alert(error));
    });
    replyRepository.getMyScheduleReplies().then(() => { });
  };

  const checkLogin = () => {
    userRepository.getMyInfo().then((response) => {
      console.log("checkLogin", response);
    }).catch((error) => {
      alert("????????? ???????????? ????????? ??????????????????.")
      handleBackdropClose();
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

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: any) => {
    const fd = new FormData();

    fd.append("thumbnail", e.target.files[0]);

    console.log(fd.get("thumbnail"));
    customAxios
      .post("/api/v1/schedule/uploadThumbnail", fd, {
        headers: {
          "Content-Type": `multipart/form-data; `,
        },
      })
      .then((response: any) => {
        console.log("response", response);
        setThumbnail(response.data);
        setImageSrc(response.data);
      })
      .catch((error: any) => console.log(error));
  };

  const deleteExecute = (id: any) => {
    const result = myEventList.filter((event) => event.id !== id);
    setMyEventList(result);
  };

  const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    scheduleRepository
      .storeSchedule({
        title: data.get("title"),
        startDate: changeDate(data.get("startDate")),
        endDate: changeDate(data.get("endDate")),
        intervalType: intervalTypeCheck(data),
        intervalValue: data.get("intervalValue"),
        duration: data.get("duration"),
        description: data.get("description"),
        thumbnail: data.get("thumbnail"),
      })
      .then((response) => {
        storeExecute(response);
        alert("????????? ?????????????????????.");
        handleAddClose();
      })
      .catch((error) => alert(error));
  };

  const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log("data", data);

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
        thumbnail: data.get("thumbnail"),
      })
      .then((response) => {
        storeExecute(response);
        alert("????????? ?????????????????????.");
        handleEditClose();
      })
      .catch((error) => alert(error));
  };

  const handleDeleteClick = (id: number) => {
    scheduleRepository
      .deleteSchedule(id)
      .then(() => {
        deleteExecute(id);
        alert("????????? ?????????????????????.");
        handleEditClose();
      })
      .catch((error) => alert(error));
  };

  const loginButton = (
    <Button
      variant="contained"
      href="http://ec2-54-238-154-254.ap-northeast-1.compute.amazonaws.com:8080/oauth2/authorization/google?redirect_uri=http://ec2-18-183-67-247.ap-northeast-1.compute.amazonaws.com:3000/oauth2/redirect"
      endIcon={<LoginIcon />}
      color="error"
    >
      Login
    </Button>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
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
              {loginButton}
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
                {myEventList
                  .filter(
                    (event) =>
                      dateDiff(event.startDate) >= 0 ||
                      dateDiff(event.endDate) >= 0
                  )
                  .map((result: any, index) => (
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
                          {result.startDate} <br />~ {result.endDate}
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
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
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
        <Modal
          open={addOpen}
          onClose={handleAddClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalBoxStyle}>
            <Box component="form" onSubmit={handleAddSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid container item spacing={3}>
                  <Grid item xs={12}>
                    <label htmlFor="select-image">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        onClick={handleButtonClick}
                      >
                        Upload Image
                      </Button>
                    </label>
                    <input
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <div className="preview">
                      {imageSrc && <img src={imageSrc} alt="preview-img" />}
                    </div>
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="thumbnail"
                      label="thumbnail"
                      name="thumbnail"
                      autoComplete="thumbnail"
                      value={thumbnail}
                      sx={{ display: "none" }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="title"
                      label="??????"
                      name="title"
                      autoComplete="title"
                      autoFocus
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={8}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="description"
                      label="??????"
                      name="description"
                      autoComplete="description"
                      multiline
                      rows={10}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="startDate"
                      label="????????????"
                      name="startDate"
                      type="datetime-local"
                      autoComplete="startDate"
                      defaultValue={start}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="endDate"
                      label="????????????"
                      name="endDate"
                      type="datetime-local"
                      autoComplete="endDate"
                      defaultValue={end}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <FormLabel id="radiobutton-label">????????????</FormLabel>
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
                        label="??????"
                      />
                      <FormControlLabel
                        value="DAILY"
                        name="radio_daily"
                        control={<Radio />}
                        label="??????"
                      />
                      <FormControlLabel
                        value="WEEKLY"
                        name="radio_weekly"
                        control={<Radio />}
                        label="??????"
                      />
                      <FormControlLabel
                        value="MONTHLY"
                        name="radio_monthly"
                        control={<Radio />}
                        label="??????"
                      />
                      <FormControlLabel
                        value="ANNUAL"
                        name="radio_annual"
                        control={<Radio />}
                        label="??????"
                      />
                    </RadioGroup>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="intervalValue"
                      label="????????????"
                      name="intervalValue"
                      autoComplete="intervalValue"
                      type="number"
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="duration"
                      label="????????????"
                      name="duration"
                      autoComplete="duration"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">???</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      ??????
                    </Button>
                    <Button
                      type="reset"
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      ??????
                    </Button>
                  </Grid>
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
            <Box component="form" onSubmit={handleUpdateSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid container item spacing={3}>
                  <Grid item xs={12}>
                    <label htmlFor="select-image">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        onClick={handleButtonClick}
                      >
                        Upload Image
                      </Button>
                    </label>
                    <input
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <div className="preview">
                      {imageSrc && <img src={imageSrc} alt="preview-img" />}
                    </div>
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="id"
                      label="id"
                      name="id"
                      autoComplete="id"
                      defaultValue={id}
                      sx={{ display: "none" }}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      id="thumbnail"
                      label="thumbnail"
                      name="thumbnail"
                      autoComplete="thumbnail"
                      value={thumbnail}
                      sx={{ display: "none" }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="title"
                      label="??????"
                      name="title"
                      autoComplete="title"
                      defaultValue={title}
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={8}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="description"
                      label="??????"
                      name="description"
                      autoComplete="description"
                      defaultValue={description}
                      multiline
                      rows={10}
                    />
                    <Box>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="scheduleReplies"
                        label="??????"
                        name="scheduleReplies"
                        autoComplete="scheduleReplies"
                        variant="standard"
                        onChange={(e) => setReplyValue(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                variant="contained"
                                onClick={() => addReply()}
                                endIcon={<SendIcon />}
                              >
                                Send
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        {scheduleReplies.map((reply, i) => (
                          <ListItem alignItems="flex-start" key={i}>
                            <ListItemAvatar>
                              <Avatar
                                alt={reply.user.nickname}
                                src={reply.user.picture}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={reply.description}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {reply.user.nickname}
                                  </Typography>
                                  {
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() => deleteReply(reply)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  }
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="startDate"
                      label="????????????"
                      name="startDate"
                      type="datetime-local"
                      autoComplete="startDate"
                      defaultValue={startDate}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="endDate"
                      label="????????????"
                      name="endDate"
                      type="datetime-local"
                      autoComplete="endDate"
                      defaultValue={endDate}
                    />
                    <FormLabel id="radiobutton-label">????????????</FormLabel>
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
                        label="??????"
                      />
                      <FormControlLabel
                        value="DAILY"
                        name="radio_daily"
                        control={<Radio />}
                        label="??????"
                      />
                      <FormControlLabel
                        value="WEEKLY"
                        name="radio_weekly"
                        control={<Radio />}
                        label="??????"
                      />
                      <FormControlLabel
                        value="MONTHLY"
                        name="radio_monthly"
                        control={<Radio />}
                        label="??????"
                      />
                      <FormControlLabel
                        value="ANNUAL"
                        name="radio_annual"
                        control={<Radio />}
                        label="??????"
                      />
                    </RadioGroup>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="intervalValue"
                      label="????????????"
                      name="intervalValue"
                      autoComplete="intervalValue"
                      defaultValue={intervalValue}
                      type="number"
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="duration"
                      label="????????????"
                      name="duration"
                      autoComplete="duration"
                      defaultValue={duration}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">???</InputAdornment>
                        ),
                      }}
                    />
                    ?????????
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: 30, height: 30 }}
                          src={user.picture}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.nickname ? user.nickname : "unknown"}
                      />
                    </ListItem>
                    ?????????
                    {members.map((member, i) => (
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        }
                        key={i}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ width: 30, height: 30 }}
                            src={member.picture}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            member.nickname ? member.nickname : "unknown"
                          }
                        />
                      </ListItem>
                    ))}
                    {/* <TextField
                      margin="normal"
                      fullWidth
                      id="members"
                      name="members"
                      autoComplete="members"
                      // defaultValue={scheduleReplies}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant="contained"
                              onClick={() => console.log("send")}
                              endIcon={<PersonIcon />}
                            >
                              ????????????
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    /> */}
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      ??????
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteClick(id)}
                      sx={{ mt: 3, mb: 2 }}
                    >
                      ??????
                    </Button>
                    <Button
                      type="reset"
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      ??????
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </ThemeProvider>
    </LocalizationProvider>
  );

  function deleteReply(reply: Replies): void {
    replyRepository
      .deleteScheduleReply(reply.id)
      .then((response) => console.log(response))
      .catch((error) => alert(error));
    // return console.log(reply.id);
    // getScheduleReplies(reply.id)
  }

  function addReply(): void {
    replyRepository
      .storeScheduleReply({
        schedule: id,
        description: replyValue,
      })
      .then((response) => {
        console.log("reply_RESPONSE", response);
        // replyRepository.getMyScheduleReplies().then((response) => { });
        replyRepository
          .getScheduleReplies(id)
          .then((response) => {
            console.log(response);
            setScheduleReplies(response);
          })
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
    getScheduleReplies(id);
  }
}

function dateDiff(event: any) {
  return moment(event).diff(moment().format("YYYY-MM-DD"), "days");
}

export default function Dashboard() {
  return <DashboardContent />;
}
