import axios, { AxiosInstance } from 'axios';

export const customAxios: AxiosInstance = axios.create({
  baseURL: "http://54.238.154.254:8080", // 기본 서버 주소 입력
});