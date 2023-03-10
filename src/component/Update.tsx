import * as React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";

import SendIcon from "@mui/icons-material/Send";

import { Member, Replies } from "./Dashboard";

export function UpdateModal(
  editOpen: boolean,
  handleEditClose: () => void,
  handleUpdateSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  id: number,
  title: string,
  startDate: string,
  endDate: string,
  intervalType: string,
  intervalValue: number,
  duration: string,
  description: string,
  user: Member,
  secondary: boolean,
  members: Member[],
  scheduleReplies: Replies[],
  handleDeleteClick: (id: number) => void
) {
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

  return (
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
              </Grid>
            </Grid>
            <Grid container item spacing={3}>
              <Grid item xs={8}>
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
                {/* <FileInput /> */}
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
                    <Avatar sx={{ width: 30, height: 30 }} src={user.picture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.nickname}
                    secondary={secondary ? "Secondary text" : null}
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
                      primary={member.nickname}
                      secondary={secondary ? "Secondary text" : null}
                    />
                  </ListItem>
                ))}
              </Grid>
            </Grid>
            <Grid container item spacing={3}>
              <Grid item xs={12}>
                <React.Fragment>
                  {scheduleReplies.map((a, i) => (
                    <div>{a.description}</div>
                  ))}
                </React.Fragment>
                <TextField
                  margin="normal"
                  fullWidth
                  id="scheduleReplies"
                  label="??????"
                  name="scheduleReplies"
                  autoComplete="scheduleReplies"
                  // defaultValue={scheduleReplies}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          onClick={() => sendReply()}
                          endIcon={<SendIcon />}
                        >
                          Send
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item spacing={3}>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
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
                <Button type="reset" variant="outlined" sx={{ mt: 3, mb: 2 }}>
                  ??????
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
function sendReply(): void {
  return console.log("send");
}
