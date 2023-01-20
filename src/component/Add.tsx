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

export function AddModal(
  addOpen: boolean,
  handleAddClose: () => void,
  handleAddSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  start: string,
  end: string
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
            </Grid>
            <Grid container item spacing={3}>
              <Grid item xs={8}>
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
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="설명"
                  name="description"
                  autoComplete="description"
                  multiline
                  rows={10}
                />
                {/* <FileInput /> */}
              </Grid>
              <Grid item xs={4}>
                <FormLabel id="radiobutton-label">반복종류</FormLabel>
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="intervalValue"
                  label="반복횟수"
                  name="intervalValue"
                  autoComplete="intervalValue"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="duration"
                  label="소요시간"
                  name="duration"
                  autoComplete="duration"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">분</InputAdornment>
                    ),
                  }}
                />
                참가자
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 30, height: 30 }} />
                  </ListItemAvatar>
                  <ListItemText />
                </ListItem>
              </Grid>
            </Grid>
            <Grid container item spacing={3}>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                  등록
                </Button>
                <Button type="reset" variant="outlined" sx={{ mt: 3, mb: 2 }}>
                  취소
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
