import axios from "axios";

const rootUrl = "http://54.238.154.254:8080/api/v1/scheduleReply";

export default class ReplyRepository {
  async getMyScheduleReplies() {
    let response = await axios.get(rootUrl + "/getMyScheduleReplies");
    return response.data;
  }

  async getScheduleReplies(scheduleId: number) {
    let response = await axios.get(rootUrl + "/getScheduleReplies" + scheduleId);
    return response.data;
  }

  async storeScheduleReply(data: any) {
    let response = await axios.post(rootUrl + "/storeScheduleReply", data);
    return response.data;
  }

  async deleteScheduleReply(scheduleId: number) {
    let response = await axios.delete(
      rootUrl + "/deleteScheduleReply/" + scheduleId
    );
    return response.data;
  }
}
