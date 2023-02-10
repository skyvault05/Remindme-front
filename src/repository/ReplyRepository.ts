import { customAxios } from "../lib/customAxios";

const rootUrl = "/api/v1/scheduleReply";

export default class ReplyRepository {
  async getMyScheduleReplies() {
    let response = await customAxios.get(rootUrl + "/getMyScheduleReplies");
    return response.data;
  }

  async getScheduleReplies(scheduleId: number) {
    let response = await customAxios.get(rootUrl + "/getScheduleReplies" + scheduleId);
    return response.data;
  }

  async storeScheduleReply(data: any) {
    let response = await customAxios.post(rootUrl + "/storeScheduleReply", data);
    return response.data;
  }

  async deleteScheduleReply(scheduleId: number) {
    let response = await customAxios.delete(
      rootUrl + "/deleteScheduleReply/" + scheduleId
    );
    return response.data;
  }
}
