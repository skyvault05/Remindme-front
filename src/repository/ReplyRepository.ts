import axios from "axios";

const rootUrl = "/api/v1/scheduleReply";

export default class ReplyRepository {
  async getScheduleReplies() {
    let response = await axios.get(rootUrl + "/getScheduleReplies/");
    return response.data;
  }

  async getMyScheduleReplies(scheduleId: number) {
    let response = await axios.get(rootUrl + "/getMyScheduleReplies/" + scheduleId);
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
