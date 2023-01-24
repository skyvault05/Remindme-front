import axios from "axios";
import { customAxios } from "../lib/customAxios";

const rootUrl = "/api/v1/schedule";

export default class ScheduleRepository {
  async getMySchedules() {
    let response = await customAxios.get(rootUrl + "/getMySchedules");
    return response.data;
  }

  async getSchedules() {
    let response = await customAxios.get(rootUrl + "/getSchedules");
    return response.data;
  }

  async getSchedule(scheduleId: number) {
    let response = await customAxios.get(rootUrl + "/getSchedule/" + scheduleId);
    return response.data;
  }

  async storeSchedule(data: any) {
    let response = await customAxios.post(rootUrl + "/storeSchedule", data);
    return response.data;
  }

  async deleteSchedule(scheduleId: number) {
    let response = await customAxios.delete(
      rootUrl + "/deleteSchedule/" + scheduleId
    );
    return response.data;
  }
}
