import axios from "axios";

const rootUrl = "/api/v1/schedule";

export default class ScheduleRepository {
  async getMySchedules() {
    let response = await axios.get(rootUrl + "/getMySchedules");
    return response.data;
  }

  async getSchedules() {
    let response = await axios.get(rootUrl + "/getSchedules");
    return response.data;
  }

  async getSchedule(scheduleId: number) {
    let response = await axios.get(rootUrl + "/getSchedule/" + scheduleId);
    return response.data;
  }

  async storeSchedule(data: any) {
    let response = await axios.post(rootUrl + "/storeSchedule", data);
    return response.data;
  }

  async deleteSchedule(scheduleId: number) {
    let response = await axios.delete(
      rootUrl + "/deleteSchedule/" + scheduleId
    );
    return response.data;
  }
}
