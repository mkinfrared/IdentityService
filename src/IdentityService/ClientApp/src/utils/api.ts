import axios from "axios";

import { BASE_URL } from "utils/secrets";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default api;
