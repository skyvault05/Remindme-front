import React from "react";
import axios from "axios";

export default class ScheduleRepository {
  async getMySchedules() {
    const url = "/api/v1/schedule/getMySchedules";
    let response = await axios.get(url);
    return response.data;
  }
}
