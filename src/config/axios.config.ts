import Axios from "axios";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_HOST + "/api",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    credentials: "omit",
  },
  withCredentials: false,
});

export default axios;
