import axios from "axios";

const API_URL = "http://localhost:5000/api/";

let token = localStorage.getItem("user");
token = JSON.parse(localStorage.getItem("user") || "{}").token;

const PatientService = {
  getPatientById: async (id: string) => {
    return axios.get(API_URL + "patients/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default PatientService;
