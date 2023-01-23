import axios from "axios";

const rootUrl = "/api/v1/user";

export default class UserRepository {
  async getMyInfo() {
    let response = await axios.get(rootUrl + "/getMyInfo");
    return response.data;
  }
  async findUser(id: string) {
    let response = await axios.post(rootUrl + "/findUser/" + id);
    return response.data;
  }

  async addFriend(nickname: string) {
    let response = await axios.post(rootUrl + "/addFriend/" + nickname);
    return response.data;
  }

  async deleteFriend(nickname: string) {
    let response = await axios.delete(rootUrl + "/deleteFriend/" + nickname);
    return response.data;
  }

  async setNickname(nickname: string) {
    let response = await axios.post(rootUrl + "/setNickname/" + nickname);
    return response.data;
  }
}
