import axios from "axios";
// const token = localStorage.getItem("token");
const token = "5|2b0TieKulgs8x8NFmguKEbtrg5HkQREdkgDwxodm14ace6c6";
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + token,
  },
});
export default apiClient;
