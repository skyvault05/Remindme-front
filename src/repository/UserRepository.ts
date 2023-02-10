import { customAxios } from "../lib/customAxios";

const rootUrl = "/api/v1/user";

export default class UserRepository {
  async getMyInfo() {
    let response = await customAxios.get(rootUrl + "/getMyInfo");
    return response.data;
  }
  async findUser(id: string) {
    let response = await customAxios.post(rootUrl + "/findUser/" + id);
    return response.data;
  }

  async addFriend(nickname: string) {
    let response = await customAxios.post(rootUrl + "/addFriend/" + nickname);
    return response.data;
  }

  async deleteFriend(nickname: string) {
    let response = await customAxios.delete(rootUrl + "/deleteFriend/" + nickname);
    return response.data;
  }

  async setNickname(nickname: string) {
    let response = await customAxios.post(rootUrl + "/setNickname/" + nickname);
    return response.data;
  }
}
