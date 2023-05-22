import axios from "axios";

const API_URL = "http://localhost:5000/api/";

const AuthService = {
  login: (username: string, password: string) => {
    return axios
      .post(API_URL + "login", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  },
  logout: () => {
    localStorage.removeItem("user");
  },
  register: (username: string, password: string) => {
    return axios.post(API_URL + "register", {
      username,
      password,
    });
  },
  getUsers: () => {
    return axios.get(API_URL + "users");
  },
  getUsersWithNoClinic: () => {
    return axios.get(API_URL + "users/clinics");
  },
};

export default AuthService;
