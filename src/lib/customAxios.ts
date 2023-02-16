import axios, { AxiosInstance } from "axios";

axios.defaults.withCredentials = true;

export const customAxios: AxiosInstance = axios.create({
  baseURL:
    "http://ec2-54-238-154-254.ap-northeast-1.compute.amazonaws.com:8080", // 기본 서버 주소 입력
});

customAxios.defaults.headers.common["Authorization"] =
  localStorage.getItem("Authorization");
